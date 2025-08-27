/**
 * Input for block formatting operations
 */
export interface BlockFormattingInput {
  /** The tag name of the element */
  tagName: string;

  /** The content to be formatted */
  content: string;

  /** Whether this is the start (opening tag) or end (closing tag) */
  isStart: boolean;

  /** Whether there is existing content before this element */
  hasExistingContent: boolean;
}

/**
 * Output from block formatting operations
 */
export interface BlockFormattingOutput {
  /** The content formatted with appropriate spacing */
  formattedContent: string;
}
