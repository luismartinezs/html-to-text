import { describe, expect, it } from "vitest";
import { htmlToText } from "../src/index";

describe("Block-level elements conversion", () => {
  describe("Paragraph elements", () => {
    it("should convert single paragraph to text with newline", () => {
      const result = htmlToText("<p>Hello</p>");
      expect(result).toBe("Hello\n");
    });

    it("should convert multiple paragraphs to text with newlines", () => {
      const result = htmlToText("<p>Hello</p><p>World</p>");
      expect(result).toBe("Hello\nWorld\n");
    });
  });

  describe("Line break elements", () => {
    it("should convert br tag to newline", () => {
      const result = htmlToText("Hello<br>World");
      expect(result).toBe("Hello\nWorld");
    });
  });

  describe("List item elements", () => {
    it("should convert list items to text with newlines", () => {
      const result = htmlToText("<li>Item1</li><li>Item2</li>");
      expect(result).toBe("Item1\nItem2\n");
    });
  });

  describe("Mixed block elements", () => {
    it("should convert div and paragraph to text with newlines", () => {
      const result = htmlToText("<div>Hello</div><p>World</p>");
      expect(result).toBe("Hello\nWorld\n");
    });
  });

  describe("Heading elements", () => {
    it("should convert heading to text with newline", () => {
      const result = htmlToText("<h1>Title</h1>");
      expect(result).toBe("Title\n");
    });
  });
});
