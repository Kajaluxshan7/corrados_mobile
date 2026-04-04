import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SpecialsScreen, SpecialDetailScreen } from "../screens";
import type { SpecialsStackParamList } from "../types";
import { colors, fonts, fontSizes } from "../theme";

const Stack = createNativeStackNavigator<SpecialsStackParamList>();

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

export function SpecialsStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Specials"
        component={SpecialsScreen}
        options={{ title: "Specials" }}
      />
      <Stack.Screen
        name="SpecialDetail"
        component={SpecialDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
