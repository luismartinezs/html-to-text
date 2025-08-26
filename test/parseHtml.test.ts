import { describe, expect, it } from "vitest";
import { parseHtml } from "../src/index";

describe("parseHtml", () => {
  it("should accept string parameter and return object", () => {
    const result = parseHtml("<p>test</p>");
    expect(typeof result).toBe("object");
    expect(result).not.toBeNull();
    expect(result).toHaveProperty("childNodes");
  });

  it("should parse basic valid HTML without errors", () => {
    const result = parseHtml("<p>Hello</p>");
    expect(typeof result).toBe("object");
    expect(result).not.toBeNull();
    expect(result).toHaveProperty("childNodes");
  });

  it("should parse nested HTML without errors", () => {
    const result = parseHtml("<div><span>nested</span></div>");
    expect(typeof result).toBe("object");
    expect(result).not.toBeNull();
    expect(result).toHaveProperty("childNodes");
  });
});
