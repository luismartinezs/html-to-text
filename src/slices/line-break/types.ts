/**
 * Input for line break operations
 */
export interface LineBreakInput {
  /** The tag name of the element */
  tagName: string;
}

/**
 * Output from line break operations
 */
export interface LineBreakOutput {
  /** The line break character or empty string */
  lineBreak: string;
}
