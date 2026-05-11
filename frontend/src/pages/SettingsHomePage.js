import React from "react";
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts, Caveat_700Bold } from "@expo-google-fonts/caveat";
import { colors } from "../styles/colors";
import { radius } from "../styles/spacing";

export default function SettingsHomePage() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({ Caveat_700Bold });
  const handwritingBold = fontsLoaded ? "Caveat_700Bold" : undefined;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.diary.canvas} />

      <View style={styles.header}>
        <Text style={[styles.title, handwritingBold ? { fontFamily: handwritingBold } : null]}>
          Settings
        </Text>
        <Text style={styles.subtitle}>Configure tags and exercise templates for your journal.</Text>
      </View>

      <View style={styles.list}>
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.84}
          onPress={() => navigation.navigate("TagsPage")}
          style={styles.row}
        >
          <View style={styles.rowTextWrap}>
            <Text style={styles.rowTitle}>Tags</Text>
            <Text style={styles.rowHint}>Organize stories with labels like Family, Travel, or School</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.84}
          onPress={() => navigation.navigate("ExerciseTemplatesPage")}
          style={styles.row}
        >
          <View style={styles.rowTextWrap}>
            <Text style={styles.rowTitle}>Exercise templates</Text>
            <Text style={styles.rowHint}>Reusable question sets for practices and check-ins</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.diary.canvas,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 46 : 28,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 20,
    paddingTop: 6,
  },
  title: {
    color: colors.diary.ink,
    fontSize: 32,
    lineHeight: 38,
    textAlign: "left",
    writingDirection: "ltr",
  },
  subtitle: {
    color: colors.diary.inkMid,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
    writingDirection: "ltr",
  },
  list: {
    gap: 12,
  },
  row: {
    alignItems: "center",
    backgroundColor: colors.diary.paper,
    borderColor: colors.diary.accentLight,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: colors.diary.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  rowTextWrap: {
    flex: 1,
  },
  rowTitle: {
    color: colors.diary.ink,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
    textAlign: "left",
    writingDirection: "ltr",
  },
  rowHint: {
    color: colors.diary.inkMid,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "left",
    writingDirection: "ltr",
  },
  chevron: {
    color: colors.diary.inkLight,
    fontSize: 22,
    fontWeight: "300",
  },
});
