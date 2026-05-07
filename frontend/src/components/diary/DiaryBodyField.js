import React, { useState } from "react";
import { TextInput, View, StyleSheet, Platform } from "react-native";
import { colors } from "../../styles/colors";

const LINE_HEIGHT = 32;
const LINE_COUNT = 14;

/**
 * The main writing area — mimics ruled notebook paper using
 * subtle horizontal lines behind the text input.
 */
export default function DiaryBodyField({
  value,
  onChangeText,
  placeholder = "What's on your heart today?\n\nWrite freely… this is your safe space.",
  fontFamily,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, focused && styles.wrapperFocused]}>
      {/* Ruled lines drawn behind the text */}
      <View style={styles.linesContainer} pointerEvents="none">
        {Array.from({ length: LINE_COUNT }).map((_, i) => (
          <View key={i} style={[styles.ruleLine, { top: LINE_HEIGHT * (i + 1) - 1 }]} />
        ))}
      </View>

      <TextInput
        style={[
          styles.input,
          fontFamily ? { fontFamily } : null,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.diary.inkLight}
        multiline
        textAlignVertical="top"
        scrollEnabled={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        textAlign="auto"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    minHeight: LINE_HEIGHT * LINE_COUNT,
    position: "relative",
    borderRadius: 6,
    backgroundColor: "transparent",
  },
  wrapperFocused: {
    backgroundColor: "rgba(255,254,248,0.6)",
  },
  linesContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  ruleLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.diary.ruleLine,
  },
  input: {
    fontSize: 16,
    color: colors.diary.ink,
    lineHeight: LINE_HEIGHT,
    paddingTop: Platform.OS === "ios" ? 6 : 4,
    paddingBottom: 8,
    paddingHorizontal: 2,
    minHeight: LINE_HEIGHT * LINE_COUNT,
    letterSpacing: 0.2,
    zIndex: 1,
  },
});
