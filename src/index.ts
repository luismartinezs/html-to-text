import "./style.css";
import { parseFragment } from "parse5";
import { decode } from "he";

export { sum } from "./sum";

/**
 * Converts HTML content to plain text by parsing the HTML structure,
 * extracting text content, and decoding HTML entities.
 *
 * @param html - The HTML string to convert to plain text
 * @returns The extracted plain text with normalized whitespace
 *
 * @example
 * ```typescript
 * const html = '<div><p>Hello <strong>world</strong>!</p><br><p>How are you?</p></div>';
 * const text = htmlToText(html);
 * console.log(text); // "Hello world!\n\nHow are you?\n\n"
 * ```
 */
export function htmlToText(html: string): string {
  if (!html) return "";

  // Parse HTML using parse5 to create DOM tree
  const fragment = parseFragment(html);

  // Recursively extract text content from the DOM tree
  const text = extractTextFromNode(fragment);

  // Decode HTML entities and normalize non-breaking spaces
  const decoded = decode(text);
  return decoded.replace(/\u00A0/g, " ") || "";
}

interface Parse5Node {
  nodeName?: string;
  value?: string;
  childNodes?: Parse5Node[];
  attrs?: { name: string; value: string }[];
}

interface ExtractTextOptions {
  depth?: number;
  inList?: boolean;
  listContext?: { type: "ul" | "ol"; counter: number } | null;
}

function extractTextFromNode(
  node: Parse5Node,
  options: ExtractTextOptions = {}
): string {
  const { depth = 0, inList = false, listContext = null } = options;
  let result = "";

  if (!node) return result;

  // Handle text nodes
  if (node.nodeName === "#text") {
    return node.value || "";
  }

  // Handle element nodes
  if (node.nodeName && node.childNodes) {
    const tagName = node.nodeName.toLowerCase();

    // Add line break before block elements
    const blockElements = [
      "p",
      "div",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "li",
      "section",
      "article",
      "header",
      "footer",
      "main",
      "aside",
      "nav",
    ];
    const shouldAddLineBreak = blockElements.includes(tagName);

    if (shouldAddLineBreak && result.length > 0) {
      result += "\n";
    }

    // Special handling for br tags
    if (tagName === "br") {
      result += "\n";
    }

    // Special handling for anchor tags
    if (tagName === "a") {
      const href = node.attrs?.find(attr => attr.name === "href")?.value;

      // Extract text content from child nodes
      let textContent = "";
      if (node.childNodes) {
        for (const child of node.childNodes) {
          textContent += extractTextFromNode(child, {
            depth,
            inList,
            listContext,
          });
        }
      }

      if (href && textContent.trim()) {
        // Link with text content: [text](href)
        result += `[${textContent}](${href})`;
      } else if (href && !textContent.trim()) {
        // Link without text content: just href
        result += href;
      } else {
        // No href: just text content
        result += textContent;
      }

      return result;
    }

    // Special handling for list items
    if (tagName === "li") {
      if (inList && listContext) {
        const indent = "  ".repeat(depth);

        if (listContext.type === "ul") {
          result += `${indent}* `;
        } else {
          result += `${indent}${listContext.counter}. `;
        }

        // Process child nodes
        let hasNestedList = false;
        if (node.childNodes) {
          for (const child of node.childNodes) {
            if (child.nodeName === "ul" || child.nodeName === "ol") {
              hasNestedList = true;
              result += "\n";
              result += extractTextFromNode(child, {
                depth: depth + 1,
                inList: true,
              });
            } else {
              result += extractTextFromNode(child, {
                depth,
                inList,
                listContext,
              });
            }
          }
        }

        if (!hasNestedList) {
          result += "\n";
        }
        return result;
      }
      // If not in a list, treat as regular block element
    }

    // Special handling for unordered lists
    if (tagName === "ul") {
      const listContext = { type: "ul" as const, counter: 1 };
      if (node.childNodes) {
        for (const child of node.childNodes) {
          result += extractTextFromNode(child, {
            depth,
            inList: true,
            listContext,
          });
        }
      }
      return result;
    }

    // Special handling for ordered lists
    if (tagName === "ol") {
      const startAttr = node.attrs?.find(attr => attr.name === "start");
      const startValue = startAttr ? parseInt(startAttr.value, 10) || 1 : 1;
      let currentCounter = startValue;

      if (node.childNodes) {
        for (const child of node.childNodes) {
          const listContext = { type: "ol" as const, counter: currentCounter };
          result += extractTextFromNode(child, {
            depth,
            inList: true,
            listContext,
          });
          if (child.nodeName === "li") {
            currentCounter++;
          }
        }
      }
      return result;
    }

    // Recursively process child nodes
    if (node.childNodes) {
      for (const child of node.childNodes) {
        result += extractTextFromNode(child, { depth, inList, listContext });
      }
    }

    // Add line break after block elements
    if (shouldAddLineBreak) {
      result += "\n";
    }
  }

  // Handle document fragments and other node types with childNodes
  if (node.childNodes && !node.nodeName) {
    for (const child of node.childNodes) {
      result += extractTextFromNode(child, { depth, inList, listContext });
    }
  }

  return result;
}

/**
 * Parses HTML content into a structured document fragment object using parse5.
 * This provides access to the raw parsed HTML structure for advanced use cases.
 *
 * @param html - The HTML string to parse
 * @returns The parsed document fragment object containing the HTML structure
 *
 * @example
 * ```typescript
 * const html = '<div><p>Hello world</p></div>';
 * const fragment = parseHtml(html);
 * console.log(fragment); // Parse5 document fragment with childNodes array
 * ```
 */
export function parseHtml(html: string): object {
  return parseFragment(html);
}
