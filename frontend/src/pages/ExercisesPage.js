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
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import AddExerciseModal from "../components/exercises/AddExerciseModal";
import ExerciseCard from "../components/exercises/ExerciseCard";
import { useLocale, useTypography } from "../context/LocaleContext";
import { useExerciseTemplates } from "../hooks/useExerciseTemplates";
import { useExercises } from "../hooks/useExercises";
import { colors } from "../styles/colors";
import { radius } from "../styles/spacing";

export default function ExercisesPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { exercises, loading, error, fetchAll, createExercise, deleteExerciseById } = useExercises();
  const { templates, fetchAll: fetchTemplates } = useExerciseTemplates();
  const { locale, t } = useLocale();
  const typography = useTypography();
  const [saving, setSaving] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handwritingBold = typography.journalBold;
  const uiRegular = typography.uiRegular ? { fontFamily: typography.uiRegular } : null;
  const uiBold = typography.uiBold ? { fontFamily: typography.uiBold } : null;

  useFocusEffect(
    useCallback(() => {
      fetchAll();
      fetchTemplates();
    }, [fetchAll, fetchTemplates])
  );

  useFocusEffect(
    useCallback(() => {
      const preset = route.params?.presetExerciseDate;
      if (!preset) return;
      setFormKey((k) => k + 1);
      setAddModalVisible(true);
      navigation.setParams({ presetExerciseDate: undefined });
    }, [route.params?.presetExerciseDate, navigation])
  );

  const showError = (title, message) => {
    if (Platform.OS === "web") {
      window.alert?.(`${title}\n\n${message}`);
      return;
    }
    Alert.alert(title, message);
  };

  const handleCreate = async (payload) => {
    if (!payload.template_id) {
      showError(t("exercises.templateRequiredTitle"), t("exercises.templateRequiredBody"));
      return false;
    }
    if (!payload.name) {
      showError(t("exercises.nameRequiredTitle"), t("exercises.nameRequiredBody"));
      return false;
    }

    setSaving(true);
    try {
      await createExercise(payload);
      setAddModalVisible(false);
      return true;
    } catch (e) {
      showError(t("exercises.addFailTitle"), e.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (exercise) => {
    const runDelete = async () => {
      setSaving(true);
      try {
        await deleteExerciseById(exercise.id);
      } catch (e) {
        showError(t("exercises.deleteFailTitle"), e.message);
      } finally {
        setSaving(false);
      }
    };

    const message = t("exercises.deleteBody", { name: exercise.name });

    if (Platform.OS === "web" && typeof window !== "undefined" && typeof window.confirm === "function") {
      if (window.confirm(`${t("exercises.deleteConfirmWeb")}\n\n${message}`)) void runDelete();
      return;
    }

    Alert.alert(t("exercises.deleteTitle"), message, [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("common.delete"), style: "destructive", onPress: () => void runDelete() },
    ]);
  };

  const openAddExerciseModal = () => {
    setFormKey((k) => k + 1);
    setAddModalVisible(true);
  };

  const handleCreateFromModal = async (payload) => handleCreate(payload);

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
          <Text style={[styles.emptyTitle, uiBold]}>{t("exercises.loadErrorTitle")}</Text>
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
          {t("exercises.emptyTitle")}
        </Text>
        <Text style={[styles.emptyText, uiRegular]}>{t("exercises.emptyBody")}</Text>
        {templates.length === 0 ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              navigation.navigate("SettingsPage", { screen: "ExerciseTemplatesPage" })
            }
          >
            <Text style={[styles.primaryButtonText, uiBold]}>{t("exercises.createTemplateFirst")}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.primaryButton} onPress={openAddExerciseModal}>
            <Text style={[styles.primaryButtonText, uiBold]}>{t("exercises.addFirstExercise")}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.diary.canvas} />

      <View style={styles.topBar}>
        <View style={styles.topBarCenter} />
        <TouchableOpacity
          style={styles.addButton}
          onPress={openAddExerciseModal}
          accessibilityRole="button"
          accessibilityLabel={t("exercises.addExerciseA11y")}
        >
          <Text style={[styles.addButtonText, uiBold]}>{t("exercises.addExerciseGlyph")}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={exercises}
        keyExtractor={(item) => String(item.id)}
        extraData={locale}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading && exercises.length > 0}
            onRefresh={fetchAll}
            tintColor={colors.diary.accent}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, handwritingBold ? { fontFamily: handwritingBold } : null]}>
              {t("exercises.title")}
            </Text>
          </View>
        }
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => <ExerciseCard exercise={item} onDelete={() => confirmDelete(item)} />}
        showsVerticalScrollIndicator={false}
      />

      <AddExerciseModal
        key={formKey}
        visible={addModalVisible}
        templates={templates}
        saving={saving}
        onClose={() => {
          if (!saving) setAddModalVisible(false);
        }}
        onSubmit={handleCreateFromModal}
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
  topBarCenter: {
    flex: 1,
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
  title: {
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
    elevation: 4,
    padding: 18,
    shadowColor: colors.diary.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
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
  primaryButton: {
    backgroundColor: colors.diary.ink,
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  primaryButtonText: {
    color: colors.diary.paper,
    fontSize: 13,
    fontWeight: "700",
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
