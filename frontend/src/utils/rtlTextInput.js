/** Unicode RLM — fixes placeholder / caret RTL alignment when UI locale is Hebrew. */
export const RLM = "\u200f";

/** Prefix each non-empty line so multiline placeholders align right in RTL. */
export function withRtlPlaceholder(text, isHebrew) {
  if (!isHebrew || text == null || text === "") return text;
  return text
    .split("\n")
    .map((line) => (line.length ? `${RLM}${line}` : line))
    .join("\n");
}

/** Shared TextInput style for Hebrew fields (works with RN Web `direction`). */
export function hebrewInputRtlStyle(isHebrew) {
  return isHebrew
    ? { direction: "rtl", textAlign: "right", writingDirection: "rtl" }
    : null;
}
