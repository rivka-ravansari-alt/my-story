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
import ExerciseCard from "../components/exercises/ExerciseCard";
import ExerciseForm from "../components/exercises/ExerciseForm";
import { useExerciseTemplates } from "../hooks/useExerciseTemplates";
import { useExercises } from "../hooks/useExercises";
import { colors } from "../styles/colors";
import { radius } from "../styles/spacing";

export default function ExercisesPage() {
  const navigation = useNavigation();
  const { exercises, loading, error, fetchAll, createExercise, deleteExerciseById } = useExercises();
  const { templates, fetchAll: fetchTemplates } = useExerciseTemplates();
  const [fontsLoaded] = useFonts({ Caveat_700Bold });
  const [saving, setSaving] = useState(false);
  const handwritingBold = fontsLoaded ? "Caveat_700Bold" : undefined;

  useFocusEffect(
    useCallback(() => {
      fetchAll();
      fetchTemplates();
    }, [fetchAll, fetchTemplates])
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
      showError("Template required", "Please select a template before saving an exercise.");
      return false;
    }
    if (!payload.name) {
      showError("Exercise name required", "Please enter a name for this exercise.");
      return false;
    }

    setSaving(true);
    try {
      await createExercise(payload);
      return true;
    } catch (e) {
      showError("Could not add exercise", e.message);
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
        showError("Could not delete exercise", e.message);
      } finally {
        setSaving(false);
      }
    };

    const message = `"${exercise.name}" will be permanently deleted.`;

    if (Platform.OS === "web" && typeof window !== "undefined" && typeof window.confirm === "function") {
      if (window.confirm(`Delete exercise?\n\n${message}`)) void runDelete();
      return;
    }

    Alert.alert("Delete exercise?", message, [
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
          <Text style={styles.emptyTitle}>Could not load exercises</Text>
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
          No exercises yet
        </Text>
        <Text style={styles.emptyText}>
          Select a template, set a rhythm, and save your answers as a personal exercise.
        </Text>
        {templates.length === 0 ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              navigation.navigate("SettingsPage", { screen: "ExerciseTemplatesPage" })
            }
          >
            <Text style={styles.primaryButtonText}>Create a template first</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.diary.canvas} />
      <FlatList
        data={exercises}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading && exercises.length > 0}
            onRefresh={fetchAll}
            tintColor={colors.diary.accent}
          />
        }
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={[styles.title, handwritingBold ? { fontFamily: handwritingBold } : null]}>
                Exercises
              </Text>
              <Text style={styles.subtitle}>
                Turn reusable templates into filled-in practices with frequency and schedule.
              </Text>
            </View>
            <ExerciseForm templates={templates} onSubmit={handleCreate} saving={saving} />
          </>
        }
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => <ExerciseCard exercise={item} onDelete={() => confirmDelete(item)} />}
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
  listContent: {
    paddingBottom: 36,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 46 : 28,
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
    textAlign: "left",
    writingDirection: "ltr",
  },
  subtitle: {
    color: colors.diary.inkMid,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
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
