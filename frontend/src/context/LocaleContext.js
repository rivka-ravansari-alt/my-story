import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, View } from "react-native";
import { useFonts, Caveat_400Regular, Caveat_700Bold } from "@expo-google-fonts/caveat";
import {
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_700Bold,
} from "@expo-google-fonts/rubik";
import { getMessage } from "../i18n/getMessage";
import { messagesByLocale } from "../i18n";
import { DEFAULT_LOCALE, isRtlLocale, LOCALE_STORAGE_KEY, SUPPORTED_LOCALES } from "../i18n/localeCodes";

const LocaleContext = createContext(null);

function applyWebDocumentDirection(locale) {
  if (Platform.OS !== "web" || typeof document === "undefined") return;
  const rtl = isRtlLocale(locale);
  document.documentElement.setAttribute("dir", rtl ? "rtl" : "ltr");
  document.documentElement.setAttribute("lang", locale === "he" ? "he" : "en");
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);
  const [hydrated, setHydrated] = useState(false);

  const [fontsLoaded] = useFonts({
    Caveat_400Regular,
    Caveat_700Bold,
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
        if (
          !cancelled &&
          stored &&
          SUPPORTED_LOCALES.includes(stored)
        ) {
          setLocaleState(stored);
          applyWebDocumentDirection(stored);
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    applyWebDocumentDirection(locale);
  }, [hydrated, locale]);

  const setLocale = useCallback(async (next) => {
    if (!SUPPORTED_LOCALES.includes(next)) return;
    setLocaleState(next);
    applyWebDocumentDirection(next);
    try {
      await AsyncStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const bundle = messagesByLocale[locale] || messagesByLocale.en;

  const t = useCallback(
    (path, vars) => getMessage(bundle, path, vars),
    [bundle]
  );

  const isRTL = isRtlLocale(locale);

  const typography = useMemo(() => {
    if (!fontsLoaded) {
      return {
        brandFont: undefined,
        journalRegular: undefined,
        journalBold: undefined,
        uiRegular: undefined,
        uiMedium: undefined,
        uiBold: undefined,
      };
    }
    if (locale === "he") {
      return {
        brandFont: "Rubik_700Bold",
        journalRegular: "Rubik_400Regular",
        journalBold: "Rubik_700Bold",
        uiRegular: "Rubik_400Regular",
        uiMedium: "Rubik_500Medium",
        uiBold: "Rubik_700Bold",
      };
    }
    return {
      brandFont: "Caveat_700Bold",
      journalRegular: "Caveat_400Regular",
      journalBold: "Caveat_700Bold",
      uiRegular: undefined,
      uiMedium: undefined,
      uiBold: undefined,
    };
  }, [fontsLoaded, locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      isRTL,
      t,
      fontsReady: fontsLoaded,
      typography,
      hydrated,
    }),
    [fontsLoaded, hydrated, isRTL, locale, setLocale, t, typography]
  );

  return (
    <LocaleContext.Provider value={value}>
      <View style={{ flex: 1, direction: isRTL ? "rtl" : "ltr" }}>
        {children}
      </View>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}

export function useTypography() {
  const { typography } = useLocale();
  return typography;
}
