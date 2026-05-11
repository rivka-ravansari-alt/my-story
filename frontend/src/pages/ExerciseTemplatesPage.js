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
import { useFonts, Caveat_700Bold } from "@expo-google-fonts/caveat";
import ExerciseTemplateCard from "../components/exercises/ExerciseTemplateCard";
import ExerciseTemplateForm from "../components/exercises/ExerciseTemplateForm";
import { useExerciseTemplates } from "../hooks/useExerciseTemplates";
import { colors } from "../styles/colors";
import { radius } from "../styles/spacing";

export default function ExerciseTemplatesPage() {
  const navigation = useNavigation();
  const { templates, loading, error, fetchAll, createTemplate, deleteTemplateById } = useExerciseTemplates();
  const [fontsLoaded] = useFonts({ Caveat_700Bold });
  const [saving, setSaving] = useState(false);
  const handwritingBold = fontsLoaded ? "Caveat_700Bold" : undefined;

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
      showError("Template name required", "Please enter a name for this template.");
      return false;
    }

    const cleanedFields = payload.fields.filter((field) => field.label);
    if (cleanedFields.length === 0) {
      showError("Question required", "Add at least one question or field.");
      return false;
    }

    setSaving(true);
    try {
      await createTemplate({ ...payload, fields: cleanedFields });
      return true;
    } catch (e) {
      showError("Could not add template", e.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (template) => {
    const runDelete = async () => {
      setSaving(true);
      try {
        await deleteTemplateById(template.id);
      } catch (e) {
        showError("Could not delete template", e.message);
      } finally {
        setSaving(false);
      }
    };

    const message = `"${template.name}" will be removed. Existing exercises keep their saved answers.`;

    if (Platform.OS === "web" && typeof window !== "undefined" && typeof window.confirm === "function") {
      if (window.confirm(`Delete template?\n\n${message}`)) void runDelete();
      return;
    }

    Alert.alert("Delete template?", message, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => void runDelete() },
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
          <Text style={styles.emptyTitle}>Could not load templates</Text>
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={fetchAll}>
            <Text style={styles.secondaryButtonText}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyCard}>
        <Text style={[styles.emptyTitle, handwritingBold ? { fontFamily: handwritingBold } : null]}>
          No templates yet
        </Text>
        <Text style={styles.emptyText}>
          Create reusable question structures for check-ins, thought records, reflections, or therapy homework.
        </Text>
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
          <Text style={styles.topActionText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={[styles.topTitle, handwritingBold ? { fontFamily: handwritingBold } : null]}>
          Exercise templates
        </Text>
        <View style={styles.topAction} />
      </View>

      <FlatList
        data={templates}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading && templates.length > 0}
            onRefresh={fetchAll}
            tintColor={colors.diary.accent}
          />
        }
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.subtitle}>
                Build reusable question sets for therapy and self-development exercises.
              </Text>
            </View>
            <ExerciseTemplateForm onSubmit={handleCreate} saving={saving} />
          </>
        }
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => <ExerciseTemplateCard template={item} onDelete={() => confirmDelete(item)} />}
        showsVerticalScrollIndicator={false}
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
  topActionText: {
    color: colors.diary.inkMid,
    fontSize: 20,
  },
  topTitle: {
    color: colors.diary.ink,
    flex: 1,
    fontSize: 28,
    lineHeight: 34,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 36,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 14,
    paddingTop: 2,
  },
  subtitle: {
    color: colors.diary.inkMid,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 0,
    textAlign: "left",
    writingDirection: "ltr",
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
    textAlign: "left",
    writingDirection: "ltr",
  },
  emptyText: {
    color: colors.diary.inkMid,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    textAlign: "left",
    writingDirection: "ltr",
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
