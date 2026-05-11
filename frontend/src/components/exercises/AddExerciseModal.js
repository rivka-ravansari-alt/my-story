import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocale, useTypography } from "../../context/LocaleContext";
import { colors } from "../../styles/colors";
import { radius } from "../../styles/spacing";
import ExerciseForm from "./ExerciseForm";

export default function AddExerciseModal({ visible, templates, onClose, onSubmit, saving }) {
  const { t } = useLocale();
  const typography = useTypography();
  const uiBold = typography.uiBold ? { fontFamily: typography.uiBold } : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!saving) onClose();
      }}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={saving ? undefined : onClose} />

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.sheetWrap}>
          <View style={styles.sheetInner}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, uiBold]}>{t("exerciseForm.modalSheetTitle")}</Text>
              <TouchableOpacity
                onPress={onClose}
                disabled={saving}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityRole="button"
                accessibilityLabel={t("nav.close")}
              >
                <Text style={[styles.closeText, uiBold]}>{t("nav.close")}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <ExerciseForm templates={templates} onSubmit={onSubmit} saving={saving} embedded />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
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
    padding: 18,
  },
  sheetWrap: {
    maxHeight: "92%",
    maxWidth: 440,
    width: "100%",
  },
  sheetInner: {
    backgroundColor: colors.diary.paper,
    borderColor: colors.diary.accentLight,
    borderRadius: radius.xl,
    borderWidth: 1,
    elevation: 8,
    maxHeight: "100%",
    overflow: "hidden",
    paddingBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 18,
    shadowColor: colors.diary.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
  },
  sheetHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingRight: 2,
  },
  sheetTitle: {
    color: colors.diary.ink,
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    marginEnd: 12,
    paddingTop: 2,
  },
  closeText: {
    color: colors.diary.inkMid,
    fontSize: 14,
    fontWeight: "700",
  },
  scroll: {
    maxHeight: 560,
  },
  scrollContent: {
    paddingBottom: 6,
  },
});
