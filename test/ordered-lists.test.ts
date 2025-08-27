import { describe, expect, it } from "vitest";
import { htmlToText } from "../src/index";

describe("Ordered lists conversion", () => {
  describe("Basic list conversion", () => {
    it("should convert multiple list items to numbered points", () => {
      const result = htmlToText("<ol><li>First</li><li>Second</li></ol>");
      expect(result).toBe("1. First\n2. Second\n");
    });

    it("should convert single list item to numbered point", () => {
      const result = htmlToText("<ol><li>Only</li></ol>");
      expect(result).toBe("1. Only\n");
    });
  });

  describe("Counter reset", () => {
    it("should reset counter for each new ordered list", () => {
      const result = htmlToText(
        "<ol><li>First</li></ol><ol><li>Second</li></ol>"
      );
      expect(result).toBe("1. First\n1. Second\n");
    });
  });

  describe("Start attribute support", () => {
    it("should honor start attribute for numbering", () => {
      const result = htmlToText('<ol start="5"><li>Item</li></ol>');
      expect(result).toBe("5. Item\n");
    });
  });

  describe("Empty list items", () => {
    it("should convert empty list item to empty numbered point", () => {
      const result = htmlToText("<ol><li></li></ol>");
      expect(result).toBe("1. \n");
    });
  });

  describe("Nested lists", () => {
    it("should convert nested ordered list with proper indentation and separate numbering", () => {
      const result = htmlToText(
        "<ol><li>First<ol><li>Nested</li></ol></li></ol>"
      );
      expect(result).toBe("1. First\n  1. Nested\n");
    });
  });
});
