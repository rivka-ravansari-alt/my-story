import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors } from "../../styles/colors";
import { radius } from "../../styles/spacing";

const emptyField = () => ({
  id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  label: "",
  placeholder: "",
  type: "text",
});

export default function ExerciseTemplateForm({ onSubmit, saving }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([emptyField()]);

  const updateField = (id, patch) => {
    setFields((current) => current.map((field) => (field.id === id ? { ...field, ...patch } : field)));
  };

  const removeField = (id) => {
    setFields((current) => (current.length === 1 ? current : current.filter((field) => field.id !== id)));
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setFields([emptyField()]);
  };

  const handleSubmit = async () => {
    const saved = await onSubmit({
      name: name.trim(),
      description: description.trim(),
      fields: fields.map((field) => ({
        ...field,
        label: field.label.trim(),
        placeholder: field.placeholder.trim(),
      })),
    });
    if (saved !== false) {
      resetForm();
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Add exercise template</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Template name"
        placeholderTextColor={colors.diary.inkLight}
        style={styles.input}
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder="Description"
        placeholderTextColor={colors.diary.inkLight}
        style={[styles.input, styles.longInput]}
      />

      <Text style={styles.fieldHeading}>Questions / fields</Text>
      {fields.map((field, index) => (
        <View key={field.id} style={styles.fieldCard}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldTitle}>Field {index + 1}</Text>
            <TouchableOpacity onPress={() => removeField(field.id)} disabled={fields.length === 1}>
              <Text style={[styles.removeText, fields.length === 1 && styles.disabledText]}>Remove</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            value={field.label}
            onChangeText={(value) => updateField(field.id, { label: value })}
            placeholder="Question or label"
            placeholderTextColor={colors.diary.inkLight}
            style={styles.input}
          />
          <TextInput
            value={field.placeholder}
            onChangeText={(value) => updateField(field.id, { placeholder: value })}
            placeholder="Placeholder"
            placeholderTextColor={colors.diary.inkLight}
            style={styles.input}
          />
          <View style={styles.typeRow}>
            {["text", "long_text"].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => updateField(field.id, { type })}
                style={[styles.typeChip, field.type === type && styles.typeChipActive]}
              >
                <Text style={[styles.typeChipText, field.type === type && styles.typeChipTextActive]}>
                  {type === "long_text" ? "Long text" : "Text"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => setFields((current) => [...current, emptyField()])}>
          <Text style={styles.secondaryButtonText}>Add field</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.primaryButton, saving && styles.disabled]} onPress={handleSubmit} disabled={saving}>
          <Text style={styles.primaryButtonText}>Save template</Text>
        </TouchableOpacity>
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
    minHeight: 76,
    textAlignVertical: "top",
  },
  fieldHeading: {
    color: colors.diary.inkMid,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 2,
    textTransform: "uppercase",
  },
  fieldCard: {
    backgroundColor: colors.diary.paperAlt,
    borderColor: colors.diary.ruleLine,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: 10,
    padding: 12,
  },
  fieldHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  fieldTitle: {
    color: colors.diary.ink,
    fontSize: 13,
    fontWeight: "800",
  },
  removeText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: "800",
  },
  disabledText: {
    opacity: 0.35,
  },
  typeRow: {
    flexDirection: "row",
    gap: 8,
  },
  typeChip: {
    borderColor: colors.diary.divider,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  typeChipActive: {
    backgroundColor: colors.diary.ink,
    borderColor: colors.diary.ink,
  },
  typeChipText: {
    color: colors.diary.inkMid,
    fontSize: 12,
    fontWeight: "800",
  },
  typeChipTextActive: {
    color: colors.diary.paper,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: colors.diary.ink,
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primaryButtonText: {
    color: colors.diary.paper,
    fontSize: 13,
    fontWeight: "800",
  },
  secondaryButton: {
    borderColor: colors.diary.divider,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: colors.diary.inkMid,
    fontSize: 13,
    fontWeight: "800",
  },
  disabled: {
    opacity: 0.6,
  },
});
