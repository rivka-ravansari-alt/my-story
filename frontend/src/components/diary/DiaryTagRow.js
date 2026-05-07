import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";

/**
 * A soft, non-form-like tag row for the diary.
 * Tags appear as warm muted chips with no loud label above them.
 */
export default function DiaryTagRow({ tags = [], selectedIds = [], onToggle }) {
  if (!tags.length) return null;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.prompt}>🌿 moments like…</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {tags.map((tag) => {
          const selected = selectedIds.includes(tag.id);
          const baseColor = tag.color || colors.diary.accent;
          return (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.chip,
                { borderColor: baseColor },
                selected && { backgroundColor: baseColor },
              ]}
              onPress={() => onToggle(tag.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                {tag.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.diary.divider,
  },
  prompt: {
    fontSize: 12,
    color: colors.diary.inkLight,
    fontStyle: "italic",
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 99,
    borderWidth: 1.5,
    backgroundColor: "transparent",
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.diary.inkMid,
    letterSpacing: 0.2,
  },
  chipLabelSelected: {
    color: "#FFFFFF",
  },
});
