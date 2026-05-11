import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useLocale, useTypography } from "../../context/LocaleContext";
import { colors } from "../../styles/colors";
import { radius } from "../../styles/spacing";

const DROPDOWN_MIN_WIDTH = 156;

function GlobeGlyph({ color, size = 18 }) {
  const ring = size - 2;
  return (
    <View style={[glyphStyles.wrap, { width: size, height: size }]}>
      <View
        style={[
          glyphStyles.ring,
          {
            width: ring,
            height: ring,
            borderRadius: ring / 2,
            borderColor: color,
          },
        ]}
      />
      <View style={[glyphStyles.meridian, { height: ring - 4, backgroundColor: color }]} />
      <View style={[glyphStyles.parallel, { width: ring - 4, backgroundColor: color }]} />
    </View>
  );
}

const glyphStyles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    borderWidth: 1.5,
    position: "absolute",
  },
  meridian: {
    position: "absolute",
    width: 1.5,
  },
  parallel: {
    position: "absolute",
    height: 1.5,
  },
});

const OPTIONS = [
  { code: "en", abbrev: "EN", labelKey: "settings.english" },
  { code: "he", abbrev: "HE", labelKey: "settings.hebrew" },
];

export default function LanguageSwitcher({ compact = false }) {
  const { locale, setLocale, t } = useLocale();
  const typography = useTypography();
  const triggerWrapRef = useRef(null);
  const { width: windowWidth } = useWindowDimensions();

  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState(null);

  const uiBold = typography.uiBold ? { fontFamily: typography.uiBold } : null;
  const uiRegular = typography.uiRegular ? { fontFamily: typography.uiRegular } : null;

  const currentAbbrev = locale === "he" ? "HE" : "EN";

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const measureAndOpen = useCallback(() => {
    triggerWrapRef.current?.measureInWindow((x, y, w, h) => {
      setAnchor({ x, y, w, h });
      setOpen(true);
    });
  }, []);

  const toggle = useCallback(() => {
    if (open) {
      close();
      return;
    }
    requestAnimationFrame(measureAndOpen);
  }, [close, measureAndOpen, open]);

  useEffect(() => {
    if (!open) return undefined;
    const sub = Dimensions.addEventListener("change", close);
    return () => sub?.remove?.();
  }, [close, open]);

  const pick = useCallback(
    async (code) => {
      await setLocale(code);
      close();
    },
    [close, setLocale]
  );

  const dropdownStyle =
    anchor &&
    (() => {
      const menuWidth = Math.max(DROPDOWN_MIN_WIDTH, anchor.w + 24);
      const top = anchor.y + anchor.h + 6;
      let left = anchor.x + anchor.w - menuWidth;
      const pad = 10;
      left = Math.min(Math.max(left, pad), windowWidth - menuWidth - pad);
      const maxTop = Dimensions.get("window").height - 140;
      return {
        position: "absolute",
        top: Math.min(top, maxTop),
        left,
        width: menuWidth,
      };
    })();

  const a11yLabel = t("nav.languageMenuA11y");

  return (
    <View style={styles.wrapper}>
      <View ref={triggerWrapRef} collapsable={false} style={styles.triggerMeasure}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={a11yLabel}
          accessibilityHint={t("nav.languageMenuHint")}
          activeOpacity={0.85}
          onPress={toggle}
          style={[styles.trigger, compact && styles.triggerCompact]}
          hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
        >
          <GlobeGlyph color={colors.diary.inkMid} size={compact ? 16 : 17} />
          <Text style={[styles.triggerAbbrev, uiBold]}>{currentAbbrev}</Text>
          <Text style={[styles.triggerCaret, uiRegular]}>{open ? "\u25b2" : "\u25bc"}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={open && !!anchor}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={close}
      >
        <View style={styles.modalRoot}>
          <Pressable style={StyleSheet.absoluteFill} onPress={close} />
          {dropdownStyle ? (
            <View style={[styles.dropdown, dropdownStyle]} pointerEvents="box-none">
              {OPTIONS.map((opt) => {
                const selected = locale === opt.code;
                return (
                  <TouchableOpacity
                    key={opt.code}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    activeOpacity={0.82}
                    onPress={() => void pick(opt.code)}
                    style={[styles.optionRow, selected && styles.optionRowSelected]}
                  >
                    <Text style={[styles.optionAbbrev, uiBold]}>{opt.abbrev}</Text>
                    <Text style={[styles.optionLabel, uiRegular]}>{t(opt.labelKey)}</Text>
                    <Text style={[styles.optionCheck, uiBold]}>{selected ? "\u2713" : ""}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
  },
  triggerMeasure: {
    alignSelf: "flex-start",
  },
  trigger: {
    alignItems: "center",
    backgroundColor: colors.diary.paperAlt,
    borderColor: colors.diary.divider,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: Platform.OS === "ios" ? 8 : 7,
    maxHeight: 40,
  },
  triggerCompact: {
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 7,
    maxHeight: 38,
  },
  triggerAbbrev: {
    color: colors.diary.ink,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginTop: Platform.OS === "android" ? 1 : 0,
  },
  triggerCaret: {
    color: colors.diary.inkLight,
    fontSize: 9,
    marginTop: 1,
  },
  modalRoot: {
    flex: 1,
  },
  dropdown: {
    backgroundColor: colors.diary.paper,
    borderColor: colors.diary.divider,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: 4,
    shadowColor: colors.diary.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 8,
  },
  optionRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  optionRowSelected: {
    backgroundColor: colors.diary.accentLight,
  },
  optionAbbrev: {
    color: colors.diary.inkLight,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    width: 26,
  },
  optionLabel: {
    color: colors.diary.ink,
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  optionCheck: {
    color: colors.diary.accent,
    fontSize: 14,
    fontWeight: "900",
    width: 18,
    textAlign: "center",
  },
});
