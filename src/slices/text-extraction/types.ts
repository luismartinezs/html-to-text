import type { Parse5Node } from "../../processing-context";

/**
 * Input for text extraction operations
 */
export interface TextExtractionInput {
  /** The text node to extract content from */
  node: Parse5Node;
}

/**
 * Output from text extraction operations
 */
export interface TextExtractionOutput {
  /** The extracted text content */
  text: string;
}
