import React, { useState } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";

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
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={[
          styles.input,
          fontFamily ? { fontFamily } : null,
          focused && styles.focused,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.diary.inkLight}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="next"
        maxLength={120}
        textAlign="auto"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={[styles.underline, focused && styles.underlineFocused]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
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
});
