/**
 * Link Conversion Slice
 *
 * Handles conversion of HTML anchor elements to markdown format.
 * This slice is responsible for processing <a> tags, extracting their
 * href attributes, sanitizing URLs, and formatting them as markdown links.
 */

export { LinkConversionHandler } from "./handler";
export { LinkConverter } from "./domain";
export type { LinkConversionInput, LinkConversionOutput } from "./types";
