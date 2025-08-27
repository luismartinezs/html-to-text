import { describe, it, expect } from "vitest";
import { TextExtractor } from "../domain";
import { TextExtractionHandler } from "../handler";
import type { Parse5Node } from "../../../processing-context";
import { createDefaultContext } from "../../../processing-context";

describe("TextExtractor", () => {
  const extractor = new TextExtractor();

  it("should extract text from text nodes", () => {
    const textNode: Parse5Node = {
      nodeName: "#text",
      value: "Hello world",
    };

    const result = extractor.extract({ node: textNode });
    expect(result.text).toBe("Hello world");
  });

  it("should return empty string for text nodes without value", () => {
    const textNode: Parse5Node = {
      nodeName: "#text",
    };

    const result = extractor.extract({ node: textNode });
    expect(result.text).toBe("");
  });

  it("should return empty string for non-text nodes", () => {
    const elementNode: Parse5Node = {
      nodeName: "div",
      value: "This should be ignored",
    };

    const result = extractor.extract({ node: elementNode });
    expect(result.text).toBe("");
  });

  it("should handle whitespace text", () => {
    const textNode: Parse5Node = {
      nodeName: "#text",
      value: "   \n\t   ",
    };

    const result = extractor.extract({ node: textNode });
    expect(result.text).toBe("   \n\t   ");
  });
});

describe("TextExtractionHandler", () => {
  const handler = new TextExtractionHandler();
  const context = createDefaultContext();

  describe("canHandle", () => {
    it("should return true for text nodes", () => {
      const textNode: Parse5Node = {
        nodeName: "#text",
        value: "Hello",
      };

      expect(handler.canHandle(textNode)).toBe(true);
    });

    it("should return false for element nodes", () => {
      const elementNode: Parse5Node = {
        nodeName: "div",
      };

      expect(handler.canHandle(elementNode)).toBe(false);
    });

    it("should return false for nodes without nodeName", () => {
      const fragmentNode: Parse5Node = {};

      expect(handler.canHandle(fragmentNode)).toBe(false);
    });
  });

  describe("handle", () => {
    it("should extract text from text nodes", () => {
      const textNode: Parse5Node = {
        nodeName: "#text",
        value: "Test content",
      };

      const result = handler.handle(textNode, context);
      expect(result).toBe("Test content");
    });

    it("should return empty string for non-text nodes", () => {
      const elementNode: Parse5Node = {
        nodeName: "p",
      };

      const result = handler.handle(elementNode, context);
      expect(result).toBe("");
    });

    it("should preserve special characters", () => {
      const textNode: Parse5Node = {
        nodeName: "#text",
        value: "Special chars: àáâãäå æç",
      };

      const result = handler.handle(textNode, context);
      expect(result).toBe("Special chars: àáâãäå æç");
    });

    it("should handle empty text nodes", () => {
      const textNode: Parse5Node = {
        nodeName: "#text",
        value: "",
      };

      const result = handler.handle(textNode, context);
      expect(result).toBe("");
    });
  });
});
