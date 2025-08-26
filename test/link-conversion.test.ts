import { describe, expect, it } from "vitest";
import { htmlToText } from "../src/index";

describe("Link conversion", () => {
  it("should convert link with text to markdown format", () => {
    const result = htmlToText('<a href="https://example.com">Click here</a>');
    expect(result).toBe("[Click here](https://example.com)");
  });

  it("should convert link without text to URL only", () => {
    const result = htmlToText('<a href="https://example.com"></a>');
    expect(result).toBe("https://example.com");
  });

  it("should convert link without href to plain text", () => {
    const result = htmlToText("<a>No href</a>");
    expect(result).toBe("No href");
  });
});
