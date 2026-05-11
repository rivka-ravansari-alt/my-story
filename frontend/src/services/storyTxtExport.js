import { eventService } from "./eventService";
import { buildStoryTxtContent, buildStoryTxtFilename } from "../utils/storyTxtDocument";
import { triggerUtf8TextDownload } from "../utils/textFileDownload";

/**
 * Loads the full story from the API and downloads it as a single .txt file (web)
 * or opens the share sheet with the story text (iOS/Android).
 * @param {{ id: number | string }} listEvent Minimal event from list (id required).
 */
export async function exportStoryAsTxt(listEvent) {
  const id = Number(listEvent?.id);
  if (!Number.isFinite(id)) {
    throw new Error("Invalid story id.");
  }

  const fullEvent = await eventService.getById(id);
  const text = buildStoryTxtContent(fullEvent);
  const filename = buildStoryTxtFilename(fullEvent);
  await triggerUtf8TextDownload(filename, text);
}
