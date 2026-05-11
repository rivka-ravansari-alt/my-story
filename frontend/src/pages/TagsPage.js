import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import TagListItem from "../components/tags/TagListItem";
import { useLocale, useTypography } from "../context/LocaleContext";
import { useTags } from "../hooks/useTags";
import { colors } from "../styles/colors";
import { radius } from "../styles/spacing";

const DEFAULT_TAG_COLOR = "#B8780A";

export default function TagsPage() {
  const navigation = useNavigation();
  const { tags, loading, error, fetchAll, createTag, updateTag, deleteTagById } = useTags();
  const { locale, t, isRTL } = useLocale();
  const typography = useTypography();

  const [newTagName, setNewTagName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draftName, setDraftName] = useState("");
  const [saving, setSaving] = useState(false);

  const handwritingBold = typography.journalBold;
  const uiBold = typography.uiBold ? { fontFamily: typography.uiBold } : null;
  const uiRegular = typography.uiRegular ? { fontFamily: typography.uiRegular } : null;

  const backGlyph = isRTL ? "\u203a" : "\u2039";
  const rtlFieldText = isRTL
    ? { textAlign: "right", writingDirection: "rtl" }
    : { textAlign: "left", writingDirection: "ltr" };

  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, [fetchAll])
  );

  const showError = (title, message) => {
    if (Platform.OS === "web") {
      window.alert?.(`${title}\n\n${message}`);
      return;
    }
    Alert.alert(title, message);
  };

  const handleCreate = async () => {
    const name = newTagName.trim();
    if (!name) {
      showError(t("tagsPage.nameRequiredTitle"), t("tagsPage.nameRequiredBody"));
      return;
    }

    setSaving(true);
    try {
      await createTag(name, DEFAULT_TAG_COLOR);
      setNewTagName("");
    } catch (e) {
      showError(t("tagsPage.addFailTitle"), e.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (tag) => {
    setEditingId(tag.id);
    setDraftName(tag.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftName("");
  };

  const saveEdit = async (tag) => {
    const name = draftName.trim();
    if (!name) {
      showError(t("tagsPage.emptyNameTitle"), t("tagsPage.emptyNameBody"));
      return;
    }

    setSaving(true);
    try {
      await updateTag(tag.id, { name });
      cancelEdit();
    } catch (e) {
      showError(t("tagsPage.updateFailTitle"), e.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (tag) => {
    const runDelete = async () => {
      setSaving(true);
      try {
        await deleteTagById(tag.id);
        if (editingId === tag.id) cancelEdit();
      } catch (e) {
        showError(t("tagsPage.deleteFailTitle"), e.message);
      } finally {
        setSaving(false);
      }
    };

    const message = t("tagsPage.deleteBody", { name: tag.name });

    if (Platform.OS === "web" && typeof window !== "undefined" && typeof window.confirm === "function") {
      if (window.confirm(`${t("tagsPage.deleteConfirmWeb")}\n\n${message}`)) void runDelete();
      return;
    }

    Alert.alert(t("tagsPage.deleteTitle"), message, [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("common.delete"), style: "destructive", onPress: () => void runDelete() },
    ]);
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.diary.accent} size="large" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyCard}>
          <Text style={[styles.emptyTitle, uiBold]}>{t("tagsPage.loadErrorTitle")}</Text>
          <Text style={[styles.emptyText, uiRegular]}>{error}</Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={fetchAll}>
            <Text style={[styles.secondaryButtonText, uiBold]}>{t("common.tryAgain")}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyCard}>
        <Text style={[styles.emptyTitle, handwritingBold ? { fontFamily: handwritingBold } : null]}>
          {t("tagsPage.emptyTitle")}
        </Text>
        <Text style={[styles.emptyText, uiRegular]}>{t("tagsPage.emptyBody")}</Text>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.diary.canvas} />

      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() =>
            navigation.canGoBack() ? navigation.goBack() : navigation.navigate("SettingsHome")
          }
          style={styles.topAction}
        >
          <Text style={[styles.topActionText, uiBold]}>{backGlyph}</Text>
        </TouchableOpacity>
        <Text style={[styles.topTitle, handwritingBold ? { fontFamily: handwritingBold } : null]}>
          {t("tagsPage.title")}
        </Text>
        <View style={styles.topAction} />
      </View>

      <FlatList
        data={tags}
        keyExtractor={(item) => String(item.id)}
        extraData={locale}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading && tags.length > 0}
            onRefresh={fetchAll}
            tintColor={colors.diary.accent}
          />
        }
        ListHeaderComponent={
          <View style={styles.card}>
            <Text style={[styles.sectionTitle, uiBold, rtlFieldText]}>{t("tagsPage.addSection")}</Text>
            <View style={styles.createRow}>
              <TextInput
                value={newTagName}
                onChangeText={setNewTagName}
                onSubmitEditing={handleCreate}
                placeholder={t("tagsPage.placeholder")}
                placeholderTextColor={colors.diary.inkLight}
                style={[styles.createInput, uiRegular, rtlFieldText]}
              />
              <TouchableOpacity
                style={[styles.addButton, saving && styles.disabled]}
                onPress={handleCreate}
                disabled={saving}
              >
                <Text style={[styles.addButtonText, uiBold]}>{t("tagsPage.add")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TagListItem
              tag={item}
              editing={editingId === item.id}
              draftName={draftName}
              saving={saving}
              onChangeDraftName={setDraftName}
              onStartEdit={() => startEdit(item)}
              onCancelEdit={cancelEdit}
              onSaveEdit={() => saveEdit(item)}
              onDelete={() => confirmDelete(item)}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.diary.canvas,
    flex: 1,
  },
  topBar: {
    alignItems: "center",
    backgroundColor: colors.diary.canvas,
    flexDirection: "row",
    paddingBottom: 8,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 46 : 28,
  },
  topAction: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  topActionText: {
    color: colors.diary.inkMid,
    fontSize: 20,
  },
  topTitle: {
    color: colors.diary.ink,
    flex: 1,
    fontSize: 28,
    lineHeight: 34,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 36,
    paddingHorizontal: 16,
  },
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
  sectionTitle: {
    color: colors.diary.ink,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 10,
  },
  createRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  createInput: {
    backgroundColor: colors.diary.paperAlt,
    borderColor: colors.diary.divider,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.diary.ink,
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  addButton: {
    backgroundColor: colors.diary.ink,
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  disabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: colors.diary.paper,
    fontSize: 13,
    fontWeight: "700",
  },
  centerState: {
    alignItems: "center",
    paddingVertical: 42,
  },
  emptyCard: {
    alignItems: "flex-start",
    backgroundColor: colors.diary.paper,
    borderColor: colors.diary.accentLight,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 18,
  },
  emptyTitle: {
    color: colors.diary.ink,
    fontSize: 22,
    marginBottom: 8,
  },
  emptyText: {
    color: colors.diary.inkMid,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  secondaryButton: {
    borderColor: colors.diary.divider,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  secondaryButtonText: {
    color: colors.diary.inkMid,
    fontSize: 13,
    fontWeight: "700",
  },
});
