import type { TextExtractionInput, TextExtractionOutput } from "./types";

/**
 * Domain service for extracting text content from text nodes.
 * Handles the core business logic of text extraction.
 */
export class TextExtractor {
  /**
   * Extracts raw text content from a text node
   *
   * @param input - The text extraction input containing the node
   * @returns The extracted text content
   */
  extract(input: TextExtractionInput): TextExtractionOutput {
    const { node } = input;

    // Only process actual text nodes
    if (node.nodeName === "#text") {
      return {
        text: node.value || "",
      };
    }

    // Return empty string for non-text nodes
    return {
      text: "",
    };
  }
}
