import "./style.css";

export { sum } from "./sum";

export function htmlToText(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "") || " ";
}
