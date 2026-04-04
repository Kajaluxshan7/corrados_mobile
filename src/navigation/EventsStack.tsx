import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { EventsScreen, EventDetailScreen } from "../screens";
import type { EventsStackParamList } from "../types";
import { colors, fonts, fontSizes } from "../theme";

const Stack = createNativeStackNavigator<EventsStackParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: colors.background.paper },
  headerTintColor: colors.text.primary,
  headerTitleStyle: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes.lg,
  },
  headerBackTitleVisible: false,
  headerShadowVisible: false,
};

export function EventsStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Events"
        component={EventsScreen}
        options={{ title: "Events" }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
