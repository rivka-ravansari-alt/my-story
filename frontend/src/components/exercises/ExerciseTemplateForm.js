import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useLocale, useTypography } from "../../context/LocaleContext";
import { colors } from "../../styles/colors";
import { radius } from "../../styles/spacing";
import { hebrewInputRtlStyle, withRtlPlaceholder } from "../../utils/rtlTextInput";

const emptyField = () => ({
  id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  label: "",
  placeholder: "",
  type: "text",
});

export default function ExerciseTemplateForm({ onSubmit, saving, embedded }) {
  const { locale, t } = useLocale();
  const isHebrew = locale === "he";
  const typography = useTypography();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([emptyField()]);

  const uiBold = typography.uiBold ? { fontFamily: typography.uiBold } : null;
  const uiRegular = typography.uiRegular ? { fontFamily: typography.uiRegular } : null;

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
    <View style={[styles.card, embedded && styles.cardEmbedded]}>
      {!embedded ? <Text style={[styles.sectionTitle, uiBold]}>{t("templateForm.sectionTitle")}</Text> : null}
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder={withRtlPlaceholder(t("templateForm.namePlaceholder"), isHebrew)}
        placeholderTextColor={colors.diary.inkLight}
        style={[styles.input, uiRegular, hebrewInputRtlStyle(isHebrew)]}
        textAlign={isHebrew ? "right" : "left"}
        writingDirection={isHebrew ? "rtl" : "ltr"}
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder={withRtlPlaceholder(t("templateForm.descriptionPlaceholder"), isHebrew)}
        placeholderTextColor={colors.diary.inkLight}
        style={[styles.input, styles.longInput, uiRegular, hebrewInputRtlStyle(isHebrew)]}
        textAlign={isHebrew ? "right" : "left"}
        writingDirection={isHebrew ? "rtl" : "ltr"}
      />

      <Text style={[styles.fieldHeading, uiBold]}>{t("templateForm.fieldsHeading")}</Text>
      {fields.map((field, index) => (
        <View key={field.id} style={styles.fieldCard}>
          <View style={styles.fieldHeader}>
            <Text style={[styles.fieldTitle, uiBold]}>{t("templateForm.fieldTitle", { n: index + 1 })}</Text>
            <TouchableOpacity onPress={() => removeField(field.id)} disabled={fields.length === 1}>
              <Text style={[styles.removeText, uiBold, fields.length === 1 && styles.disabledText]}>
                {t("templateForm.remove")}
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            value={field.label}
            onChangeText={(value) => updateField(field.id, { label: value })}
            placeholder={withRtlPlaceholder(t("templateForm.questionPlaceholder"), isHebrew)}
            placeholderTextColor={colors.diary.inkLight}
            style={[styles.input, uiRegular, hebrewInputRtlStyle(isHebrew)]}
            textAlign={isHebrew ? "right" : "left"}
            writingDirection={isHebrew ? "rtl" : "ltr"}
          />
          <TextInput
            value={field.placeholder}
            onChangeText={(value) => updateField(field.id, { placeholder: value })}
            placeholder={withRtlPlaceholder(t("templateForm.placeholderHint"), isHebrew)}
            placeholderTextColor={colors.diary.inkLight}
            style={[styles.input, uiRegular, hebrewInputRtlStyle(isHebrew)]}
            textAlign={isHebrew ? "right" : "left"}
            writingDirection={isHebrew ? "rtl" : "ltr"}
          />
          <View style={styles.typeRow}>
            {["text", "long_text"].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => updateField(field.id, { type })}
                style={[styles.typeChip, field.type === type && styles.typeChipActive]}
              >
                <Text style={[styles.typeChipText, uiBold, field.type === type && styles.typeChipTextActive]}>
                  {type === "long_text" ? t("templateForm.longText") : t("templateForm.text")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setFields((current) => [...current, emptyField()])}
        >
          <Text style={[styles.secondaryButtonText, uiBold]}>{t("templateForm.addField")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, saving && styles.disabled]}
          onPress={handleSubmit}
          disabled={saving}
        >
          <Text style={[styles.primaryButtonText, uiBold]}>{t("templateForm.save")}</Text>
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
  cardEmbedded: {
    backgroundColor: "transparent",
    borderWidth: 0,
    marginBottom: 0,
    padding: 0,
  },
  sectionTitle: {
    color: colors.diary.ink,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 12,
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
