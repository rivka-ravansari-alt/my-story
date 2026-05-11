import React from "react";
import { Platform, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";
import { radius } from "../../styles/spacing";

/** Small download arrow (tray + shaft + chevron), matches diary minimal glyph style. */
function DownloadIcon({ color }) {
  return (
    <View style={downloadIconStyles.root} pointerEvents="none">
      <View style={[downloadIconStyles.shaft, { backgroundColor: color }]} />
      <View
        style={[
          downloadIconStyles.chevron,
          {
            borderTopColor: color,
          },
        ]}
      />
      <View style={[downloadIconStyles.tray, { backgroundColor: color }]} />
    </View>
  );
}

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

export default function EventCard({ event, onPress, onDeletePress, onDownloadTxtPress, titleFontFamily }) {
  const preview = event.preview || event.content || "No content yet for this story.";

  const openStory = () => onPress(event);
  const requestRemove = () => onDeletePress?.(event);
  const requestDownloadTxt = () => onDownloadTxtPress?.(event);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.headerTapArea}
          onPress={openStory}
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
        </TouchableOpacity>

        <View style={styles.headerActions}>
          {onDownloadTxtPress ? (
            <TouchableOpacity
              style={styles.downloadIconButton}
              onPress={requestDownloadTxt}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Download TXT"
            >
              <View {...(Platform.OS === "web" ? { title: "Download TXT" } : {})}>
                <DownloadIcon color={colors.diary.inkLight} />
              </View>
            </TouchableOpacity>
          ) : null}
          {onDeletePress ? (
            <TouchableOpacity
              style={styles.headerActionButton}
              onPress={requestRemove}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Remove story"
            >
              <Text style={styles.headerActionText}>Remove</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <TouchableOpacity
        style={styles.bodyTapArea}
        onPress={openStory}
        activeOpacity={0.82}
        accessibilityRole="button"
        accessibilityLabel={`Open ${event.title || "story"}`}
      >
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: colors.diary.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  headerRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTapArea: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  header: {
    borderBottomColor: colors.diary.ruleLine,
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 10,
  },
  bodyTapArea: {
    alignSelf: "stretch",
    flexShrink: 0,
  },
  headerActions: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 0,
    gap: 12,
    marginLeft: 8,
  },
  downloadIconButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
    paddingVertical: 4,
  },
  headerActionButton: {
    paddingBottom: 2,
    paddingTop: 2,
  },
  headerActionText: {
    color: colors.diary.inkMid,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
    writingDirection: "ltr",
  },
  date: {
    color: colors.diary.inkLight,
    fontSize: 12,
    marginBottom: 4,
    textAlign: "left",
    writingDirection: "ltr",
  },
  title: {
    color: colors.diary.ink,
    fontSize: 22,
    lineHeight: 27,
    textAlign: "left",
    writingDirection: "auto",
  },
  preview: {
    color: colors.diary.inkMid,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "left",
    writingDirection: "auto",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 12,
  },
  tag: {
    backgroundColor: colors.diary.paperAlt,
    borderColor: colors.diary.tag,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    color: colors.diary.tagText,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "left",
    writingDirection: "auto",
  },
});

const downloadIconStyles = StyleSheet.create({
  root: {
    alignItems: "center",
    height: 15,
    justifyContent: "flex-end",
    opacity: 0.92,
    width: 14,
  },
  shaft: {
    borderRadius: 0.5,
    height: 4,
    width: 1.5,
  },
  chevron: {
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderLeftWidth: 3.5,
    borderRightWidth: 3.5,
    borderTopWidth: 4,
    height: 0,
    marginTop: -0.5,
    width: 0,
  },
  tray: {
    borderRadius: 0.5,
    height: 1.5,
    marginTop: 1,
    width: 9,
  },
});
