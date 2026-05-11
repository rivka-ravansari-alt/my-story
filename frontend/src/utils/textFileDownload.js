import { Platform, Share } from "react-native";

/**
 * UTF-8 text file download (web) or share sheet (native) with Hebrew-safe Unicode text.
 * @param {string} filename
 * @param {string} text
 */
export async function triggerUtf8TextDownload(filename, text) {
  const payload = `${"\uFEFF"}${text}`;

  if (Platform.OS === "web" && typeof document !== "undefined") {
    const blob = new Blob([payload], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    return;
  }

  await Share.share({
    title: filename,
    message: text,
  });
}
