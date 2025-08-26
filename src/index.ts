import "./style.css";
import { parseFragment } from "parse5";

export { sum } from "./sum";

export function htmlToText(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "") || " ";
}

export function parseHtml(html: string): object {
  return parseFragment(html);
}
