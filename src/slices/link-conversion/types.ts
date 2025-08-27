/**
 * Input for link conversion operations
 */
export interface LinkConversionInput {
  /** The href attribute value from the anchor tag */
  href?: string;

  /** The text content of the link */
  textContent: string;
}

/**
 * Output from link conversion operations
 */
export interface LinkConversionOutput {
  /** The converted link in markdown format or plain text */
  convertedLink: string;
}
