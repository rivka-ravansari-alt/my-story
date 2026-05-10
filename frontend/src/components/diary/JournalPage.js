import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";
import { radius, shadow } from "../../styles/spacing";

/**
 * The physical "paper" of the journal — a cream card with a left margin
 * line and a warm shadow, sitting on the sandy canvas background.
 */
export default function JournalPage({ children, style }) {
  return (
    <View style={[styles.paper, style]}>
      {/* Left margin rule line */}
      <View style={styles.marginLine} pointerEvents="none" />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  paper: {
    backgroundColor: colors.diary.paper,
    borderRadius: radius.lg,
    marginHorizontal: 18,
    marginVertical: 8,
    flexDirection: "row",
    shadowColor: colors.diary.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
    overflow: "hidden",
  },
  marginLine: {
    width: 2,
    backgroundColor: colors.diary.marginLine,
    marginLeft: 42,
    alignSelf: "stretch",
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
});
