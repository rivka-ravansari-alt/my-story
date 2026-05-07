import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";
import { radius } from "../../styles/spacing";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function EventCard({ event, onPress, titleFontFamily }) {
  const preview = event.preview || event.content || "No content yet for this story.";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(event)}
      activeOpacity={0.82}
      accessibilityRole="button"
    >
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(event.event_date)}</Text>
        <Text
          style={[styles.title, titleFontFamily ? { fontFamily: titleFontFamily } : null]}
          numberOfLines={2}
        >
          {event.title}
        </Text>
      </View>

      <Text style={styles.preview} numberOfLines={3}>
        {preview}
      </Text>

      {event.tags?.length ? (
        <View style={styles.tags}>
          {event.tags.map((tag) => (
            <View key={tag.id} style={[styles.tag, tag.color ? { borderColor: tag.color } : null]}>
              <Text style={styles.tagText}>{tag.name}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.diary.paper,
    borderColor: colors.diary.accentLight,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    shadowColor: colors.diary.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  header: {
    borderBottomColor: colors.diary.ruleLine,
    borderBottomWidth: 1,
    marginBottom: 12,
    paddingBottom: 10,
  },
  date: {
    color: colors.diary.inkLight,
    fontSize: 13,
    marginBottom: 4,
    textAlign: "left",
    writingDirection: "ltr",
  },
  title: {
    color: colors.diary.ink,
    fontSize: 28,
    lineHeight: 32,
    textAlign: "left",
    writingDirection: "auto",
  },
  preview: {
    color: colors.diary.inkMid,
    fontSize: 16,
    lineHeight: 23,
    textAlign: "left",
    writingDirection: "auto",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  tag: {
    backgroundColor: colors.diary.paperAlt,
    borderColor: colors.diary.tag,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: {
    color: colors.diary.tagText,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "left",
    writingDirection: "auto",
  },
});
