import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  MoreScreen,
  AboutScreen,
  ContactScreen,
  PartyMenusScreen,
  PartyMenuDetailScreen,
  StoriesScreen,
  StoryViewerScreen,
  OpeningHoursScreen,
  NewsletterScreen,
} from "../screens";
import type { MoreStackParamList } from "../types";
import { colors, fonts, fontSizes } from "../theme";

const Stack = createNativeStackNavigator<MoreStackParamList>();

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

export function MoreStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="MoreMenu"
        component={MoreScreen}
        options={{ title: "More" }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Contact"
        component={ContactScreen}
        options={{ title: "Contact" }}
      />
      <Stack.Screen
        name="PartyMenus"
        component={PartyMenusScreen}
        options={{ title: "Party Menus" }}
      />
      <Stack.Screen
        name="PartyMenuDetail"
        component={PartyMenuDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Stories"
        component={StoriesScreen}
        options={{ title: "Stories" }}
      />
      <Stack.Screen
        name="StoryViewer"
        component={StoryViewerScreen}
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="OpeningHours"
        component={OpeningHoursScreen}
        options={{ title: "Opening Hours" }}
      />
      <Stack.Screen
        name="Newsletter"
        component={NewsletterScreen}
        options={{ title: "Newsletter" }}
      />
    </Stack.Navigator>
  );
}
