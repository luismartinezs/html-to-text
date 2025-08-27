import type {
  ListFormattingInput,
  ListFormattingOutput,
  ListContext,
} from "./types";

/**
 * Domain service for formatting HTML lists.
 * Handles the core logic of converting ul/ol/li elements to text format with proper indentation.
 */
export class ListFormatter {
  /**
   * Determines if the given tag is a list-related element
   */
  isListElement(tagName: string): boolean {
    const normalizedTag = tagName.toLowerCase();
    return ["ul", "ol", "li"].includes(normalizedTag);
  }

  /**
   * Determines if the given tag is a list container (ul or ol)
   */
  isListContainer(tagName: string): boolean {
    const normalizedTag = tagName.toLowerCase();
    return ["ul", "ol"].includes(normalizedTag);
  }

  /**
   * Determines if the given tag is a list item (li)
   */
  isListItem(tagName: string): boolean {
    return tagName.toLowerCase() === "li";
  }

  /**
   * Creates a list context for a list container
   */
  createListContext(
    tagName: string,
    depth: number = 0,
    startValue: number = 1
  ): ListContext {
    const type = tagName.toLowerCase() === "ul" ? "ul" : "ol";
    return {
      type,
      depth,
      counter: startValue,
    };
  }

  /**
   * Formats a list item with proper indentation and bullet/number
   */
  formatListItem(input: ListFormattingInput): ListFormattingOutput {
    const { content, context } = input;

    if (!context) {
      return { formattedList: content };
    }

    const indent = "  ".repeat(context.depth);

    if (context.type === "ul") {
      return {
        formattedList: `${indent}* ${content}\n`,
        updatedContext: context,
      };
    } else {
      return {
        formattedList: `${indent}${context.counter}. ${content}\n`,
        updatedContext: { ...context, counter: context.counter + 1 },
      };
    }
  }

  /**
   * Formats a list container - typically just passes through content
   */
  formatListContainer(input: ListFormattingInput): ListFormattingOutput {
    const { content } = input;
    return { formattedList: content };
  }

  /**
   * Main formatting method that routes to appropriate formatter
   */
  format(input: ListFormattingInput): ListFormattingOutput {
    const { tagName } = input;
    const normalizedTag = tagName.toLowerCase();

    if (this.isListItem(normalizedTag)) {
      return this.formatListItem(input);
    }

    if (this.isListContainer(normalizedTag)) {
      return this.formatListContainer(input);
    }

    // Not a list element
    return { formattedList: input.content };
  }
}
