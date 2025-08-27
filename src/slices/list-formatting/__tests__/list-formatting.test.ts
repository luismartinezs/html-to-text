import { describe, it, expect } from "vitest";
import { ListFormatter } from "../domain";
import { ListFormattingHandler } from "../handler";
import type { Parse5Node } from "../../../processing-context";
import { createDefaultContext } from "../../../processing-context";
import type { ListContext } from "../types";

describe("ListFormatter", () => {
  const formatter = new ListFormatter();

  describe("isListElement", () => {
    it("should return true for ul elements", () => {
      expect(formatter.isListElement("ul")).toBe(true);
    });

    it("should return true for ol elements", () => {
      expect(formatter.isListElement("ol")).toBe(true);
    });

    it("should return true for li elements", () => {
      expect(formatter.isListElement("li")).toBe(true);
    });

    it("should handle case insensitive tag names", () => {
      expect(formatter.isListElement("UL")).toBe(true);
      expect(formatter.isListElement("OL")).toBe(true);
      expect(formatter.isListElement("LI")).toBe(true);
    });

    it("should return false for non-list elements", () => {
      expect(formatter.isListElement("div")).toBe(false);
      expect(formatter.isListElement("p")).toBe(false);
      expect(formatter.isListElement("span")).toBe(false);
    });
  });

  describe("isListContainer", () => {
    it("should return true for ul and ol elements", () => {
      expect(formatter.isListContainer("ul")).toBe(true);
      expect(formatter.isListContainer("ol")).toBe(true);
    });

    it("should return false for li elements", () => {
      expect(formatter.isListContainer("li")).toBe(false);
    });

    it("should return false for non-list elements", () => {
      expect(formatter.isListContainer("div")).toBe(false);
    });
  });

  describe("isListItem", () => {
    it("should return true for li elements", () => {
      expect(formatter.isListItem("li")).toBe(true);
    });

    it("should return false for ul and ol elements", () => {
      expect(formatter.isListItem("ul")).toBe(false);
      expect(formatter.isListItem("ol")).toBe(false);
    });

    it("should return false for non-list elements", () => {
      expect(formatter.isListItem("div")).toBe(false);
    });
  });

  describe("createListContext", () => {
    it("should create ul context", () => {
      const context = formatter.createListContext("ul", 0, 1);
      expect(context).toEqual({
        type: "ul",
        depth: 0,
        counter: 1,
      });
    });

    it("should create ol context", () => {
      const context = formatter.createListContext("ol", 1, 3);
      expect(context).toEqual({
        type: "ol",
        depth: 1,
        counter: 3,
      });
    });

    it("should default to ol for unknown types", () => {
      const context = formatter.createListContext("unknown", 0, 1);
      expect(context.type).toBe("ol");
    });
  });

  describe("formatListItem", () => {
    it("should format unordered list items", () => {
      const context: ListContext = { type: "ul", depth: 0, counter: 1 };
      const input = {
        tagName: "li",
        content: "Item content",
        context,
      };

      const result = formatter.formatListItem(input);
      expect(result.formattedList).toBe("* Item content\n");
      expect(result.updatedContext).toEqual(context);
    });

    it("should format ordered list items", () => {
      const context: ListContext = { type: "ol", depth: 0, counter: 1 };
      const input = {
        tagName: "li",
        content: "Item content",
        context,
      };

      const result = formatter.formatListItem(input);
      expect(result.formattedList).toBe("1. Item content\n");
      expect(result.updatedContext).toEqual({
        type: "ol",
        depth: 0,
        counter: 2,
      });
    });

    it("should handle indented list items", () => {
      const context: ListContext = { type: "ul", depth: 2, counter: 1 };
      const input = {
        tagName: "li",
        content: "Nested item",
        context,
      };

      const result = formatter.formatListItem(input);
      expect(result.formattedList).toBe("    * Nested item\n");
    });

    it("should increment counter for ordered lists", () => {
      const context: ListContext = { type: "ol", depth: 0, counter: 5 };
      const input = {
        tagName: "li",
        content: "Item 5",
        context,
      };

      const result = formatter.formatListItem(input);
      expect(result.formattedList).toBe("5. Item 5\n");
      expect(result.updatedContext?.counter).toBe(6);
    });

    it("should return content as-is without context", () => {
      const input = {
        tagName: "li",
        content: "Content",
      };

      const result = formatter.formatListItem(input);
      expect(result.formattedList).toBe("Content");
    });
  });

  describe("formatListContainer", () => {
    it("should pass through content for list containers", () => {
      const input = {
        tagName: "ul",
        content: "List content",
      };

      const result = formatter.formatListContainer(input);
      expect(result.formattedList).toBe("List content");
    });
  });

  describe("format", () => {
    it("should route li elements to formatListItem", () => {
      const context: ListContext = { type: "ul", depth: 0, counter: 1 };
      const input = {
        tagName: "li",
        content: "Item",
        context,
      };

      const result = formatter.format(input);
      expect(result.formattedList).toBe("* Item\n");
    });

    it("should route ul elements to formatListContainer", () => {
      const input = {
        tagName: "ul",
        content: "Container content",
      };

      const result = formatter.format(input);
      expect(result.formattedList).toBe("Container content");
    });

    it("should return content as-is for non-list elements", () => {
      const input = {
        tagName: "div",
        content: "Non-list content",
      };

      const result = formatter.format(input);
      expect(result.formattedList).toBe("Non-list content");
    });
  });
});

describe("ListFormattingHandler", () => {
  const handler = new ListFormattingHandler();
  const context = createDefaultContext();

  describe("canHandle", () => {
    it("should return true for ul elements", () => {
      const ulNode: Parse5Node = {
        nodeName: "ul",
      };

      expect(handler.canHandle(ulNode)).toBe(true);
    });

    it("should return true for ol elements", () => {
      const olNode: Parse5Node = {
        nodeName: "ol",
      };

      expect(handler.canHandle(olNode)).toBe(true);
    });

    it("should return true for li elements", () => {
      const liNode: Parse5Node = {
        nodeName: "li",
      };

      expect(handler.canHandle(liNode)).toBe(true);
    });

    it("should return false for non-list elements", () => {
      const divNode: Parse5Node = {
        nodeName: "div",
      };

      expect(handler.canHandle(divNode)).toBe(false);
    });

    it("should return false for nodes without nodeName", () => {
      const fragmentNode: Parse5Node = {};

      expect(handler.canHandle(fragmentNode)).toBe(false);
    });
  });

  describe("handle", () => {
    it("should return empty string for non-list elements", () => {
      const divNode: Parse5Node = {
        nodeName: "div",
      };

      const result = handler.handle(divNode, context);
      expect(result).toBe("");
    });

    it("should return empty string for nodes without nodeName", () => {
      const fragmentNode: Parse5Node = {};

      const result = handler.handle(fragmentNode, context);
      expect(result).toBe("");
    });

    it("should handle empty ul elements", () => {
      const ulNode: Parse5Node = {
        nodeName: "ul",
        childNodes: [],
      };

      const result = handler.handle(ulNode, context);
      expect(result).toBe("");
    });

    it("should handle empty ol elements", () => {
      const olNode: Parse5Node = {
        nodeName: "ol",
        childNodes: [],
      };

      const result = handler.handle(olNode, context);
      expect(result).toBe("");
    });

    it("should handle li elements without list context", () => {
      const liNode: Parse5Node = {
        nodeName: "li",
        childNodes: [],
      };

      const result = handler.handle(liNode, context);
      expect(result).toBe("\n");
    });
  });
});
