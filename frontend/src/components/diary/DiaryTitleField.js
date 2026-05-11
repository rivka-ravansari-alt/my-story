import React, { useState } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import { useLocale } from "../../context/LocaleContext";
import { colors } from "../../styles/colors";
import { hebrewInputRtlStyle, withRtlPlaceholder } from "../../utils/rtlTextInput";

/**
 * The story title — rendered as a diary heading with no visible box border.
 * A subtle underline appears only when focused.
 */
export default function DiaryTitleField({
  value,
  onChangeText,
  placeholder = "Give this memory a name…",
  error,
  fontFamily,
  italic = true,
  errorTextStyle,
}) {
  const [focused, setFocused] = useState(false);
  const { locale } = useLocale();
  const isHebrew = locale === "he";
  const placeholderDisplay = withRtlPlaceholder(placeholder, isHebrew);

  return (
    <View style={[styles.wrapper, isHebrew && styles.wrapperRtl]}>
      <TextInput
        style={[
          styles.input,
          fontFamily ? { fontFamily } : null,
          !italic && styles.noItalic,
          focused && styles.focused,
          hebrewInputRtlStyle(isHebrew),
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholderDisplay}
        placeholderTextColor={colors.diary.inkLight}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="next"
        maxLength={120}
        textAlign={isHebrew ? "right" : "left"}
        writingDirection={isHebrew ? "rtl" : "ltr"}
      />
      {error ? (
        <Text style={[styles.error, errorTextStyle, isHebrew && styles.errorRtl]}>{error}</Text>
      ) : null}
      <View style={[styles.underline, focused && styles.underlineFocused]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  wrapperRtl: {
    direction: "rtl",
  },
  input: {
    fontSize: 22,
    fontWeight: "700",
    fontStyle: "italic",
    color: colors.diary.ink,
    paddingVertical: 5,
    paddingHorizontal: 0,
    letterSpacing: -0.3,
    lineHeight: 29,
  },
  noItalic: {
    fontStyle: "normal",
    letterSpacing: 0.15,
  },
  focused: {
    color: colors.diary.ink,
  },
  underline: {
    height: 1.5,
    backgroundColor: colors.diary.ruleLine,
    marginTop: 3,
  },
  underlineFocused: {
    backgroundColor: colors.diary.accent,
  },
  error: {
    fontSize: 12,
    color: colors.error,
    marginTop: 2,
  },
  errorRtl: {
    textAlign: "right",
    writingDirection: "rtl",
  },
});
