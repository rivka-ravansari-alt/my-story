import React, { useEffect, useMemo, useState } from "react";
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useLocale, useTypography } from "../../context/LocaleContext";
import { colors } from "../../styles/colors";
import { radius } from "../../styles/spacing";
import { hebrewInputRtlStyle, withRtlPlaceholder } from "../../utils/rtlTextInput";

const DEFAULT_FREQUENCY = "daily";

/** Comfortable minimum visible lines; content grows up to max then scrolls inside. */
const ANSWER_INPUT_MIN = 64;
const ANSWER_INPUT_MAX = 320;

const IS_WEB = Platform.OS === "web";

function contentPaddingY() {
  if (Platform.OS === "ios") return 16;
  if (Platform.OS === "android") return 8;
  return 10;
}

export default function ExerciseForm({ templates, onSubmit, saving, embedded }) {
  const { locale, t } = useLocale();
  const isHebrew = locale === "he";
  const typography = useTypography();
  const [templateId, setTemplateId] = useState(null);
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState({});
  /** Raw content heights from layout; box height is clamped between min and max */
  const [answerContentHeights, setAnswerContentHeights] = useState({});

  useEffect(() => {
    setAnswerContentHeights({});
  }, [templateId]);

  const uiBold = typography.uiBold ? { fontFamily: typography.uiBold } : null;
  const uiRegular = typography.uiRegular ? { fontFamily: typography.uiRegular } : null;

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
    setTemplateId(null);
    setName("");
    setAnswers({});
  };

  const handleSubmit = async () => {
    const saved = await onSubmit({
      template_id: templateId,
      name: name.trim(),
      frequency: DEFAULT_FREQUENCY,
      schedule_time: "",
      answers,
    });
    if (saved !== false) {
      resetForm();
    }
  };

  const templateChosen = Boolean(templateId);
  const hasTemplates = templates.length > 0;

  return (
    <View style={[styles.card, embedded && styles.cardEmbedded]}>
      {!embedded ? <Text style={[styles.sectionTitle, uiBold]}>{t("exerciseForm.sectionTitle")}</Text> : null}

      {!hasTemplates ? (
        <Text style={[styles.helperText, uiRegular]}>{t("exerciseForm.createTemplateFirst")}</Text>
      ) : (
        <>
          <Text style={[styles.label, uiBold]}>{t("exerciseForm.templateLabel")}</Text>
          {!templateChosen ? (
            <Text style={[styles.helperText, uiRegular, styles.hintBelowLabel]}>
              {t("exerciseForm.chooseTemplateHint")}
            </Text>
          ) : null}
          <View style={styles.chipRow}>
            {templates.map((template) => (
              <TouchableOpacity
                key={template.id}
                onPress={() => selectTemplate(template.id)}
                style={[styles.chip, template.id === templateId && styles.chipActive]}
              >
                <Text style={[styles.chipText, uiBold, template.id === templateId && styles.chipTextActive]}>
                  {template.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {templateChosen ? (
            <>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={withRtlPlaceholder(t("exerciseForm.namePlaceholder"), isHebrew)}
                placeholderTextColor={colors.diary.inkLight}
                style={[styles.input, uiRegular, hebrewInputRtlStyle(isHebrew)]}
                textAlign={isHebrew ? "right" : "left"}
                writingDirection={isHebrew ? "rtl" : "ltr"}
              />

              {(selectedTemplate?.fields || []).map((field, index) => {
                const fieldKey = field.id != null ? `f-${field.id}` : `i-${index}`;
                const rawH = answerContentHeights[fieldKey];
                const paddedMin = ANSWER_INPUT_MIN;
                const contentH = rawH != null ? rawH : paddedMin;
                const boxHeight = Math.min(ANSWER_INPUT_MAX, Math.max(paddedMin, contentH));
                const overflowScroll = !IS_WEB && contentH >= ANSWER_INPUT_MAX;

                return (
                  <View key={field.id || `${field.label}-${index}`} style={styles.answerField}>
                    <Text style={[styles.question, uiBold]}>{field.label}</Text>
                    <TextInput
                      value={answers[field.id] || ""}
                      onChangeText={(value) => updateAnswer(field.id, value)}
                      multiline
                      blurOnSubmit={false}
                      scrollEnabled={overflowScroll}
                      textAlignVertical="top"
                      placeholder={withRtlPlaceholder(
                        field.placeholder || t("exerciseForm.answerPlaceholder"),
                        isHebrew
                      )}
                      placeholderTextColor={colors.diary.inkLight}
                      onContentSizeChange={
                        IS_WEB
                          ? undefined
                          : (e) => {
                              const { height: h } = e.nativeEvent.contentSize;
                              const next = Math.ceil(h + contentPaddingY());
                              setAnswerContentHeights((prev) => {
                                if (prev[fieldKey] === next) return prev;
                                return { ...prev, [fieldKey]: next };
                              });
                            }
                      }
                      style={[
                        styles.input,
                        styles.answerInput,
                        styles.answerText,
                        uiRegular,
                        hebrewInputRtlStyle(isHebrew),
                        IS_WEB
                          ? { minHeight: ANSWER_INPUT_MIN, maxHeight: ANSWER_INPUT_MAX }
                          : { height: boxHeight, maxHeight: ANSWER_INPUT_MAX },
                      ]}
                      textAlign={isHebrew ? "right" : "left"}
                      writingDirection={isHebrew ? "rtl" : "ltr"}
                    />
                  </View>
                );
              })}

              <TouchableOpacity
                style={[styles.primaryButton, saving && styles.disabled]}
                onPress={handleSubmit}
                disabled={saving}
              >
                <Text style={[styles.primaryButtonText, uiBold]}>{t("exerciseForm.save")}</Text>
              </TouchableOpacity>
            </>
          ) : null}
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
  helperText: {
    color: colors.diary.inkMid,
    fontSize: 14,
    lineHeight: 20,
  },
  hintBelowLabel: {
    marginBottom: 8,
    marginTop: -4,
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
  },
  answerInput: {
    paddingTop: Platform.OS === "ios" ? 12 : 10,
    paddingBottom: Platform.OS === "ios" ? 12 : 10,
  },
  answerText: {
    lineHeight: 20,
  },
  answerField: {
    marginTop: 2,
  },
  question: {
    color: colors.diary.ink,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
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
