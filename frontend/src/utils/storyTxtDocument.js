const ILLEGAL_FILENAME_CHARS = /[<>:"/\\|?*\u0000-\u001f]/g;

/** Hebrew letters + cantillation/punctuation + presentation forms (Yiddish, etc.). */
const HEBREW_SCRIPT_RE = /[\u0590-\u05FF\uFB1D-\uFB4F]/;

/** @param {string} text */
function textContainsHebrew(text) {
  return HEBREW_SCRIPT_RE.test(text);
}

/**
 * Plain .txt has no dir markup; RLE/PDF embedding hints RTL to conformant viewers while keeping UTF-8 storage.
 * @param {string} line
 */
function rtlEmbedLineIfHebrew(line) {
  if (!line || !textContainsHebrew(line)) return line;
  return `\u202B${line}\u202C`;
}

/** @param {string} body */
function rtlEmbedBodyLinesIfHebrew(body) {
  if (!body) return "";
  return body.split(/\r?\n/).map((line) => rtlEmbedLineIfHebrew(line)).join("\n");
}

/** @param {{ title?: string, event_date?: string | null }} event */
export function buildStoryTxtFilename(event) {
  const dateStr = event.event_date || "unknown-date";
  const titlePart = (event.title || "").trim();
  const baseRaw = titlePart || "story";
  const base =
    baseRaw
      .replace(ILLEGAL_FILENAME_CHARS, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^[\s.-]+|[\s.-]+$/g, "")
      .slice(0, 100) || "story";

  return `${base}-${dateStr}.txt`;
}

/** @param {{ title?: string, event_date?: string | null, content?: string, tags?: Array<{ name?: string }> }} event */
export function buildStoryTxtContent(event) {
  const title = (event.title || "").trim() || "Untitled";
  const dateLine = event.event_date ? `Date: ${event.event_date}` : "Date:";
  const tagNames =
    event.tags?.map((t) => (t?.name != null ? String(t.name).trim() : "")).filter(Boolean) || [];
  const tagsLine = tagNames.length ? `Tags: ${tagNames.join(", ")}` : null;
  const body = event.content != null && String(event.content).length ? String(event.content) : "";

  const lines = [
    rtlEmbedLineIfHebrew(title),
    "",
    rtlEmbedLineIfHebrew(dateLine),
  ];
  if (tagsLine) lines.push(rtlEmbedLineIfHebrew(tagsLine));
  lines.push("", rtlEmbedBodyLinesIfHebrew(body));

  return lines.join("\n");
}
