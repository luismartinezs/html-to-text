import type { LineBreakInput, LineBreakOutput } from "./types";

/**
 * Domain service for handling line break elements.
 * Handles the core logic of converting br elements to line breaks.
 */
export class LineBreakHandler {
  /**
   * Handles line break element conversion
   *
   * @param input - The line break input containing the tag name
   * @returns The appropriate line break character
   */
  handle(input: LineBreakInput): LineBreakOutput {
    const { tagName } = input;

    if (tagName.toLowerCase() === "br") {
      return { lineBreak: "\n" };
    }

    return { lineBreak: "" };
  }

  /**
   * Determines if the given tag is a line break element
   */
  isLineBreak(tagName: string): boolean {
    return tagName.toLowerCase() === "br";
  }
}
