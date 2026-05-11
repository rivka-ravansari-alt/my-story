import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useLocale, useTypography } from "../../context/LocaleContext";
import { colors } from "../../styles/colors";
import { radius } from "../../styles/spacing";

export default function TagListItem({
  tag,
  draftName,
  editing,
  saving,
  onCancelEdit,
  onChangeDraftName,
  onDelete,
  onSaveEdit,
  onStartEdit,
}) {
  const { t, isRTL } = useLocale();
  const rtlFieldText = isRTL
    ? { textAlign: "right", writingDirection: "rtl" }
    : { textAlign: "left", writingDirection: "ltr" };
  const typography = useTypography();
  const uiBold = typography.uiBold ? { fontFamily: typography.uiBold } : null;
  const uiRegular = typography.uiRegular ? { fontFamily: typography.uiRegular } : null;

  return (
    <View style={styles.row}>
      <View style={styles.tagPreview}>
        <View style={[styles.colorDot, { backgroundColor: tag.color || colors.diary.accent }]} />
        {editing ? (
          <TextInput
            value={draftName}
            onChangeText={onChangeDraftName}
            onSubmitEditing={onSaveEdit}
            autoFocus
            placeholder={t("tagItem.placeholder")}
            placeholderTextColor={colors.diary.inkLight}
            style={[styles.input, uiRegular, rtlFieldText]}
          />
        ) : (
          <Text style={[styles.name, uiBold, rtlFieldText]}>{tag.name}</Text>
        )}
      </View>

      <View style={styles.actions}>
        {editing ? (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryAction, saving && styles.disabled]}
              onPress={onSaveEdit}
              disabled={saving}
            >
              <Text style={[styles.primaryActionText, uiBold]}>{t("tagItem.save")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={onCancelEdit} disabled={saving}>
              <Text style={[styles.actionText, uiBold]}>{t("tagItem.cancel")}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.actionButton} onPress={onStartEdit}>
              <Text style={[styles.actionText, uiBold]}>{t("tagItem.edit")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
              <Text style={[styles.deleteText, uiBold]}>{t("tagItem.delete")}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    borderBottomColor: colors.diary.ruleLine,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  tagPreview: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 10,
    minWidth: 0,
  },
  colorDot: {
    borderRadius: radius.full,
    height: 12,
    width: 12,
  },
  name: {
    color: colors.diary.ink,
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    backgroundColor: colors.diary.paperAlt,
    borderColor: colors.diary.divider,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.diary.ink,
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  actions: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 0,
    gap: 6,
  },
  actionButton: {
    borderColor: colors.diary.divider,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  primaryAction: {
    backgroundColor: colors.diary.ink,
    borderColor: colors.diary.ink,
  },
  disabled: {
    opacity: 0.6,
  },
  actionText: {
    color: colors.diary.inkMid,
    fontSize: 12,
    fontWeight: "700",
  },
  primaryActionText: {
    color: colors.diary.paper,
    fontSize: 12,
    fontWeight: "700",
  },
  deleteText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: "700",
  },
});
