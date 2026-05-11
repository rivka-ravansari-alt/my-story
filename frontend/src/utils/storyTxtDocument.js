const ILLEGAL_FILENAME_CHARS = /[<>:"/\\|?*\u0000-\u001f]/g;

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

  const lines = [title, "", dateLine];
  if (tagsLine) lines.push(tagsLine);
  lines.push("", body);

  return lines.join("\n");
}
