import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";

export default function DiaryTagRow({
  tags = [],
  selectedIds = [],
  onManageTags,
  onToggle,
}) {
  const selectedCount = selectedIds.length;

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>Tags</Text>
          <Text style={styles.hint}>
            {selectedCount ? `${selectedCount} selected` : "Choose one or more tags for this story"}
          </Text>
        </View>

        {onManageTags ? (
          <TouchableOpacity onPress={onManageTags} style={styles.manageButton}>
            <Text style={styles.manageText}>Manage tags</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {tags.length ? (
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
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            No tags yet. Create tags first, then return here to assign them.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.diary.paperAlt,
    borderColor: colors.diary.divider,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 18,
    marginTop: 8,
    padding: 12,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    color: colors.diary.ink,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "left",
    writingDirection: "ltr",
  },
  hint: {
    fontSize: 12,
    color: colors.diary.inkLight,
    marginTop: 2,
    textAlign: "left",
    writingDirection: "ltr",
  },
  manageButton: {
    borderColor: colors.diary.divider,
    borderRadius: 99,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  manageText: {
    color: colors.diary.inkMid,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    writingDirection: "ltr",
  },
  row: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 12,
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
  emptyBox: {
    borderColor: colors.diary.ruleLine,
    borderRadius: 12,
    borderStyle: "dashed",
    borderWidth: 1,
    padding: 12,
  },
  emptyText: {
    color: colors.diary.inkMid,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "left",
    writingDirection: "ltr",
  },
});
