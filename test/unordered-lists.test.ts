import { describe, expect, it } from "vitest";
import { htmlToText } from "../src/index";

describe("Unordered lists conversion", () => {
  describe("Basic list conversion", () => {
    it("should convert single list item to bullet point", () => {
      const result = htmlToText("<ul><li>Item 1</li></ul>");
      expect(result).toBe("* Item 1\n");
    });

    it("should convert multiple list items to bullet points", () => {
      const result = htmlToText("<ul><li>Item 1</li><li>Item 2</li></ul>");
      expect(result).toBe("* Item 1\n* Item 2\n");
    });
  });

  describe("Empty list items", () => {
    it("should convert empty list item to empty bullet point", () => {
      const result = htmlToText("<ul><li></li></ul>");
      expect(result).toBe("* \n");
    });

    it("should handle mixed empty and filled list items", () => {
      const result = htmlToText("<ul><li>Content</li><li></li></ul>");
      expect(result).toBe("* Content\n* \n");
    });
  });

  describe("Mixed content in list items", () => {
    it("should convert list item with bold text", () => {
      const result = htmlToText("<ul><li>Bold <strong>text</strong></li></ul>");
      expect(result).toBe("* Bold text\n");
    });

    it("should convert list item with link", () => {
      const result = htmlToText(
        '<ul><li><a href="https://example.com">Link</a></li></ul>'
      );
      expect(result).toBe("* [Link](https://example.com)\n");
    });
  });

  describe("Nested lists", () => {
    it("should convert nested list with proper indentation", () => {
      const result = htmlToText(
        "<ul><li>Item 1<ul><li>Nested</li></ul></li></ul>"
      );
      expect(result).toBe("* Item 1\n  * Nested\n");
    });
  });
});
