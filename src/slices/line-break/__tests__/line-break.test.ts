import { describe, it, expect } from "vitest";
import { LineBreakHandler as LineBreakDomain } from "../domain";
import { LineBreakHandler } from "../handler";
import type { Parse5Node } from "../../../processing-context";
import { createDefaultContext } from "../../../processing-context";

describe("LineBreakDomain", () => {
  const domain = new LineBreakDomain();

  describe("isLineBreak", () => {
    it("should return true for br elements", () => {
      expect(domain.isLineBreak("br")).toBe(true);
    });

    it("should return true for br elements with different cases", () => {
      expect(domain.isLineBreak("BR")).toBe(true);
      expect(domain.isLineBreak("Br")).toBe(true);
      expect(domain.isLineBreak("bR")).toBe(true);
    });

    it("should return false for non-br elements", () => {
      expect(domain.isLineBreak("div")).toBe(false);
      expect(domain.isLineBreak("p")).toBe(false);
      expect(domain.isLineBreak("span")).toBe(false);
      expect(domain.isLineBreak("hr")).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(domain.isLineBreak("")).toBe(false);
    });
  });

  describe("handle", () => {
    it("should return line break for br elements", () => {
      const result = domain.handle({ tagName: "br" });
      expect(result.lineBreak).toBe("\n");
    });

    it("should return line break for br elements with different cases", () => {
      expect(domain.handle({ tagName: "BR" }).lineBreak).toBe("\n");
      expect(domain.handle({ tagName: "Br" }).lineBreak).toBe("\n");
      expect(domain.handle({ tagName: "bR" }).lineBreak).toBe("\n");
    });

    it("should return empty string for non-br elements", () => {
      expect(domain.handle({ tagName: "div" }).lineBreak).toBe("");
      expect(domain.handle({ tagName: "p" }).lineBreak).toBe("");
      expect(domain.handle({ tagName: "span" }).lineBreak).toBe("");
    });

    it("should return empty string for empty tag name", () => {
      expect(domain.handle({ tagName: "" }).lineBreak).toBe("");
    });
  });
});

describe("LineBreakHandler", () => {
  const handler = new LineBreakHandler();
  const context = createDefaultContext();

  describe("canHandle", () => {
    it("should return true for br elements", () => {
      const brNode: Parse5Node = {
        nodeName: "br",
      };

      expect(handler.canHandle(brNode)).toBe(true);
    });

    it("should return true for br elements with different cases", () => {
      const brNodeUpper: Parse5Node = {
        nodeName: "BR",
      };

      expect(handler.canHandle(brNodeUpper)).toBe(true);
    });

    it("should return false for non-br elements", () => {
      const divNode: Parse5Node = {
        nodeName: "div",
      };

      expect(handler.canHandle(divNode)).toBe(false);
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
    it("should return line break for br elements", () => {
      const brNode: Parse5Node = {
        nodeName: "br",
      };

      const result = handler.handle(brNode, context);
      expect(result).toBe("\n");
    });

    it("should return line break for br elements with different cases", () => {
      const brNodeUpper: Parse5Node = {
        nodeName: "BR",
      };

      const result = handler.handle(brNodeUpper, context);
      expect(result).toBe("\n");
    });

    it("should return empty string for non-br elements", () => {
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

    it("should handle self-closing br elements", () => {
      const brNode: Parse5Node = {
        nodeName: "br",
        attrs: [],
      };

      const result = handler.handle(brNode, context);
      expect(result).toBe("\n");
    });
  });
});
