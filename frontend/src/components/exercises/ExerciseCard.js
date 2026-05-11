import React, { useMemo, useState } from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useLocale, useTypography } from "../../context/LocaleContext";

import { colors } from "../../styles/colors";

import { radius } from "../../styles/spacing";



export default function ExerciseCard({ exercise, onDelete }) {

  const { t } = useLocale();

  const typography = useTypography();

  const fields = exercise.template_fields || [];

  const answers = exercise.answers || {};

  const [expanded, setExpanded] = useState(false);



  const uiBold = typography.uiBold ? { fontFamily: typography.uiBold } : null;

  const uiRegular = typography.uiRegular ? { fontFamily: typography.uiRegular } : null;



  const frequencyLabel = useMemo(() => {

    const key = exercise.frequency;

    const labelKey = `exerciseCard.frequency.${key}`;

    const resolved = t(labelKey);

    return resolved === labelKey ? key : resolved;

  }, [exercise.frequency, t]);



  const toggleExpanded = () => setExpanded((v) => !v);



  return (

    <View style={styles.card}>

      <View style={styles.headerRow}>

        <TouchableOpacity

          style={styles.expandTapArea}

          onPress={toggleExpanded}

          activeOpacity={0.82}

          accessibilityRole="button"

          accessibilityState={{ expanded }}

          accessibilityHint={expanded ? undefined : t("exerciseCard.expandHint")}

        >

          <View style={styles.titleBlock}>

            <Text style={[styles.title, uiBold]} numberOfLines={2}>

              {exercise.name}

            </Text>

            <Text style={[styles.meta, uiRegular]} numberOfLines={1}>

              {exercise.template_name} · {frequencyLabel}

              {exercise.schedule_time ? ` · ${exercise.schedule_time}` : ""}

            </Text>

          </View>

          <Text style={[styles.chevron, uiBold]}>{expanded ? "\u25b4" : "\u25be"}</Text>

        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>

          <Text style={[styles.deleteText, uiBold]}>{t("exerciseCard.delete")}</Text>

        </TouchableOpacity>

      </View>



      {expanded ? (

        <View style={styles.answers}>

          {fields.map((field, index) => (

            <View key={field.id || `${field.label}-${index}`} style={styles.answerBlock}>

              <Text style={[styles.question, uiBold]}>{field.label}</Text>

              <Text style={[styles.answer, uiRegular]}>

                {answers[field.id] || t("exerciseCard.noAnswer")}

              </Text>

            </View>

          ))}

        </View>

      ) : null}

    </View>

  );

}



const styles = StyleSheet.create({

  card: {

    backgroundColor: colors.diary.paper,

    borderColor: colors.diary.accentLight,

    borderRadius: radius.lg,

    borderWidth: 1,

    elevation: 4,

    marginBottom: 12,

    paddingHorizontal: 16,

    paddingVertical: 14,

    shadowColor: colors.diary.shadow,

    shadowOpacity: 0.12,

    shadowRadius: 14,

    shadowOffset: { width: 0, height: 4 },

  },

  headerRow: {

    alignItems: "flex-start",

    flexDirection: "row",

    gap: 10,

  },

  expandTapArea: {

    alignItems: "flex-start",

    flex: 1,

    flexDirection: "row",

    gap: 8,

    minWidth: 0,

  },

  titleBlock: {

    flex: 1,

    minWidth: 0,

  },

  chevron: {

    color: colors.diary.inkLight,

    fontSize: 16,

    lineHeight: 22,

    marginTop: 2,

  },

  title: {

    color: colors.diary.ink,

    fontSize: 18,

    fontWeight: "800",

    lineHeight: 24,

  },

  meta: {

    color: colors.diary.inkMid,

    fontSize: 12,

    lineHeight: 17,

    marginTop: 4,

  },

  deleteButton: {

    alignSelf: "flex-start",

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

    borderTopColor: colors.diary.ruleLine,

    borderTopWidth: 1,

    marginTop: 12,

    paddingTop: 14,

  },

  answerBlock: {

    borderStartColor: colors.diary.marginLine,

    borderStartWidth: 3,

    paddingStart: 10,

  },

  question: {

    color: colors.diary.ink,

    fontSize: 13,

    fontWeight: "800",

  },

  answer: {

    color: colors.diary.inkMid,

    fontSize: 13,

    lineHeight: 19,

    marginTop: 4,

  },

});

