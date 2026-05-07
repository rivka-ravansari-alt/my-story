import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "long" }),
    date: d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
}

export default function DiaryDateBanner({ dateStr }) {
  const { weekday, date } = formatDate(dateStr);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.rule} />
        <Text style={styles.weekday}>{weekday}</Text>
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
    marginBottom: 20,
    paddingTop: 4,
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
    fontSize: 13,
    fontWeight: "700",
    color: colors.diary.inkMid,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginHorizontal: 10,
  },
  date: {
    fontSize: 15,
    color: colors.diary.inkLight,
    fontStyle: "italic",
    letterSpacing: 0.3,
    marginBottom: 12,
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
    fontSize: 10,
    color: colors.diary.accent,
    marginHorizontal: 8,
  },
});
