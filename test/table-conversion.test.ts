import { describe, expect, it } from "vitest";
import { htmlToText } from "../src/index";

describe("Table conversion", () => {
  describe("Basic table structure", () => {
    it("should convert simple single row table to pipe format", () => {
      const result = htmlToText("<table><tr><td>A</td><td>B</td></tr></table>");
      expect(result).toBe("| A | B |\n");
    });

    it("should handle empty cells with proper spacing", () => {
      const result = htmlToText(
        "<table><tr><td>A</td><td></td><td>C</td></tr></table>"
      );
      expect(result).toBe("| A |  | C |\n");
    });

    it("should convert multi-row table with consistent formatting", () => {
      const result = htmlToText(
        "<table><tr><td>A</td><td>B</td></tr><tr><td>C</td><td>D</td></tr></table>"
      );
      expect(result).toBe("| A | B |\n| C | D |\n");
    });
  });

  describe("Header elements", () => {
    it("should treat th elements as regular cells", () => {
      const result = htmlToText(
        "<table><tr><th>Header</th><td>Cell</td></tr></table>"
      );
      expect(result).toBe("| Header | Cell |\n");
    });
  });

  describe("Nested content in cells", () => {
    it("should extract text content from nested HTML inside cells", () => {
      const result = htmlToText(
        "<table><tr><td>Hello <strong>world</strong></td></tr></table>"
      );
      expect(result).toBe("| Hello world |\n");
    });
  });
});
