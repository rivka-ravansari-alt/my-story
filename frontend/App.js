import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "./src/context/AuthContext";
import AppShell from "./src/components/navigation/AppShell";
import WritingPage from "./src/pages/WritingPage";
import EventsPage from "./src/pages/EventsPage";
import TagsPage from "./src/pages/TagsPage";

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
const TagsScreen = withAppShell(TagsPage);

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="CalendarJournalPage" screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="CalendarJournalPage"
            component={CalendarJournalScreen}
            initialParams={{ showCalendar: true }}
          />
          <Stack.Screen name="WritingPage" component={WritingScreen} />
          <Stack.Screen name="EventsPage" component={EventsScreen} />
          <Stack.Screen name="TagsPage" component={TagsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
