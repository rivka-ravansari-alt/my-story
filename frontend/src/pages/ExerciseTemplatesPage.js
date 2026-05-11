import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AddExerciseTemplateModal from "../components/exercises/AddExerciseTemplateModal";
import ExerciseTemplateCard from "../components/exercises/ExerciseTemplateCard";
import { useLocale, useTypography } from "../context/LocaleContext";
import { useExerciseTemplates } from "../hooks/useExerciseTemplates";
import { colors } from "../styles/colors";
import { radius } from "../styles/spacing";

export default function ExerciseTemplatesPage() {
  const navigation = useNavigation();
  const { templates, loading, error, fetchAll, createTemplate, deleteTemplateById } =
    useExerciseTemplates();
  const { locale, t, isRTL } = useLocale();
  const typography = useTypography();
  const [saving, setSaving] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handwritingBold = typography.journalBold;
  const uiBold = typography.uiBold ? { fontFamily: typography.uiBold } : null;
  const uiRegular = typography.uiRegular ? { fontFamily: typography.uiRegular } : null;

  const backGlyph = isRTL ? "\u203a" : "\u2039";

  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, [fetchAll])
  );

  const showError = (title, message) => {
    if (Platform.OS === "web") {
      window.alert?.(`${title}\n\n${message}`);
      return;
    }
    Alert.alert(title, message);
  };

  const handleCreate = async (payload) => {
    if (!payload.name) {
      showError(t("templatesPage.nameRequiredTitle"), t("templatesPage.nameRequiredBody"));
      return false;
    }

    const cleanedFields = payload.fields.filter((field) => field.label);
    if (cleanedFields.length === 0) {
      showError(t("templatesPage.questionRequiredTitle"), t("templatesPage.questionRequiredBody"));
      return false;
    }

    setSaving(true);
    try {
      await createTemplate({ ...payload, fields: cleanedFields });
      return true;
    } catch (e) {
      showError(t("templatesPage.addFailTitle"), e.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const openAddTemplateModal = () => {
    setFormKey((k) => k + 1);
    setAddModalVisible(true);
  };

  const handleCreateFromModal = async (payload) => {
    const ok = await handleCreate(payload);
    if (ok) setAddModalVisible(false);
    return ok;
  };

  const confirmDelete = (template) => {
    const runDelete = async () => {
      setSaving(true);
      try {
        await deleteTemplateById(template.id);
      } catch (e) {
        showError(t("templatesPage.deleteFailTitle"), e.message);
      } finally {
        setSaving(false);
      }
    };

    const message = t("templatesPage.deleteBody", { name: template.name });

    if (Platform.OS === "web" && typeof window !== "undefined" && typeof window.confirm === "function") {
      if (window.confirm(`${t("templatesPage.deleteConfirmWeb")}\n\n${message}`)) void runDelete();
      return;
    }

    Alert.alert(t("templatesPage.deleteTitle"), message, [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("common.delete"), style: "destructive", onPress: () => void runDelete() },
    ]);
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.diary.accent} size="large" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyCard}>
          <Text style={[styles.emptyTitle, uiBold]}>{t("templatesPage.loadErrorTitle")}</Text>
          <Text style={[styles.emptyText, uiRegular]}>{error}</Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={fetchAll}>
            <Text style={[styles.secondaryButtonText, uiBold]}>{t("common.tryAgain")}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyCard}>
        <Text style={[styles.emptyTitle, handwritingBold ? { fontFamily: handwritingBold } : null]}>
          {t("templatesPage.emptyTitle")}
        </Text>
        <Text style={[styles.emptyText, uiRegular]}>{t("templatesPage.emptyBody")}</Text>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.diary.canvas} />

      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() =>
            navigation.canGoBack() ? navigation.goBack() : navigation.navigate("SettingsHome")
          }
          style={styles.topAction}
        >
          <Text style={[styles.topActionText, uiBold]}>{backGlyph}</Text>
        </TouchableOpacity>
        <View style={styles.topBarCenter} />
        <TouchableOpacity
          style={styles.addButton}
          onPress={openAddTemplateModal}
          accessibilityRole="button"
          accessibilityLabel={t("templatesPage.addTemplateA11y")}
        >
          <Text style={[styles.addButtonText, uiBold]}>{t("templatesPage.addTemplateGlyph")}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={templates}
        keyExtractor={(item) => String(item.id)}
        extraData={locale}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading && templates.length > 0}
            onRefresh={fetchAll}
            tintColor={colors.diary.accent}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.listTitle, handwritingBold ? { fontFamily: handwritingBold } : null]}>
              {t("templatesPage.listTitle")}
            </Text>
          </View>
        }
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => (
          <ExerciseTemplateCard template={item} onDelete={() => confirmDelete(item)} />
        )}
        showsVerticalScrollIndicator={false}
      />

      <AddExerciseTemplateModal
        key={formKey}
        visible={addModalVisible}
        onClose={() => {
          if (!saving) setAddModalVisible(false);
        }}
        onSubmit={handleCreateFromModal}
        saving={saving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.diary.canvas,
    flex: 1,
  },
  topBar: {
    alignItems: "center",
    backgroundColor: colors.diary.canvas,
    flexDirection: "row",
    paddingBottom: 8,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 46 : 28,
  },
  topAction: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  addButton: {
    alignItems: "center",
    borderColor: colors.diary.divider,
    borderRadius: radius.full,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  addButtonText: {
    color: colors.diary.ink,
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 26,
    marginTop: -2,
  },
  topBarCenter: {
    flex: 1,
  },
  topActionText: {
    color: colors.diary.inkMid,
    fontSize: 20,
  },
  listContent: {
    paddingBottom: 36,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 14,
    paddingTop: 6,
  },
  listTitle: {
    color: colors.diary.ink,
    fontSize: 32,
    lineHeight: 38,
  },
  centerState: {
    alignItems: "center",
    paddingVertical: 42,
  },
  emptyCard: {
    alignItems: "flex-start",
    backgroundColor: colors.diary.paper,
    borderColor: colors.diary.accentLight,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 18,
  },
  emptyTitle: {
    color: colors.diary.ink,
    fontSize: 22,
    marginBottom: 8,
  },
  emptyText: {
    color: colors.diary.inkMid,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  secondaryButton: {
    borderColor: colors.diary.divider,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  secondaryButtonText: {
    color: colors.diary.inkMid,
    fontSize: 13,
    fontWeight: "700",
  },
});
