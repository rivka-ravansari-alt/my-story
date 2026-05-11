import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import AppShell from "./src/components/navigation/AppShell";
import SettingsNavigator from "./src/navigation/SettingsNavigator";
import LoginPage from "./src/pages/LoginPage";
import WritingPage from "./src/pages/WritingPage";
import EventsPage from "./src/pages/EventsPage";
import ExercisesPage from "./src/pages/ExercisesPage";
import { googleAuthConfig } from "./src/config/googleAuthConfig";
import { colors } from "./src/styles/colors";

const Stack = createNativeStackNavigator();

function withAppShell(Component) {
  return function ScreenWithAppShell(props) {
    return (
      <AppShell activeRouteName={props.route.name} navigation={props.navigation}>
        <Component {...props} />
      </AppShell>
    );
  };
}

const CalendarJournalScreen = withAppShell(WritingPage);
const WritingScreen = withAppShell(WritingPage);
const EventsScreen = withAppShell(EventsPage);
const SettingsScreen = withAppShell(SettingsNavigator);
const ExercisesScreen = withAppShell(ExercisesPage);

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.diary.accent} size="large" />
      </View>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CalendarJournalPage" screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="CalendarJournalPage"
          component={CalendarJournalScreen}
          initialParams={{ showCalendar: true }}
        />
        <Stack.Screen name="WritingPage" component={WritingScreen} />
        <Stack.Screen name="EventsPage" component={EventsScreen} />
        <Stack.Screen name="ExercisesPage" component={ExercisesScreen} />
        <Stack.Screen name="SettingsPage" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={googleAuthConfig.clientId}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    alignItems: "center",
    backgroundColor: colors.diary.canvas,
    flex: 1,
    justifyContent: "center",
  },
});
