import type { LinkConversionInput, LinkConversionOutput } from "./types";

/**
 * Domain service for converting HTML links to markdown format.
 * Handles URL sanitization and link formatting logic.
 */
export class LinkConverter {
  /**
   * Sanitizes a URL by checking if it uses a safe protocol.
   * Only allows http, https, and mailto protocols.
   */
  private sanitizeUrl(url: string | undefined): string | undefined {
    if (!url) return undefined;

    try {
      // Handle relative URLs by providing a placeholder base
      const parsedUrl = new URL(url, "http://placeholder.com");
      if (["http:", "https:", "mailto:"].includes(parsedUrl.protocol)) {
        return url;
      }
      return undefined;
    } catch {
      // Invalid URL format
      return undefined;
    }
  }

  /**
   * Converts an HTML link to markdown format
   *
   * @param input - The link conversion input containing href and text content
   * @returns The converted link in appropriate format
   */
  convert(input: LinkConversionInput): LinkConversionOutput {
    const { href, textContent } = input;
    const sanitizedHref = this.sanitizeUrl(href);

    // Link with text content: [text](href)
    if (sanitizedHref && textContent.trim()) {
      return {
        convertedLink: `[${textContent}](${sanitizedHref})`,
      };
    }

    // Link without text content: just href
    if (sanitizedHref && !textContent.trim()) {
      return {
        convertedLink: sanitizedHref,
      };
    }

    // No href or unsafe href: just text content
    return {
      convertedLink: textContent,
    };
  }
}
