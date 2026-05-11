import React from "react";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocale, useTypography } from "../../context/LocaleContext";
import { colors } from "../../styles/colors";
import { radius } from "../../styles/spacing";

export default function DateCreateActionModal({ visible, formattedDateLabel, onClose, onChooseStory, onChooseExercise }) {
  const { t } = useLocale();
  const typography = useTypography();
  const uiBold = typography.uiBold ? { fontFamily: typography.uiBold } : null;
  const uiRegular = typography.uiRegular ? { fontFamily: typography.uiRegular } : null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.card}>
          <Text style={[styles.eyebrow, uiBold]}>{t("calendar.createActionEyebrow")}</Text>
          <Text style={[styles.title, uiBold]}>{formattedDateLabel}</Text>
          <Text style={[styles.subtitle, uiRegular]}>{t("calendar.createActionSubtitle")}</Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={onChooseStory} activeOpacity={0.85}>
              <Text style={[styles.primaryBtnText, uiBold]}>{t("calendar.createStory")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={onChooseExercise} activeOpacity={0.85}>
              <Text style={[styles.secondaryBtnText, uiBold]}>{t("calendar.createExercise")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dismissBtn} onPress={onClose} activeOpacity={0.85}>
              <Text style={[styles.dismissBtnText, uiBold]}>{t("common.cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: "center",
    backgroundColor: "rgba(44, 26, 14, 0.38)",
    flex: 1,
    justifyContent: "center",
    padding: 22,
  },
  card: {
    backgroundColor: colors.diary.paper,
    borderColor: colors.diary.accentLight,
    borderRadius: radius.xl,
    borderWidth: 1,
    elevation: 8,
    maxWidth: 360,
    paddingHorizontal: 22,
    paddingVertical: 22,
    shadowColor: colors.diary.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 22,
    width: "100%",
  },
  eyebrow: {
    color: colors.diary.accent,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  title: {
    color: colors.diary.ink,
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 26,
    marginBottom: 6,
  },
  subtitle: {
    color: colors.diary.inkMid,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },
  actions: {
    gap: 10,
  },
  primaryBtn: {
    alignItems: "center",
    backgroundColor: colors.diary.ink,
    borderRadius: radius.full,
    paddingVertical: 12,
  },
  primaryBtnText: {
    color: colors.diary.paper,
    fontSize: 14,
    fontWeight: "800",
  },
  secondaryBtn: {
    alignItems: "center",
    backgroundColor: colors.diary.accentLight,
    borderColor: colors.diary.divider,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingVertical: 12,
  },
  secondaryBtnText: {
    color: colors.diary.ink,
    fontSize: 14,
    fontWeight: "800",
  },
  dismissBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  dismissBtnText: {
    color: colors.diary.inkMid,
    fontSize: 13,
    fontWeight: "700",
  },
});
