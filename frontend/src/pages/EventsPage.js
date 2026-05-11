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
import EventCard from "../components/events/EventCard";
import { useLocale, useTypography } from "../context/LocaleContext";
import { useEvents } from "../hooks/useEvents";
import { exportStoryAsTxt } from "../services/storyTxtExport";
import { colors } from "../styles/colors";
import { radius } from "../styles/spacing";

export default function EventsPage() {
  const navigation = useNavigation();
  const { events, loading, error, fetchAll, deleteEventById } = useEvents();
  const { locale, t } = useLocale();
  const typography = useTypography();

  const handwritingBold = typography.journalBold;
  const uiBold = typography.uiBold ? { fontFamily: typography.uiBold } : null;
  const uiRegular = typography.uiRegular ? { fontFamily: typography.uiRegular } : null;

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

  const downloadStoryTxt = async (event) => {
    try {
      await exportStoryAsTxt(event);
    } catch (e) {
      const message = e?.message || t("events.exportFailGeneric");
      if (Platform.OS === "web") {
        window.alert?.(`${t("events.exportFailTitle")}\n\n${message}`);
        return;
      }
      Alert.alert(t("events.exportFailTitle"), message);
    }
  };

  const confirmRemoveStory = (event) => {
    const rawTitle = event.title?.trim() || t("events.thisStory");
    const titlePreview = rawTitle.length > 72 ? `${rawTitle.slice(0, 69)}…` : rawTitle;
    const body = t("events.removeBody", { title: titlePreview });

    const runDelete = async () => {
      try {
        await deleteEventById(Number(event.id));
      } catch (e) {
        const message = e?.message || t("events.deleteFailGeneric");
        if (Platform.OS === "web") {
          window.alert?.(`${t("events.deleteFailTitle")}\n\n${message}`);
          return;
        }
        Alert.alert(t("events.deleteFailTitle"), message);
      }
    };

    if (Platform.OS === "web" && typeof window !== "undefined" && typeof window.confirm === "function") {
      if (window.confirm(`${t("events.removeConfirmWeb")}\n\n${body}`)) void runDelete();
      return;
    }

    Alert.alert(t("events.removeTitle"), body, [
      { text: t("events.cancel"), style: "cancel" },
      {
        text: t("events.remove"),
        style: "destructive",
        onPress: () => void runDelete(),
      },
    ]);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, handwritingBold ? { fontFamily: handwritingBold } : null]}>
        {t("events.title")}
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
          <Text style={[styles.emptyTitle, uiBold]}>{t("events.loadErrorTitle")}</Text>
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
          {t("events.emptyTitle")}
        </Text>
        <Text style={[styles.emptyText, uiRegular]}>{t("events.emptyBody")}</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={writeNewEvent}>
          <Text style={[styles.primaryButtonText, uiBold]}>{t("events.writeFirst")}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.diary.canvas} />

      <View style={styles.topBar}>
        <View style={styles.topBarCenter} />
        <TouchableOpacity
          style={styles.addButton}
          onPress={writeNewEvent}
          accessibilityRole="button"
          accessibilityLabel={t("events.addStoryA11y")}
        >
          <Text style={[styles.addButtonText, uiBold]}>{t("events.addStoryGlyph")}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => String(item.id)}
        extraData={locale}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={openEvent}
            onDownloadTxtPress={downloadStoryTxt}
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
  topBarCenter: {
    flex: 1,
  },
  addButton: {
    alignItems: "center",
    borderColor: colors.diary.divider,
    borderRadius: radius.full,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  addButtonText: {
    color: colors.diary.ink,
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 26,
    marginTop: -2,
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
  },
  emptyText: {
    color: colors.diary.inkMid,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
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
