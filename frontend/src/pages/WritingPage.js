import React, { useState, useEffect, useCallback } from "react";
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
  useWindowDimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFonts, Caveat_400Regular, Caveat_700Bold } from "@expo-google-fonts/caveat";
import { useEvents } from "../hooks/useEvents";
import { useTags } from "../hooks/useTags";
import { eventService } from "../services/eventService";
import JournalPage from "../components/diary/JournalPage";
import DiaryDateBanner from "../components/diary/DiaryDateBanner";
import DiaryTitleField from "../components/diary/DiaryTitleField";
import DiaryBodyField from "../components/diary/DiaryBodyField";
import DiaryTagRow from "../components/diary/DiaryTagRow";
import CalendarSidePanel from "../components/diary/CalendarSidePanel";
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
  const { eventId, date, showCalendar } = route.params || {};
  const { width } = useWindowDimensions();

  const [fontsLoaded] = useFonts({ Caveat_400Regular, Caveat_700Bold });

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

  const isEditing = Boolean(eventId);
  const showCalendarPanel = Boolean(showCalendar) && !isEditing;
  const isWideLayout = width >= 860;

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
      Alert.alert("Error", "Could not load story: " + e.message);
    } finally {
      setLoading(false);
    }
  }, [eventId, initialDate]);

  useEffect(() => {
    fetchTags();
    loadEvent();
  }, [fetchTags, loadEvent]);

  useEffect(() => {
    if (isEditing) return;
    setEventDate(initialDate);
    setTitle("");
    setContent("");
    setSelectedTagIds([]);
    setErrors({});
    setShowSavedActions(false);
  }, [initialDate, isEditing]);

  const toggleTag = (id) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = "Your story needs a title";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        content,
        event_date: eventDate,
        tag_ids: selectedTagIds,
      };
      if (isEditing) {
        await updateEvent(eventId, payload);
        navigation.goBack();
      } else {
        await createEvent(payload);
        setSavedEntryTitle(payload.title);
        setTitle("");
        setContent("");
        setSelectedTagIds([]);
        setErrors({});
        setShowSavedActions(true);
      }
    } catch (e) {
      console.error("Failed to save event", e.details || e);
      Alert.alert(
        "Could not save story",
        "Please check that the server is running and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const startNewEvent = () => {
    setTitle("");
    setContent("");
    setSelectedTagIds([]);
    setErrors({});
    setShowSavedActions(false);
  };

  const selectCalendarDate = (dateKey) => {
    setEventDate(dateKey);
    setShowSavedActions(false);
  };

  const finishWriting = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      setShowSavedActions(false);
    }
  };

  const handwritingFont = fontsLoaded ? "Caveat_400Regular" : undefined;
  const handwritingBold = fontsLoaded ? "Caveat_700Bold" : undefined;

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

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate("EventsPage"))}
          style={styles.topAction}
        >
          <Text style={styles.topActionIcon}>{navigation.canGoBack() ? "←" : "Stories"}</Text>
        </TouchableOpacity>

        <Text style={[styles.topTitle, handwritingFont ? { fontFamily: handwritingFont } : null]}>
          {isEditing ? "Edit memory" : showCalendarPanel ? "Calendar journal" : "New entry"}
        </Text>

        <TouchableOpacity
          onPress={handleSave}
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
        <View style={[styles.journalLayout, showCalendarPanel && isWideLayout && styles.journalLayoutWide]}>
          {showCalendarPanel ? (
            <View style={[styles.calendarPanelWrap, !isWideLayout && styles.calendarPanelWrapNarrow]}>
              <CalendarSidePanel
                selectedDate={eventDate}
                onSelectDate={selectCalendarDate}
                titleFontFamily={handwritingBold}
              />
            </View>
          ) : null}

          <View style={styles.journalColumn}>
            {showSavedActions ? (
              <View style={styles.savedCard}>
                <Text style={[styles.savedTitle, handwritingFont ? { fontFamily: handwritingFont } : null]}>
                  Saved to your journal
                </Text>
                <Text style={styles.savedText}>
                  "{savedEntryTitle}" is saved. You can write another event for this same day.
                </Text>
                <View style={styles.savedActions}>
                  <TouchableOpacity style={styles.writeAnotherBtn} onPress={startNewEvent}>
                    <Text style={styles.writeAnotherText}>Write another event</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.doneBtn} onPress={finishWriting}>
                    <Text style={styles.doneText}>Done for now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            {/* The physical journal page */}
            <JournalPage>
              <DiaryDateBanner dateStr={eventDate} />

              <DiaryTitleField
                value={title}
                onChangeText={setTitle}
                error={errors.title}
                fontFamily={handwritingBold}
              />

              <DiaryBodyField
                value={content}
                onChangeText={setContent}
                fontFamily={handwritingFont}
              />

              <DiaryTagRow
                tags={tags}
                selectedIds={selectedTagIds}
                onToggle={toggleTag}
              />
            </JournalPage>

            {/* Bottom save prompt */}
            <View style={styles.bottomRow}>
              <TouchableOpacity
                style={[styles.sealBtn, saving && styles.sealBtnDisabled]}
                onPress={handleSave}
                disabled={saving}
                activeOpacity={0.8}
              >
                <Text style={[styles.sealBtnText, handwritingFont ? { fontFamily: handwritingFont } : null]}>
                  {saving ? "Saving…" : isEditing ? "Save changes" : "Seal this memory"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 52 : 36,
    paddingBottom: 12,
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
    fontSize: 20,
    color: colors.diary.inkMid,
    fontStyle: "italic",
    letterSpacing: 0.3,
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
    paddingBottom: 48,
  },
  journalLayout: {
    alignItems: "center",
  },
  journalLayoutWide: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  calendarPanelWrap: {
    alignItems: "center",
    paddingTop: 8,
  },
  calendarPanelWrapNarrow: {
    marginBottom: 16,
  },
  journalColumn: {
    flex: 1,
    maxWidth: 760,
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
    marginHorizontal: 32,
    marginTop: 8,
  },
  sealBtn: {
    backgroundColor: colors.diary.ink,
    borderRadius: 99,
    paddingVertical: 14,
    alignItems: "center",
  },
  sealBtnDisabled: {
    opacity: 0.5,
  },
  sealBtnText: {
    color: colors.diary.paper,
    fontSize: 18,
    letterSpacing: 0.5,
  },
});
