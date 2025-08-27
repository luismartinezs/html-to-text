/**
 * Shared context passed between slices during HTML processing.
 * Contains state information needed for proper text extraction.
 */
export interface ProcessingContext {
  /** Current nesting depth in the DOM tree */
  depth: number;

  /** Whether we are currently processing inside a list */
  inList: boolean;

  /** List-specific context when processing list items */
  listContext?: {
    /** Type of list: ul (unordered) or ol (ordered) */
    type: "ul" | "ol";
    /** Current nesting depth */
    depth: number;
    /** Current counter for ordered lists */
    counter: number;
  };
}

/**
 * Parse5 node interface for type safety
 */
export interface Parse5Node {
  nodeName?: string;
  value?: string;
  childNodes?: Parse5Node[];
  attrs?: { name: string; value: string }[];
}

/**
 * Universal interface that all slice handlers must implement
 */
export interface SliceHandler<TInput, TOutput> {
  handle(input: TInput): TOutput;
}

/**
 * Contract that all element processing slices must implement
 */
export interface SliceContract {
  /** Determines if this slice can handle the given node */
  canHandle(node: Parse5Node): boolean;

  /** Processes the node and returns the extracted text */
  handle(node: Parse5Node, context: ProcessingContext): string;
}

/**
 * Creates a default processing context
 */
export function createDefaultContext(): ProcessingContext {
  return {
    depth: 0,
    inList: false,
    listContext: undefined,
  };
}
