import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocale, useTypography } from "../../context/LocaleContext";
import { colors } from "../../styles/colors";
import { radius } from "../../styles/spacing";

export default function ExerciseTemplateCard({ template, onDelete }) {
  const { t, isRTL } = useLocale();
  const typography = useTypography();
  const uiBold = typography.uiBold ? { fontFamily: typography.uiBold } : null;
  const uiRegular = typography.uiRegular ? { fontFamily: typography.uiRegular } : null;
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded((open) => !open);
  const fields = template.fields || [];

  const collapseGlyph = isRTL ? "\u25C2" : "\u25B8";
  const expandGlyph = "\u25BE";

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={[styles.expandTap, isRTL && styles.expandTapRtl]}
          onPress={toggleExpanded}
          activeOpacity={0.82}
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          accessibilityLabel={
            expanded ? t("templateCard.collapseDetailsA11y") : t("templateCard.expandDetailsA11y")
          }
        >
          <Text style={[styles.chevron, uiBold]}>{expanded ? expandGlyph : collapseGlyph}</Text>
          <View style={styles.titleWrap}>
            <Text style={[styles.title, uiBold]}>{template.name}</Text>
            {template.description ? (
              <Text style={[styles.description, uiRegular]} numberOfLines={expanded ? undefined : 3}>
                {template.description}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={[styles.deleteText, uiBold]}>{t("templateCard.delete")}</Text>
        </TouchableOpacity>
      </View>

      {expanded ? (
        <View style={styles.fieldList}>
          {fields.map((field, index) => (
            <View key={field.id || `${field.label}-${index}`} style={styles.fieldPill}>
              <Text style={[styles.fieldLabel, uiBold]}>{field.label}</Text>
              <Text style={[styles.fieldType, uiBold]}>
                {field.type === "long_text" ? t("templateCard.longText") : t("templateCard.text")}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
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
    paddingHorizontal: 16,
    paddingVertical: 14,
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
  expandTap: {
    alignItems: "flex-start",
    flex: 1,
    flexDirection: "row",
    gap: 8,
    minWidth: 0,
  },
  expandTapRtl: {
    flexDirection: "row-reverse",
  },
  chevron: {
    color: colors.diary.inkLight,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 22,
    marginTop: 3,
  },
  titleWrap: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.diary.ink,
    fontSize: 18,
    fontWeight: "800",
  },
  description: {
    color: colors.diary.inkMid,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
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
  },
  fieldType: {
    color: colors.diary.inkLight,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
    textTransform: "uppercase",
  },
});
