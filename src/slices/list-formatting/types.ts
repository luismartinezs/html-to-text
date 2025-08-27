/**
 * Context information for list processing
 */
export interface ListContext {
  /** Type of list: ul (unordered) or ol (ordered) */
  type: "ul" | "ol";
  /** Current nesting depth */
  depth: number;
  /** Current counter for ordered lists */
  counter: number;
}

/**
 * Input for list formatting operations
 */
export interface ListFormattingInput {
  /** The tag name of the element */
  tagName: string;
  /** The content to be formatted */
  content: string;
  /** List context information */
  context?: ListContext;
  /** Start value for ordered lists */
  startValue?: number;
}

/**
 * Output from list formatting operations
 */
export interface ListFormattingOutput {
  /** The formatted list content */
  formattedList: string;
  /** Updated context for subsequent items */
  updatedContext?: ListContext;
}
