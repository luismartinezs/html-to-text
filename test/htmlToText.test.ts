import { describe, expect, it } from "vitest";
import { htmlToText } from "../src/index";

describe("htmlToText", () => {
  it("should be importable from main entry point", () => {
    expect(htmlToText).toBeDefined();
    expect(typeof htmlToText).toBe("function");
  });

  it("should accept string parameter and return string", () => {
    const result = htmlToText("<p>test</p>");
    expect(typeof result).toBe("string");
  });

  it("should return non-empty string for any input", () => {
    const result = htmlToText("<p>any html</p>");
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });

  it("should handle empty string input", () => {
    const result = htmlToText("");
    expect(typeof result).toBe("string");
  });

  describe("HTML entity decoding", () => {
    it("should decode non-breaking space entity", () => {
      const result = htmlToText("<p>Hello&nbsp;World</p>");
      expect(result).toBe("Hello World");
    });

    it("should decode ampersand entity", () => {
      const result = htmlToText("<div>A&amp;B</div>");
      expect(result).toBe("A&B");
    });

    it("should decode angle bracket entities", () => {
      const result = htmlToText("<span>&lt;script&gt;</span>");
      expect(result).toBe("<script>");
    });

    it("should decode quote entities", () => {
      const result = htmlToText("<em>&quot;quoted&quot;</em>");
      expect(result).toBe('"quoted"');
    });

    it("should decode apostrophe entity", () => {
      const result = htmlToText("<strong>&#39;apostrophe&#39;</strong>");
      expect(result).toBe("'apostrophe'");
    });
  });
});
