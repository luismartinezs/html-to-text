import "./style.css";
import { parseFragment } from "parse5";
import { decode } from "he";

export { sum } from "./sum";

export function htmlToText(html: string): string {
  if (!html) return "";
  const textWithoutTags = html.replace(/<[^>]*>/g, "");
  const decoded = decode(textWithoutTags);
  return decoded.replace(/\u00A0/g, " ") || " ";
}

export function parseHtml(html: string): object {
  return parseFragment(html);
}
