import React, { useCallback, useMemo, useState } from "react";
import { Platform, ScrollView, StatusBar, StyleSheet, View, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CalendarSidePanel from "../components/diary/CalendarSidePanel";
import DateCreateActionModal from "../components/diary/DateCreateActionModal";
import { useLocale, useTypography } from "../context/LocaleContext";
import { colors } from "../styles/colors";

function getLocalDateKey(dateValue = new Date()) {
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, "0");
  const day = String(dateValue.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateLabel(dateKey, locale) {
  const loc = locale === "he" ? "he-IL" : "en-US";
  const d = new Date(`${dateKey}T12:00:00`);
  return d.toLocaleDateString(loc, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function CalendarJournalPage() {
  const navigation = useNavigation();
  const { locale } = useLocale();
  const typography = useTypography();
  const { width } = useWindowDimensions();

  const todayKey = useMemo(() => getLocalDateKey(), []);
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [actionDateKey, setActionDateKey] = useState(todayKey);

  const handwritingBold = typography.journalBold;

  const calendarMaxWidth = Math.min(420, width - 36);

  const onDayPress = useCallback((dateKey) => {
    setSelectedDate(dateKey);
    setActionDateKey(dateKey);
    setPickerOpen(true);
  }, []);

  const closePicker = useCallback(() => {
    setPickerOpen(false);
  }, []);

  const goToStory = useCallback(() => {
    setPickerOpen(false);
    navigation.navigate("WritingPage", { date: actionDateKey });
  }, [navigation, actionDateKey]);

  const goToExercise = useCallback(() => {
    setPickerOpen(false);
    navigation.navigate("ExercisesPage", { presetExerciseDate: actionDateKey });
  }, [navigation, actionDateKey]);

  const formattedActionDate = formatDateLabel(actionDateKey, locale);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.diary.canvas} />

      <View style={styles.topBar}>
        <View style={styles.topBarFill} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.calendarWrap, { maxWidth: calendarMaxWidth }]}>
          <CalendarSidePanel
            variant="journal"
            selectedDate={selectedDate}
            onSelectDate={onDayPress}
            titleFontFamily={handwritingBold}
          />
        </View>
      </ScrollView>

      <DateCreateActionModal
        visible={pickerOpen}
        formattedDateLabel={formattedActionDate}
        onClose={closePicker}
        onChooseStory={goToStory}
        onChooseExercise={goToExercise}
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
  topBarFill: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 40,
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  calendarWrap: {
    width: "100%",
  },
});
