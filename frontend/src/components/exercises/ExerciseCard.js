import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../styles/colors";
import { radius } from "../../styles/spacing";

const frequencyLabels = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  custom: "Custom",
};

export default function ExerciseCard({ exercise, onDelete }) {
  const fields = exercise.template_fields || [];
  const answers = exercise.answers || {};

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{exercise.name}</Text>
          <Text style={styles.meta}>
            {exercise.template_name} - {frequencyLabels[exercise.frequency] || exercise.frequency}
            {exercise.schedule_time ? ` - ${exercise.schedule_time}` : ""}
          </Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.answers}>
        {fields.map((field, index) => (
          <View key={field.id || `${field.label}-${index}`} style={styles.answerBlock}>
            <Text style={styles.question}>{field.label}</Text>
            <Text style={styles.answer}>{answers[field.id] || "No answer yet"}</Text>
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
  meta: {
    color: colors.diary.inkMid,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    textAlign: "left",
    writingDirection: "ltr",
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
  answers: {
    gap: 10,
    marginTop: 14,
  },
  answerBlock: {
    borderLeftColor: colors.diary.marginLine,
    borderLeftWidth: 3,
    paddingLeft: 10,
  },
  question: {
    color: colors.diary.ink,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "left",
    writingDirection: "auto",
  },
  answer: {
    color: colors.diary.inkMid,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
    textAlign: "left",
    writingDirection: "auto",
  },
});
