import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsHomePage from "../pages/SettingsHomePage";
import TagsPage from "../pages/TagsPage";
import ExerciseTemplatesPage from "../pages/ExerciseTemplatesPage";

const Stack = createNativeStackNavigator();

export default function SettingsNavigator() {
  return (
    <Stack.Navigator initialRouteName="SettingsHome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsHome" component={SettingsHomePage} />
      <Stack.Screen name="TagsPage" component={TagsPage} />
      <Stack.Screen name="ExerciseTemplatesPage" component={ExerciseTemplatesPage} />
    </Stack.Navigator>
  );
}
