import "./style.css";
import { parseFragment } from "parse5";
import { decode } from "he";

export { sum } from "./sum";

export function htmlToText(html: string): string {
  if (!html) return "";

  // Replace block-level elements with their content followed by newlines
  const result = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li)>/gi, "\n")
    .replace(/<[^>]*>/g, "");

  const decoded = decode(result);
  return decoded.replace(/\u00A0/g, " ") || " ";
}

export function parseHtml(html: string): object {
  return parseFragment(html);
}
