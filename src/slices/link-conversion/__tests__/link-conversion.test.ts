import { describe, it, expect } from "vitest";
import { LinkConverter } from "../domain";
import { LinkConversionHandler } from "../handler";
import type { Parse5Node } from "../../../processing-context";
import { createDefaultContext } from "../../../processing-context";

describe("LinkConverter", () => {
  const converter = new LinkConverter();

  describe("convert", () => {
    it("should convert link with text content to markdown format", () => {
      const input = {
        href: "https://example.com",
        textContent: "Example Link",
      };

      const result = converter.convert(input);
      expect(result.convertedLink).toBe("[Example Link](https://example.com)");
    });

    it("should handle link without text content", () => {
      const input = {
        href: "https://example.com",
        textContent: "",
      };

      const result = converter.convert(input);
      expect(result.convertedLink).toBe("https://example.com");
    });

    it("should handle link without text content (whitespace only)", () => {
      const input = {
        href: "https://example.com",
        textContent: "   ",
      };

      const result = converter.convert(input);
      expect(result.convertedLink).toBe("https://example.com");
    });

    it("should return text content when href is missing", () => {
      const input = {
        textContent: "Just text",
      };

      const result = converter.convert(input);
      expect(result.convertedLink).toBe("Just text");
    });

    it("should sanitize unsafe protocols", () => {
      const input = {
        href: "javascript:alert('xss')",
        textContent: "Malicious Link",
      };

      const result = converter.convert(input);
      expect(result.convertedLink).toBe("Malicious Link");
    });

    it("should allow http protocol", () => {
      const input = {
        href: "http://example.com",
        textContent: "HTTP Link",
      };

      const result = converter.convert(input);
      expect(result.convertedLink).toBe("[HTTP Link](http://example.com)");
    });

    it("should allow https protocol", () => {
      const input = {
        href: "https://example.com",
        textContent: "HTTPS Link",
      };

      const result = converter.convert(input);
      expect(result.convertedLink).toBe("[HTTPS Link](https://example.com)");
    });

    it("should allow mailto protocol", () => {
      const input = {
        href: "mailto:test@example.com",
        textContent: "Email Link",
      };

      const result = converter.convert(input);
      expect(result.convertedLink).toBe(
        "[Email Link](mailto:test@example.com)"
      );
    });

    it("should reject data: protocol", () => {
      const input = {
        href: "data:text/html,<script>alert('xss')</script>",
        textContent: "Data Link",
      };

      const result = converter.convert(input);
      expect(result.convertedLink).toBe("Data Link");
    });

    it("should reject file: protocol", () => {
      const input = {
        href: "file:///etc/passwd",
        textContent: "File Link",
      };

      const result = converter.convert(input);
      expect(result.convertedLink).toBe("File Link");
    });

    it("should treat malformed URLs as relative URLs", () => {
      const input = {
        href: "not-a-valid-url",
        textContent: "Relative-like URL",
      };

      const result = converter.convert(input);
      expect(result.convertedLink).toBe("[Relative-like URL](not-a-valid-url)");
    });

    it("should handle truly invalid URLs that cause URL parsing to fail", () => {
      const input = {
        href: "http://[invalid",
        textContent: "Invalid URL",
      };

      const result = converter.convert(input);
      expect(result.convertedLink).toBe("Invalid URL");
    });

    it("should handle relative URLs", () => {
      const input = {
        href: "/relative/path",
        textContent: "Relative Link",
      };

      const result = converter.convert(input);
      expect(result.convertedLink).toBe("[Relative Link](/relative/path)");
    });
  });
});

describe("LinkConversionHandler", () => {
  const handler = new LinkConversionHandler();
  const context = createDefaultContext();

  describe("canHandle", () => {
    it("should return true for anchor elements", () => {
      const anchorNode: Parse5Node = {
        nodeName: "a",
      };

      expect(handler.canHandle(anchorNode)).toBe(true);
    });

    it("should return false for non-anchor elements", () => {
      const divNode: Parse5Node = {
        nodeName: "div",
      };

      expect(handler.canHandle(divNode)).toBe(false);
    });

    it("should return false for text nodes", () => {
      const textNode: Parse5Node = {
        nodeName: "#text",
      };

      expect(handler.canHandle(textNode)).toBe(false);
    });
  });

  describe("handle", () => {
    it("should return empty string for non-anchor elements", () => {
      const divNode: Parse5Node = {
        nodeName: "div",
      };

      const result = handler.handle(divNode, context);
      expect(result).toBe("");
    });

    it("should handle anchor with href and no children", () => {
      const anchorNode: Parse5Node = {
        nodeName: "a",
        attrs: [{ name: "href", value: "https://example.com" }],
      };

      const result = handler.handle(anchorNode, context);
      expect(result).toBe("https://example.com");
    });

    it("should handle anchor without href", () => {
      const anchorNode: Parse5Node = {
        nodeName: "a",
        attrs: [],
      };

      const result = handler.handle(anchorNode, context);
      expect(result).toBe("");
    });
  });
});
