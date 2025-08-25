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
});
