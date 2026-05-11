import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors } from "../../styles/colors";
import { radius } from "../../styles/spacing";

const frequencies = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "custom", label: "Custom" },
];

export default function ExerciseForm({ templates, onSubmit, saving }) {
  const [templateId, setTemplateId] = useState(null);
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [scheduleTime, setScheduleTime] = useState("");
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (templates.length > 0 && !templates.some((template) => template.id === templateId)) {
      setTemplateId(templates[0].id);
    }
  }, [templateId, templates]);

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === templateId),
    [templateId, templates]
  );

  const selectTemplate = (id) => {
    setTemplateId(id);
    setAnswers({});
  };

  const updateAnswer = (fieldId, value) => {
    setAnswers((current) => ({ ...current, [fieldId]: value }));
  };

  const resetForm = () => {
    setName("");
    setFrequency("daily");
    setScheduleTime("");
    setAnswers({});
  };

  const handleSubmit = async () => {
    const saved = await onSubmit({
      template_id: templateId,
      name: name.trim(),
      frequency,
      schedule_time: scheduleTime.trim(),
      answers,
    });
    if (saved !== false) {
      resetForm();
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Add exercise</Text>

      {templates.length === 0 ? (
        <Text style={styles.helperText}>Create an exercise template first, then come back to fill it in.</Text>
      ) : (
        <>
          <Text style={styles.label}>Template</Text>
          <View style={styles.chipRow}>
            {templates.map((template) => (
              <TouchableOpacity
                key={template.id}
                onPress={() => selectTemplate(template.id)}
                style={[styles.chip, template.id === templateId && styles.chipActive]}
              >
                <Text style={[styles.chipText, template.id === templateId && styles.chipTextActive]}>
                  {template.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Exercise name"
            placeholderTextColor={colors.diary.inkLight}
            style={styles.input}
          />

          <Text style={styles.label}>Frequency</Text>
          <View style={styles.chipRow}>
            {frequencies.map((item) => (
              <TouchableOpacity
                key={item.value}
                onPress={() => setFrequency(item.value)}
                style={[styles.chip, frequency === item.value && styles.chipActive]}
              >
                <Text style={[styles.chipText, frequency === item.value && styles.chipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            value={scheduleTime}
            onChangeText={setScheduleTime}
            placeholder="Schedule / time, e.g. 21:00 or Sunday evening"
            placeholderTextColor={colors.diary.inkLight}
            style={styles.input}
          />

          {(selectedTemplate?.fields || []).map((field, index) => (
            <View key={field.id || `${field.label}-${index}`} style={styles.answerField}>
              <Text style={styles.question}>{field.label}</Text>
              <TextInput
                value={answers[field.id] || ""}
                onChangeText={(value) => updateAnswer(field.id, value)}
                multiline={field.type === "long_text"}
                placeholder={field.placeholder || "Write your answer"}
                placeholderTextColor={colors.diary.inkLight}
                style={[styles.input, field.type === "long_text" && styles.longInput]}
              />
            </View>
          ))}

          <TouchableOpacity style={[styles.primaryButton, saving && styles.disabled]} onPress={handleSubmit} disabled={saving}>
            <Text style={styles.primaryButtonText}>Save exercise</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.diary.paper,
    borderColor: colors.diary.accentLight,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  sectionTitle: {
    color: colors.diary.ink,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "left",
    writingDirection: "ltr",
  },
  helperText: {
    color: colors.diary.inkMid,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "left",
    writingDirection: "ltr",
  },
  label: {
    color: colors.diary.inkMid,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    borderColor: colors.diary.divider,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: colors.diary.ink,
    borderColor: colors.diary.ink,
  },
  chipText: {
    color: colors.diary.inkMid,
    fontSize: 12,
    fontWeight: "800",
  },
  chipTextActive: {
    color: colors.diary.paper,
  },
  input: {
    backgroundColor: colors.diary.paperAlt,
    borderColor: colors.diary.divider,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.diary.ink,
    fontSize: 14,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlign: "left",
    writingDirection: "auto",
  },
  longInput: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  answerField: {
    marginTop: 2,
  },
  question: {
    color: colors.diary.ink,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "left",
    writingDirection: "auto",
  },
  primaryButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.diary.ink,
    borderRadius: radius.full,
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primaryButtonText: {
    color: colors.diary.paper,
    fontSize: 13,
    fontWeight: "800",
  },
  disabled: {
    opacity: 0.6,
  },
});
