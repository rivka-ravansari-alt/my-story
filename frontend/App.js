import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "./src/context/AuthContext";
import WritingPage from "./src/pages/WritingPage";
import EventsPage from "./src/pages/EventsPage";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="WritingPage" component={WritingPage} />
          <Stack.Screen name="EventsPage" component={EventsPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
