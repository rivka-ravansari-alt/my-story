import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocale } from "../../context/LocaleContext";
import { colors } from "../../styles/colors";

function formatDate(dateStr, locale) {
  const d = new Date(dateStr + "T00:00:00");
  const loc = locale === "he" ? "he-IL" : "en-US";
  return {
    weekday: d.toLocaleDateString(loc, { weekday: "long" }),
    date: d.toLocaleDateString(loc, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
}

export default function DiaryDateBanner({ dateStr }) {
  const { locale } = useLocale();
  const { weekday, date } = formatDate(dateStr, locale);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.rule} />
        <Text style={[styles.weekday, locale === "he" ? styles.weekdayHe : null]}>{weekday}</Text>
        <View style={styles.rule} />
      </View>
      <Text style={styles.date}>{date}</Text>
      <View style={styles.decorDivider}>
        <View style={styles.decorLine} />
        <Text style={styles.decorSymbol}>✦</Text>
        <View style={styles.decorLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 16,
    paddingTop: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 4,
  },
  rule: {
    flex: 1,
    height: 1,
    backgroundColor: colors.diary.divider,
  },
  weekday: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.diary.inkMid,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginHorizontal: 8,
  },
  weekdayHe: {
    textTransform: "none",
    letterSpacing: 0.4,
  },
  date: {
    fontSize: 14,
    color: colors.diary.inkLight,
    fontStyle: "italic",
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  decorDivider: {
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
  },
  decorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.diary.divider,
  },
  decorSymbol: {
    fontSize: 9,
    color: colors.diary.accent,
    marginHorizontal: 7,
  },
});
