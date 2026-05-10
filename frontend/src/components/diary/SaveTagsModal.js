import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../styles/colors";
import { radius } from "../../styles/spacing";

export default function SaveTagsModal({
  visible,
  tags = [],
  initialSelectedIds = [],
  saving,
  isEditing,
  onClose,
  onSave,
  onSkip,
}) {
  const [draftIds, setDraftIds] = useState(initialSelectedIds);

  useEffect(() => {
    if (visible) {
      setDraftIds(initialSelectedIds);
    }
  }, [initialSelectedIds, visible]);

  const toggleTag = (id) => {
    setDraftIds((prev) =>
      prev.includes(id) ? prev.filter((tagId) => tagId !== id) : [...prev, id]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!saving) onClose();
      }}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={saving ? undefined : onClose} />

        <View style={styles.card}>
          <Text style={styles.eyebrow}>Almost saved</Text>
          <Text style={styles.title}>Add tags?</Text>
          <Text style={styles.subtitle}>
            Choose a few quiet markers for this memory, or skip and keep writing simple.
          </Text>

          {tags.length ? (
            <ScrollView
              style={styles.tagScroll}
              contentContainerStyle={styles.tagList}
              showsVerticalScrollIndicator={false}
            >
              {tags.map((tag) => {
                const selected = draftIds.includes(tag.id);
                const baseColor = tag.color || colors.diary.accent;

                return (
                  <TouchableOpacity
                    key={tag.id}
                    style={[
                      styles.chip,
                      { borderColor: baseColor },
                      selected && { backgroundColor: baseColor },
                    ]}
                    onPress={() => toggleTag(tag.id)}
                    activeOpacity={0.75}
                    disabled={saving}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {tag.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No tags yet. You can save now and add tags later.</Text>
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.primaryButton, saving && styles.disabled]}
              onPress={() => onSave(draftIds)}
              disabled={saving}
              activeOpacity={0.85}
            >
              {saving ? (
                <ActivityIndicator size="small" color={colors.diary.paper} />
              ) : (
                <Text style={styles.primaryText}>
                  {isEditing ? "Save changes" : "Save story"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.skipButton, saving && styles.disabled]}
              onPress={onSkip}
              disabled={saving}
              activeOpacity={0.75}
            >
              <Text style={styles.skipText}>Skip tags</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: "center",
    backgroundColor: "rgba(44, 26, 14, 0.38)",
    flex: 1,
    justifyContent: "center",
    padding: 22,
  },
  card: {
    backgroundColor: colors.diary.paper,
    borderColor: colors.diary.accentLight,
    borderRadius: radius.xl,
    borderWidth: 1,
    maxWidth: 420,
    padding: 22,
    shadowColor: colors.diary.shadow,
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    width: "100%",
  },
  eyebrow: {
    color: colors.diary.inkLight,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 5,
    textAlign: "left",
    textTransform: "uppercase",
    writingDirection: "ltr",
  },
  title: {
    color: colors.diary.ink,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
    textAlign: "left",
    writingDirection: "ltr",
  },
  subtitle: {
    color: colors.diary.inkMid,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    textAlign: "left",
    writingDirection: "ltr",
  },
  tagScroll: {
    maxHeight: 150,
  },
  tagList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingBottom: 2,
  },
  chip: {
    backgroundColor: colors.diary.paperAlt,
    borderRadius: radius.full,
    borderWidth: 1.5,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },
  chipText: {
    color: colors.diary.inkMid,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "left",
    writingDirection: "auto",
  },
  chipTextSelected: {
    color: colors.diary.paper,
  },
  emptyBox: {
    backgroundColor: colors.diary.paperAlt,
    borderColor: colors.diary.ruleLine,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 12,
  },
  emptyText: {
    color: colors.diary.inkMid,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "left",
    writingDirection: "ltr",
  },
  actions: {
    gap: 10,
    marginTop: 18,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.diary.ink,
    borderRadius: radius.full,
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  primaryText: {
    color: colors.diary.paper,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
    writingDirection: "ltr",
  },
  skipButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  skipText: {
    color: colors.diary.inkLight,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    writingDirection: "ltr",
  },
  disabled: {
    opacity: 0.6,
  },
});
