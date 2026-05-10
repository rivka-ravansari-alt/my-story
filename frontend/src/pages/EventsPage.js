import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useFonts, Caveat_400Regular, Caveat_700Bold } from "@expo-google-fonts/caveat";
import EventCard from "../components/events/EventCard";
import { useEvents } from "../hooks/useEvents";
import { colors } from "../styles/colors";
import { radius } from "../styles/spacing";

export default function EventsPage() {
  const navigation = useNavigation();
  const { events, loading, error, fetchAll, deleteEventById } = useEvents();
  const [fontsLoaded] = useFonts({ Caveat_400Regular, Caveat_700Bold });

  const handwritingFont = fontsLoaded ? "Caveat_400Regular" : undefined;
  const handwritingBold = fontsLoaded ? "Caveat_700Bold" : undefined;

  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, [fetchAll])
  );

  const openEvent = (event) => {
    navigation.navigate("WritingPage", { eventId: event.id });
  };

  const writeNewEvent = () => {
    navigation.navigate("WritingPage");
  };

  const openCalendarJournal = () => {
    navigation.navigate("CalendarJournalPage");
  };

  const confirmRemoveStory = (event) => {
    const rawTitle = event.title?.trim() || "this story";
    const titlePreview = rawTitle.length > 72 ? `${rawTitle.slice(0, 69)}…` : rawTitle;
    const body = `"${titlePreview}" will be permanently deleted from your journal. This cannot be undone.`;

    const runDelete = async () => {
      try {
        await deleteEventById(Number(event.id));
        // No success dialog—the list refreshes and the card disappears as feedback.
      } catch (e) {
        const message =
          e?.message || "Something went wrong while deleting your story. Please try again.";
        if (Platform.OS === "web") {
          window.alert?.(`Could not delete\n\n${message}`);
          return;
        }
        Alert.alert("Could not delete", message);
      }
    };

    // react-native-web often does not run Android-style Alert button callbacks reliably.
    if (Platform.OS === "web" && typeof window !== "undefined" && typeof window.confirm === "function") {
      if (window.confirm(`Remove story?\n\n${body}`)) void runDelete();
      return;
    }

    Alert.alert("Remove story?", body, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => void runDelete(),
      },
    ]);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, handwritingBold ? { fontFamily: handwritingBold } : null]}>
        My Stories
      </Text>
    </View>
  );

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
          <Text style={styles.emptyTitle}>Could not load stories</Text>
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={fetchAll}>
            <Text style={styles.secondaryButtonText}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyCard}>
        <Text style={[styles.emptyTitle, handwritingBold ? { fontFamily: handwritingBold } : null]}>
          No saved stories yet
        </Text>
        <Text style={styles.emptyText}>
          After you save a journal event, it will appear here as a card for reading or editing.
        </Text>
        <TouchableOpacity style={styles.primaryButton} onPress={writeNewEvent}>
          <Text style={styles.primaryButtonText}>Write your first story</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={openCalendarJournal}>
          <Text style={styles.secondaryButtonText}>Choose a date instead</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.diary.canvas} />

      <View style={styles.topBar}>
        <View style={styles.topTitle} />
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={openEvent}
            onDeletePress={confirmRemoveStory}
            titleFontFamily={handwritingBold}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading && events.length > 0}
            onRefresh={fetchAll}
            tintColor={colors.diary.accent}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.diary.canvas,
  },
  topBar: {
    alignItems: "center",
    backgroundColor: colors.diary.canvas,
    flexDirection: "row",
    paddingBottom: 8,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 46 : 28,
  },
  topTitle: {
    alignItems: "center",
    flex: 1,
  },
  listContent: {
    paddingBottom: 36,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 14,
    paddingTop: 6,
  },
  title: {
    color: colors.diary.ink,
    fontSize: 32,
    lineHeight: 38,
    textAlign: "left",
    writingDirection: "ltr",
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
    shadowColor: colors.diary.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  emptyTitle: {
    color: colors.diary.ink,
    fontSize: 22,
    marginBottom: 8,
    textAlign: "left",
    writingDirection: "ltr",
  },
  emptyText: {
    color: colors.diary.inkMid,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
    textAlign: "left",
    writingDirection: "ltr",
  },
  primaryButton: {
    backgroundColor: colors.diary.ink,
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  primaryButtonText: {
    color: colors.diary.paper,
    fontSize: 13,
    fontWeight: "700",
  },
  secondaryButton: {
    borderColor: colors.diary.divider,
    borderRadius: radius.full,
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  secondaryButtonText: {
    color: colors.diary.inkMid,
    fontSize: 13,
    fontWeight: "700",
  },
});
