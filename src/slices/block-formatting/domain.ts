import type { BlockFormattingInput, BlockFormattingOutput } from "./types";

/**
 * Domain service for formatting block-level elements.
 * Handles the core logic of adding appropriate spacing around block elements.
 */
export class BlockFormatter {
  private readonly blockElements = new Set([
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
  ]);

  /**
   * Determines if the given tag name is a block element
   */
  isBlockElement(tagName: string): boolean {
    return this.blockElements.has(tagName.toLowerCase());
  }

  /**
   * Formats content with appropriate block-level spacing
   *
   * @param input - The block formatting input
   * @returns The formatted content with proper spacing
   */
  format(input: BlockFormattingInput): BlockFormattingOutput {
    const { tagName, content, isStart, hasExistingContent } = input;

    const normalizedTagName = tagName.toLowerCase();

    // Only process block elements
    if (!this.isBlockElement(normalizedTagName)) {
      return { formattedContent: content };
    }

    // Add line break before block element if there's existing content
    if (isStart && hasExistingContent && content.length > 0) {
      return { formattedContent: "\n" + content };
    }

    // Add line break after block element
    if (!isStart) {
      return { formattedContent: content + "\n" };
    }

    // No formatting needed
    return { formattedContent: content };
  }
}
