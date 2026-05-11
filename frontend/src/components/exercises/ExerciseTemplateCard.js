import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../styles/colors";
import { radius } from "../../styles/spacing";

export default function ExerciseTemplateCard({ template, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{template.name}</Text>
          {template.description ? <Text style={styles.description}>{template.description}</Text> : null}
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.fieldList}>
        {(template.fields || []).map((field, index) => (
          <View key={field.id || `${field.label}-${index}`} style={styles.fieldPill}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <Text style={styles.fieldType}>{field.type === "long_text" ? "Long text" : "Text"}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.diary.paper,
    borderColor: colors.diary.accentLight,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
    shadowColor: colors.diary.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  headerRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
  },
  titleWrap: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.diary.ink,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "left",
    writingDirection: "ltr",
  },
  description: {
    color: colors.diary.inkMid,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
    textAlign: "left",
    writingDirection: "auto",
  },
  deleteButton: {
    borderColor: colors.diary.divider,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  deleteText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: "800",
  },
  fieldList: {
    gap: 8,
    marginTop: 14,
  },
  fieldPill: {
    backgroundColor: colors.diary.paperAlt,
    borderColor: colors.diary.ruleLine,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  fieldLabel: {
    color: colors.diary.ink,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "left",
    writingDirection: "auto",
  },
  fieldType: {
    color: colors.diary.inkLight,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
    textTransform: "uppercase",
  },
});
