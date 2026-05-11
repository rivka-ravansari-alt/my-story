import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useLocale, useTypography } from "../context/LocaleContext";
import { useEvents } from "../hooks/useEvents";
import { useTags } from "../hooks/useTags";
import { eventService } from "../services/eventService";
import JournalPage from "../components/diary/JournalPage";
import DiaryDateBanner from "../components/diary/DiaryDateBanner";
import DiaryTitleField from "../components/diary/DiaryTitleField";
import DiaryBodyField from "../components/diary/DiaryBodyField";
import SaveTagsModal from "../components/diary/SaveTagsModal";
import { colors } from "../styles/colors";

function getLocalDateKey(dateValue = new Date()) {
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, "0");
  const day = String(dateValue.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function WritingPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId, date } = route.params || {};
  const { locale, t, isRTL } = useLocale();
  const typography = useTypography();

  const today = getLocalDateKey();
  const initialDate = date || today;

  const { createEvent, updateEvent } = useEvents();
  const { tags, fetchAll: fetchTags } = useTags();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [eventDate, setEventDate] = useState(initialDate);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [savedEntryTitle, setSavedEntryTitle] = useState("");
  const [showSavedActions, setShowSavedActions] = useState(false);
  const [tagModalVisible, setTagModalVisible] = useState(false);

  const isEditing = Boolean(eventId);

  const uiBoldStyle = typography.uiBold ? { fontFamily: typography.uiBold } : null;
  const uiRegularStyle = typography.uiRegular ? { fontFamily: typography.uiRegular } : null;

  const loadEvent = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const ev = await eventService.getById(eventId);
      setTitle(ev.title || "");
      setContent(ev.content || "");
      setEventDate(ev.event_date || initialDate);
      setSelectedTagIds((ev.tags || []).map((t) => t.id));
    } catch (e) {
      Alert.alert(t("writing.errorTitle"), t("writing.loadFailed", { message: e.message }));
    } finally {
      setLoading(false);
    }
  }, [eventId, initialDate, t]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  useFocusEffect(
    useCallback(() => {
      fetchTags();
    }, [fetchTags])
  );

  useEffect(() => {
    if (isEditing) return;
    setEventDate(initialDate);
    setTitle("");
    setContent("");
    setSelectedTagIds([]);
    setErrors({});
    setShowSavedActions(false);
  }, [initialDate, isEditing]);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = t("writing.titleRequired");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openSaveTagsModal = () => {
    if (!validate()) return;
    setTagModalVisible(true);
  };

  const saveStory = async (tagIds) => {
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        content,
        event_date: eventDate,
        tag_ids: tagIds,
      };
      if (isEditing) {
        await updateEvent(eventId, payload);
        setSelectedTagIds(tagIds);
        setTagModalVisible(false);
        navigation.goBack();
      } else {
        await createEvent(payload);
        setSavedEntryTitle(payload.title);
        setTitle("");
        setContent("");
        setSelectedTagIds([]);
        setErrors({});
        setShowSavedActions(true);
        setTagModalVisible(false);
      }
    } catch (e) {
      console.error("Failed to save event", e.details || e);
      Alert.alert(t("writing.saveFailedTitle"), t("writing.saveFailedBody"));
    } finally {
      setSaving(false);
    }
  };

  const skipTagsAndSave = () => {
    saveStory([]);
  };

  const startNewEvent = () => {
    setTitle("");
    setContent("");
    setSelectedTagIds([]);
    setErrors({});
    setShowSavedActions(false);
    setTagModalVisible(false);
  };

  const finishWriting = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      setShowSavedActions(false);
    }
  };

  const handwritingFont = typography.journalRegular;
  const handwritingBold = typography.journalBold;
  const titleItalic = locale !== "he";

  const backGlyph = navigation.canGoBack() ? (isRTL ? "\u2192" : "\u2190") : null;

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.diary.accent} size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.diary.canvas} />

      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate("EventsPage"))}
          style={styles.topAction}
        >
          <Text style={[styles.topActionIcon, uiBoldStyle]}>
            {navigation.canGoBack() ? backGlyph : t("writing.backToStories")}
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.topTitle,
            handwritingFont ? { fontFamily: handwritingFont } : null,
            uiRegularStyle,
            locale === "he" ? styles.topTitleHe : null,
          ]}
        >
          {isEditing ? t("writing.editTitle") : t("writing.newTitle")}
        </Text>

        <TouchableOpacity
          onPress={openSaveTagsModal}
          disabled={saving}
          style={[styles.topAction, styles.saveAction, saving && styles.saveActionDisabled]}
        >
          {saving ? (
            <ActivityIndicator size="small" color={colors.diary.paper} />
          ) : (
            <Text style={styles.saveIcon}>✓</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.canvas}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.journalLayout}>
          <View style={styles.journalColumn}>
            {showSavedActions ? (
              <View style={styles.savedCard}>
                <Text
                  style={[styles.savedTitle, handwritingFont ? { fontFamily: handwritingFont } : null, uiRegularStyle]}
                >
                  {t("writing.savedBannerTitle")}
                </Text>
                <Text style={[styles.savedText, uiRegularStyle]}>
                  {t("writing.savedBannerBody", { title: savedEntryTitle })}
                </Text>
                <View style={styles.savedActions}>
                  <TouchableOpacity style={styles.writeAnotherBtn} onPress={startNewEvent}>
                    <Text style={[styles.writeAnotherText, uiBoldStyle]}>{t("writing.writeAnother")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.doneBtn} onPress={finishWriting}>
                    <Text style={[styles.doneText, uiBoldStyle]}>{t("writing.doneForNow")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            <JournalPage>
              <DiaryDateBanner dateStr={eventDate} />

              <DiaryTitleField
                value={title}
                onChangeText={setTitle}
                error={errors.title}
                errorTextStyle={uiRegularStyle}
                fontFamily={handwritingBold}
                italic={titleItalic}
                placeholder={t("diary.titlePlaceholder")}
              />

              <DiaryBodyField
                value={content}
                onChangeText={setContent}
                fontFamily={handwritingFont}
                placeholder={t("diary.bodyPlaceholder")}
              />
            </JournalPage>

            <View style={styles.bottomRow}>
              <TouchableOpacity
                style={[styles.sealBtn, saving && styles.sealBtnDisabled]}
                onPress={openSaveTagsModal}
                disabled={saving}
                activeOpacity={0.8}
              >
                <Text style={[styles.sealBtnText, handwritingFont ? { fontFamily: handwritingFont } : null]}>
                  {saving ? t("writing.sealSaving") : isEditing ? t("writing.sealEdit") : t("writing.sealNew")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <SaveTagsModal
        visible={tagModalVisible}
        tags={tags}
        initialSelectedIds={selectedTagIds}
        saving={saving}
        isEditing={isEditing}
        onClose={() => setTagModalVisible(false)}
        onSave={saveStory}
        onSkip={skipTagsAndSave}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.diary.canvas,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.diary.canvas,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: Platform.OS === "ios" ? 46 : 28,
    paddingBottom: 8,
    backgroundColor: colors.diary.canvas,
  },
  topAction: {
    minWidth: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  topTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    color: colors.diary.inkMid,
    fontStyle: "italic",
    letterSpacing: 0.3,
  },
  topTitleHe: {
    fontStyle: "normal",
    letterSpacing: 0.15,
  },
  saveAction: {
    backgroundColor: colors.diary.accent,
    borderRadius: 99,
    width: 36,
    height: 36,
  },
  saveActionDisabled: {
    opacity: 0.5,
  },
  saveIcon: {
    color: colors.diary.paper,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 36,
    textAlign: "center",
  },
  topActionIcon: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.diary.inkMid,
  },
  canvas: {
    flex: 1,
    backgroundColor: colors.diary.canvas,
  },
  scroll: {
    paddingBottom: 36,
  },
  journalLayout: {
    alignItems: "center",
  },
  journalColumn: {
    flex: 1,
    maxWidth: 620,
    width: "100%",
  },
  savedCard: {
    backgroundColor: colors.diary.paper,
    borderColor: colors.diary.accentLight,
    borderRadius: 18,
    borderWidth: 1,
    marginHorizontal: 18,
    marginTop: 8,
    marginBottom: 4,
    padding: 18,
    shadowColor: colors.diary.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  savedTitle: {
    color: colors.diary.ink,
    fontSize: 24,
    marginBottom: 4,
  },
  savedText: {
    color: colors.diary.inkMid,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  savedActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  writeAnotherBtn: {
    backgroundColor: colors.diary.accent,
    borderRadius: 99,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  writeAnotherText: {
    color: colors.diary.paper,
    fontSize: 14,
    fontWeight: "700",
  },
  doneBtn: {
    borderColor: colors.diary.divider,
    borderRadius: 99,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  doneText: {
    color: colors.diary.inkMid,
    fontSize: 14,
    fontWeight: "700",
  },
  bottomRow: {
    marginHorizontal: 28,
    marginTop: 6,
  },
  sealBtn: {
    backgroundColor: colors.diary.ink,
    borderRadius: 99,
    paddingVertical: 12,
    alignItems: "center",
  },
  sealBtnDisabled: {
    opacity: 0.5,
  },
  sealBtnText: {
    color: colors.diary.paper,
    fontSize: 17,
    letterSpacing: 0.5,
  },
});
