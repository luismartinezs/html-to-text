import "./style.css";
import { parseFragment } from "parse5";
import { decode } from "he";

export { sum } from "./sum";

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
}

function extractTextFromNode(node: Parse5Node): string {
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

    // Recursively process child nodes
    if (node.childNodes) {
      for (const child of node.childNodes) {
        result += extractTextFromNode(child);
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
      result += extractTextFromNode(child);
    }
  }

  return result;
}

export function parseHtml(html: string): object {
  return parseFragment(html);
}
