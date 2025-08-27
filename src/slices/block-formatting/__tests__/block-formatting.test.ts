import { describe, it, expect } from "vitest";
import { BlockFormatter } from "../domain";
import { BlockFormattingHandler } from "../handler";
import type { Parse5Node } from "../../../processing-context";
import { createDefaultContext } from "../../../processing-context";

describe("BlockFormatter", () => {
  const formatter = new BlockFormatter();

  describe("isBlockElement", () => {
    it("should identify paragraph elements as block elements", () => {
      expect(formatter.isBlockElement("p")).toBe(true);
    });

    it("should identify div elements as block elements", () => {
      expect(formatter.isBlockElement("div")).toBe(true);
    });

    it("should identify heading elements as block elements", () => {
      expect(formatter.isBlockElement("h1")).toBe(true);
      expect(formatter.isBlockElement("h2")).toBe(true);
      expect(formatter.isBlockElement("h3")).toBe(true);
      expect(formatter.isBlockElement("h4")).toBe(true);
      expect(formatter.isBlockElement("h5")).toBe(true);
      expect(formatter.isBlockElement("h6")).toBe(true);
    });

    it("should identify semantic elements as block elements", () => {
      expect(formatter.isBlockElement("section")).toBe(true);
      expect(formatter.isBlockElement("article")).toBe(true);
      expect(formatter.isBlockElement("header")).toBe(true);
      expect(formatter.isBlockElement("footer")).toBe(true);
      expect(formatter.isBlockElement("main")).toBe(true);
      expect(formatter.isBlockElement("aside")).toBe(true);
      expect(formatter.isBlockElement("nav")).toBe(true);
    });

    it("should not identify inline elements as block elements", () => {
      expect(formatter.isBlockElement("span")).toBe(false);
      expect(formatter.isBlockElement("a")).toBe(false);
      expect(formatter.isBlockElement("strong")).toBe(false);
      expect(formatter.isBlockElement("em")).toBe(false);
    });

    it("should handle case insensitive tag names", () => {
      expect(formatter.isBlockElement("P")).toBe(true);
      expect(formatter.isBlockElement("DIV")).toBe(true);
      expect(formatter.isBlockElement("H1")).toBe(true);
    });
  });

  describe("format", () => {
    it("should add line break before block element when there's existing content", () => {
      const input = {
        tagName: "p",
        content: "Hello",
        isStart: true,
        hasExistingContent: true,
      };

      const result = formatter.format(input);
      expect(result.formattedContent).toBe("\nHello");
    });

    it("should not add line break before block element when no existing content", () => {
      const input = {
        tagName: "p",
        content: "Hello",
        isStart: true,
        hasExistingContent: false,
      };

      const result = formatter.format(input);
      expect(result.formattedContent).toBe("Hello");
    });

    it("should add line break after block element", () => {
      const input = {
        tagName: "p",
        content: "Hello",
        isStart: false,
        hasExistingContent: true,
      };

      const result = formatter.format(input);
      expect(result.formattedContent).toBe("Hello\n");
    });

    it("should not format non-block elements", () => {
      const input = {
        tagName: "span",
        content: "Hello",
        isStart: true,
        hasExistingContent: true,
      };

      const result = formatter.format(input);
      expect(result.formattedContent).toBe("Hello");
    });

    it("should handle empty content", () => {
      const input = {
        tagName: "p",
        content: "",
        isStart: true,
        hasExistingContent: true,
      };

      const result = formatter.format(input);
      expect(result.formattedContent).toBe("");
    });

    it("should handle div elements", () => {
      const input = {
        tagName: "div",
        content: "Content",
        isStart: true,
        hasExistingContent: true,
      };

      const result = formatter.format(input);
      expect(result.formattedContent).toBe("\nContent");
    });

    it("should handle heading elements", () => {
      const input = {
        tagName: "h1",
        content: "Title",
        isStart: false,
        hasExistingContent: true,
      };

      const result = formatter.format(input);
      expect(result.formattedContent).toBe("Title\n");
    });
  });
});

describe("BlockFormattingHandler", () => {
  const handler = new BlockFormattingHandler();
  const context = createDefaultContext();

  describe("canHandle", () => {
    it("should return true for paragraph elements", () => {
      const pNode: Parse5Node = {
        nodeName: "p",
      };

      expect(handler.canHandle(pNode)).toBe(true);
    });

    it("should return true for div elements", () => {
      const divNode: Parse5Node = {
        nodeName: "div",
      };

      expect(handler.canHandle(divNode)).toBe(true);
    });

    it("should return true for heading elements", () => {
      const h1Node: Parse5Node = {
        nodeName: "h1",
      };

      expect(handler.canHandle(h1Node)).toBe(true);
    });

    it("should return false for inline elements", () => {
      const spanNode: Parse5Node = {
        nodeName: "span",
      };

      expect(handler.canHandle(spanNode)).toBe(false);
    });

    it("should return false for nodes without nodeName", () => {
      const fragmentNode: Parse5Node = {};

      expect(handler.canHandle(fragmentNode)).toBe(false);
    });

    it("should return false for text nodes", () => {
      const textNode: Parse5Node = {
        nodeName: "#text",
      };

      expect(handler.canHandle(textNode)).toBe(false);
    });
  });

  describe("handle", () => {
    it("should return empty string for non-block elements", () => {
      const spanNode: Parse5Node = {
        nodeName: "span",
      };

      const result = handler.handle(spanNode, context);
      expect(result).toBe("");
    });

    it("should add closing line break for block elements without children", () => {
      const pNode: Parse5Node = {
        nodeName: "p",
        childNodes: [],
      };

      const result = handler.handle(pNode, context);
      expect(result).toBe("\n");
    });

    it("should return empty string for nodes without nodeName", () => {
      const fragmentNode: Parse5Node = {};

      const result = handler.handle(fragmentNode, context);
      expect(result).toBe("");
    });
  });
});
