import { describe, expect, it } from "vitest";
import { htmlToText } from "../src/index";

describe("Ordered lists conversion", () => {
  describe("Basic numbering", () => {
    it("should convert single ordered list item", () => {
      const result = htmlToText("<ol><li>First item</li></ol>");
      expect(result).toBe("1. First item\n");
    });

    it("should convert multiple ordered list items with sequential numbering", () => {
      const result = htmlToText(
        "<ol><li>First</li><li>Second</li><li>Third</li></ol>"
      );
      expect(result).toBe("1. First\n2. Second\n3. Third\n");
    });

    it("should restart numbering for separate ordered lists", () => {
      const result = htmlToText(
        "<ol><li>First list item</li></ol><ol><li>Second list item</li></ol>"
      );
      expect(result).toBe("1. First list item\n1. Second list item\n");
    });

    it("should handle ordered list with single item", () => {
      const result = htmlToText("<ol><li>Only item</li></ol>");
      expect(result).toBe("1. Only item\n");
    });

    it("should handle ordered list with many items", () => {
      const result = htmlToText(
        "<ol><li>Item 1</li><li>Item 2</li><li>Item 3</li><li>Item 4</li><li>Item 5</li></ol>"
      );
      expect(result).toBe(
        "1. Item 1\n2. Item 2\n3. Item 3\n4. Item 4\n5. Item 5\n"
      );
    });
  });

  describe("Start attribute support", () => {
    it("should respect start attribute for initial numbering", () => {
      const result = htmlToText(
        '<ol start="5"><li>Fifth item</li><li>Sixth item</li></ol>'
      );
      expect(result).toBe("5. Fifth item\n6. Sixth item\n");
    });

    it("should handle start='0' correctly", () => {
      const result = htmlToText(
        '<ol start="0"><li>Zero item</li><li>One item</li></ol>'
      );
      expect(result).toBe("0. Zero item\n1. One item\n");
    });

    it("should handle negative start values", () => {
      const result = htmlToText(
        '<ol start="-2"><li>Negative two</li><li>Negative one</li></ol>'
      );
      expect(result).toBe("-2. Negative two\n-1. Negative one\n");
    });

    it("should default to 1 for non-numeric start values", () => {
      const result = htmlToText('<ol start="abc"><li>Item</li></ol>');
      expect(result).toBe("1. Item\n");
    });

    it("should default to 1 for empty start attribute", () => {
      const result = htmlToText('<ol start=""><li>Item</li></ol>');
      expect(result).toBe("1. Item\n");
    });

    it("should truncate floating point start values", () => {
      const result = htmlToText('<ol start="3.7"><li>Item</li></ol>');
      expect(result).toBe("3. Item\n");
    });

    it("should handle large start values", () => {
      const result = htmlToText('<ol start="100"><li>Hundredth item</li></ol>');
      expect(result).toBe("100. Hundredth item\n");
    });

    it("should handle start with whitespace", () => {
      const result = htmlToText('<ol start=" 10 "><li>Item</li></ol>');
      expect(result).toBe("10. Item\n");
    });
  });

  describe("Single level nesting", () => {
    it("should handle ordered list nested in ordered list", () => {
      const result = htmlToText(`
        <ol>
          <li>Parent 1
            <ol>
              <li>Child A</li>
              <li>Child B</li>
            </ol>
          </li>
        </ol>
      `);
      expect(result).toBe("1. Parent 1\n  1. Child A\n  2. Child B\n");
    });

    it("should maintain separate counters for multiple nested lists", () => {
      const result = htmlToText(`
        <ol>
          <li>Parent 1
            <ol><li>Child A</li></ol>
          </li>
          <li>Parent 2
            <ol><li>Child A</li></ol>
          </li>
        </ol>
      `);
      expect(result).toBe(
        "1. Parent 1\n  1. Child A\n2. Parent 2\n  1. Child A\n"
      );
    });

    it("should handle nested list with start attribute", () => {
      const result = htmlToText(`
        <ol>
          <li>Parent 1
            <ol start="10">
              <li>Child 10</li>
              <li>Child 11</li>
            </ol>
          </li>
        </ol>
      `);
      expect(result).toBe("1. Parent 1\n  10. Child 10\n  11. Child 11\n");
    });

    it("should handle multiple nested lists at same level", () => {
      const result = htmlToText(`
        <ol>
          <li>Parent 1
            <ol><li>First nested</li></ol>
            <ol><li>Second nested</li></ol>
          </li>
        </ol>
      `);
      expect(result).toBe(
        "1. Parent 1\n  1. First nested\n  1. Second nested\n"
      );
    });
  });

  describe("Deep nesting", () => {
    it("should handle three-level nesting with proper indentation", () => {
      const result = htmlToText(`
        <ol>
          <li>L1
            <ol>
              <li>L2
                <ol>
                  <li>L3</li>
                </ol>
              </li>
            </ol>
          </li>
        </ol>
      `);
      expect(result).toBe("1. L1\n  1. L2\n    1. L3\n");
    });

    it("should handle complex deep nesting scenario", () => {
      const result = htmlToText(`
        <ol>
          <li>Level 1 Item 1
            <ol start="10">
              <li>Level 2 Item 10
                <ol>
                  <li>Level 3 Item 1</li>
                  <li>Level 3 Item 2</li>
                </ol>
              </li>
              <li>Level 2 Item 11</li>
            </ol>
          </li>
          <li>Level 1 Item 2</li>
        </ol>
      `);
      expect(result).toBe(
        "1. Level 1 Item 1\n  10. Level 2 Item 10\n    1. Level 3 Item 1\n    2. Level 3 Item 2\n  11. Level 2 Item 11\n2. Level 1 Item 2\n"
      );
    });

    it("should handle four-level nesting", () => {
      const result = htmlToText(`
        <ol>
          <li>L1
            <ol>
              <li>L2
                <ol>
                  <li>L3
                    <ol>
                      <li>L4</li>
                    </ol>
                  </li>
                </ol>
              </li>
            </ol>
          </li>
        </ol>
      `);
      expect(result).toBe("1. L1\n  1. L2\n    1. L3\n      1. L4\n");
    });
  });

  describe("Mixed list types", () => {
    it("should handle ordered list nested in unordered list", () => {
      const result = htmlToText(`
        <ul>
          <li>Bullet point
            <ol>
              <li>Numbered item</li>
            </ol>
          </li>
        </ul>
      `);
      expect(result).toBe("* Bullet point\n  1. Numbered item\n");
    });

    it("should handle unordered list nested in ordered list", () => {
      const result = htmlToText(`
        <ol>
          <li>Numbered item
            <ul>
              <li>Bullet point</li>
            </ul>
          </li>
        </ol>
      `);
      expect(result).toBe("1. Numbered item\n  * Bullet point\n");
    });

    it("should handle complex mixed nesting", () => {
      const result = htmlToText(`
        <ol>
          <li>OL Item 1
            <ul>
              <li>UL Item 1
                <ol>
                  <li>OL Item 1</li>
                </ol>
              </li>
            </ul>
          </li>
        </ol>
      `);
      expect(result).toBe("1. OL Item 1\n  * UL Item 1\n    1. OL Item 1\n");
    });

    it("should handle alternating list types at multiple levels", () => {
      const result = htmlToText(`
        <ul>
          <li>UL Level 1
            <ol>
              <li>OL Level 2
                <ul>
                  <li>UL Level 3
                    <ol>
                      <li>OL Level 4</li>
                    </ol>
                  </li>
                </ul>
              </li>
            </ol>
          </li>
        </ul>
      `);
      expect(result).toBe(
        "* UL Level 1\n  1. OL Level 2\n    * UL Level 3\n      1. OL Level 4\n"
      );
    });
  });

  describe("Mixed content in list items", () => {
    it("should handle list item with bold text", () => {
      const result = htmlToText(
        "<ol><li>Bold <strong>text</strong> here</li></ol>"
      );
      expect(result).toBe("1. Bold text here\n");
    });

    it("should handle list item with link", () => {
      const result = htmlToText(
        '<ol><li><a href="https://example.com">Link text</a></li></ol>'
      );
      expect(result).toBe("1. [Link text](https://example.com)\n");
    });

    it("should handle list item with multiple formatted elements", () => {
      const result = htmlToText(
        '<ol><li>Text <em>italic</em> and <a href="/url">link</a></li></ol>'
      );
      expect(result).toBe("1. Text italic and [link](/url)\n");
    });

    it("should handle complex nested HTML within list items", () => {
      const result = htmlToText(`
        <ol>
          <li>
            <div>
              <p>Paragraph in list item</p>
              <strong>Bold text</strong> and <em>italic text</em>
            </div>
          </li>
        </ol>
      `);
      expect(result.trim()).toBe(
        "1. Paragraph in list item\n\nBold text and italic text"
      );
    });

    it("should handle list item with line breaks", () => {
      const result = htmlToText("<ol><li>First line<br>Second line</li></ol>");
      expect(result).toBe("1. First line\nSecond line\n");
    });

    it("should handle list item with multiple links", () => {
      const result = htmlToText(`
        <ol>
          <li>Visit <a href="https://example.com">Example</a> and <a href="https://test.com">Test</a></li>
        </ol>
      `);
      expect(result).toBe(
        "1. Visit [Example](https://example.com) and [Test](https://test.com)\n"
      );
    });
  });

  describe("Empty list items", () => {
    it("should handle empty list item", () => {
      const result = htmlToText("<ol><li></li></ol>");
      expect(result).toBe("1. \n");
    });

    it("should handle mixed empty and filled items", () => {
      const result = htmlToText(
        "<ol><li>Content</li><li></li><li>More content</li></ol>"
      );
      expect(result).toBe("1. Content\n2. \n3. More content\n");
    });

    it("should handle list with only whitespace in items", () => {
      const result = htmlToText("<ol><li>   </li><li>\t\n</li></ol>");
      expect(result).toBe("1.    \n2. \t\n\n");
    });

    it("should handle all empty list items", () => {
      const result = htmlToText("<ol><li></li><li></li><li></li></ol>");
      expect(result).toBe("1. \n2. \n3. \n");
    });
  });

  describe("Malformed HTML handling", () => {
    it("should handle ol without li children", () => {
      const result = htmlToText("<ol>Direct text content</ol>");
      expect(result).toBe("Direct text content\n");
    });

    it("should handle orphaned li outside ol context", () => {
      const result = htmlToText("<li>Orphaned list item</li>");
      expect(result).toBe("Orphaned list item\n");
    });

    it("should handle mixed ol content", () => {
      const result = htmlToText(
        "<ol>Text before<li>List item</li>Text after</ol>"
      );
      expect(result).toBe("Text before1. List item\nText after\n");
    });

    it("should handle nested text and elements in ol", () => {
      const result = htmlToText(`
        <ol>
          Some text
          <li>List item 1</li>
          <strong>Bold text</strong>
          <li>List item 2</li>
        </ol>
      `);
      expect(result.trim()).toBe(
        "Some text\n          1. List item 1\n          Bold text\n          2. List item 2"
      );
    });

    it("should handle empty ol element", () => {
      const result = htmlToText("<ol></ol>");
      expect(result).toBe("\n");
    });
  });

  describe("Whitespace handling", () => {
    it("should preserve leading/trailing whitespace in list items", () => {
      const result = htmlToText("<ol><li>  Spaced content  </li></ol>");
      expect(result).toBe("1.   Spaced content  \n");
    });

    it("should normalize internal newlines to spaces", () => {
      const result = htmlToText("<ol><li>Line one\nLine two</li></ol>");
      expect(result).toBe("1. Line one Line two\n");
    });

    it("should handle tabs and multiple spaces", () => {
      const result = htmlToText(
        "<ol><li>Tab\there   multiple   spaces</li></ol>"
      );
      expect(result).toBe("1. Tab\there   multiple   spaces\n");
    });

    it("should handle newlines between list items", () => {
      const result = htmlToText(`
        <ol>
          <li>Item 1</li>
          <li>Item 2</li>
        </ol>
      `);
      expect(result).toBe("1. Item 1\n2. Item 2\n");
    });
  });

  describe("Performance and scalability", () => {
    it("should handle large number of list items efficiently", () => {
      const items = Array.from(
        { length: 100 },
        (_, i) => `<li>Item ${i + 1}</li>`
      ).join("");
      const html = `<ol>${items}</ol>`;

      const start = performance.now();
      const result = htmlToText(html);
      const end = performance.now();

      expect(end - start).toBeLessThan(100); // Should complete within 100ms
      expect(result).toMatch(/^1\. Item 1\n.*100\. Item 100\n$/s);
    });

    it("should handle moderate nesting efficiently", () => {
      // Create 5 levels of nested ordered lists
      let html = "<ol><li>Level 1";
      for (let i = 2; i <= 5; i++) {
        html += `<ol><li>Level ${i}`;
      }
      for (let i = 5; i >= 1; i--) {
        html += "</li></ol>";
      }

      const start = performance.now();
      const result = htmlToText(html);
      const end = performance.now();

      expect(end - start).toBeLessThan(50);
      expect(result).toContain("1. Level 1\n  1. Level 2");
    });

    it("should handle wide lists efficiently", () => {
      const items = Array.from(
        { length: 50 },
        (_, i) => `<li>Item ${i + 1}</li>`
      ).join("");
      const html = `<ol>${items}</ol>`;

      const result = htmlToText(html);

      expect(result.split("\n").length - 1).toBe(50); // 50 items + final newline
      expect(result).toContain("50. Item 50\n");
    });
  });

  describe("Integration with other features", () => {
    it("should work with ordered lists containing links and formatting", () => {
      const result = htmlToText(`
        <ol>
          <li><strong>Bold</strong> item with <a href="https://example.com">link</a></li>
          <li><em>Italic</em> item with <code>code</code></li>
          <li>Mixed <strong>bold <em>and italic</em></strong> text</li>
        </ol>
      `);
      expect(result).toBe(
        "1. Bold item with [link](https://example.com)\n2. Italic item with code\n3. Mixed bold and italic text\n"
      );
    });

    it("should handle ordered lists within other block elements", () => {
      const result = htmlToText(`
        <div>
          <p>Paragraph before list</p>
          <ol>
            <li>List item 1</li>
            <li>List item 2</li>
          </ol>
          <p>Paragraph after list</p>
        </div>
      `);
      expect(result).toBe(
        "Paragraph before list\n\n1. List item 1\n2. List item 2\nParagraph after list\n\n"
      );
    });

    it("should handle ordered lists with table-like content", () => {
      const result = htmlToText(`
        <ol>
          <li>First row: <strong>Name</strong> | <em>Age</em></li>
          <li>Second row: John | 30</li>
          <li>Third row: Jane | 25</li>
        </ol>
      `);
      expect(result).toBe(
        "1. First row: Name | Age\n2. Second row: John | 30\n3. Third row: Jane | 25\n"
      );
    });

    it("should handle complex document structure with ordered lists", () => {
      const result = htmlToText(`
        <article>
          <h1>Article Title</h1>
          <p>Introduction paragraph</p>
          <ol>
            <li>First main point</li>
            <li>Second main point with <a href="/details">details link</a></li>
          </ol>
          <p>Conclusion paragraph</p>
        </article>
      `);
      expect(result).toBe(
        "Article Title\n\nIntroduction paragraph\n\n1. First main point\n2. Second main point with [details link](/details)\nConclusion paragraph\n\n"
      );
    });
  });

  describe("Backward compatibility", () => {
    it("should not break existing unordered list functionality", () => {
      const result = htmlToText("<ul><li>Bullet item</li></ul>");
      expect(result).toBe("* Bullet item\n");
    });

    it("should not break existing link functionality", () => {
      const result = htmlToText('<a href="https://example.com">Link</a>');
      expect(result).toBe("[Link](https://example.com)");
    });

    it("should not break existing block element handling", () => {
      const result = htmlToText("<p>Paragraph</p><div>Div content</div>");
      expect(result).toBe("Paragraph\n\nDiv content\n\n");
    });

    it("should not break existing text extraction", () => {
      const result = htmlToText(
        "<strong>Bold</strong> and <em>italic</em> text"
      );
      expect(result).toBe("Bold and italic text");
    });

    it("should handle mixed unordered and ordered lists correctly", () => {
      const result = htmlToText(`
        <ul>
          <li>Unordered item 1</li>
          <li>Unordered item 2</li>
        </ul>
        <ol>
          <li>Ordered item 1</li>
          <li>Ordered item 2</li>
        </ol>
      `);
      expect(result).toBe(
        "* Unordered item 1\n* Unordered item 2\n1. Ordered item 1\n2. Ordered item 2\n"
      );
    });
  });

  describe("Edge cases with start attribute", () => {
    it("should handle very large start values", () => {
      const result = htmlToText(
        '<ol start="999999"><li>Large number</li></ol>'
      );
      expect(result).toBe("999999. Large number\n");
    });

    it("should handle very negative start values", () => {
      const result = htmlToText(
        '<ol start="-999999"><li>Very negative</li></ol>'
      );
      expect(result).toBe("-999999. Very negative\n");
    });

    it("should handle start attribute with plus sign", () => {
      const result = htmlToText('<ol start="+5"><li>Plus five</li></ol>');
      expect(result).toBe("5. Plus five\n");
    });

    it("should handle start attribute with leading zeros", () => {
      const result = htmlToText(
        '<ol start="007"><li>Double-oh-seven</li></ol>'
      );
      expect(result).toBe("7. Double-oh-seven\n");
    });
  });

  describe("Complex nesting scenarios", () => {
    it("should handle ordered lists with different start values at different levels", () => {
      const result = htmlToText(`
        <ol start="5">
          <li>Parent 5
            <ol start="100">
              <li>Child 100
                <ol start="10">
                  <li>Grandchild 10</li>
                </ol>
              </li>
            </ol>
          </li>
          <li>Parent 6</li>
        </ol>
      `);
      expect(result).toBe(
        "5. Parent 5\n  100. Child 100\n    10. Grandchild 10\n6. Parent 6\n"
      );
    });

    it("should handle sibling ordered lists with different start values", () => {
      const result = htmlToText(`
        <ol>
          <li>Parent
            <ol start="10"><li>First nested list</li></ol>
            <ol start="20"><li>Second nested list</li></ol>
            <ol start="30"><li>Third nested list</li></ol>
          </li>
        </ol>
      `);
      expect(result).toBe(
        "1. Parent\n  10. First nested list\n  20. Second nested list\n  30. Third nested list\n"
      );
    });
  });
});
