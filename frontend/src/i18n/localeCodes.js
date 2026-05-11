export const SUPPORTED_LOCALES = ["en", "he"];

export const DEFAULT_LOCALE = "en";

export const LOCALE_STORAGE_KEY = "@my-story/locale";

export function isRtlLocale(locale) {
  return locale === "he";
}
