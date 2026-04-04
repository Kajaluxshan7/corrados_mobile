import React from "react";
import { Platform, View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { HomeStack } from "./HomeStack";
import { MenuStack } from "./MenuStack";
import { SpecialsStack } from "./SpecialsStack";
import { EventsStack } from "./EventsStack";
import { MoreStack } from "./MoreStack";
import type { RootTabParamList } from "../types";
import { colors, fonts, fontSizes, shadows } from "../theme";

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_ICONS: Record<
  keyof RootTabParamList,
  { focused: keyof typeof Ionicons.glyphMap; unfocused: keyof typeof Ionicons.glyphMap }
> = {
  HomeTab: { focused: "home", unfocused: "home-outline" },
  MenuTab: { focused: "restaurant", unfocused: "restaurant-outline" },
  SpecialsTab: { focused: "pricetag", unfocused: "pricetag-outline" },
  EventsTab: { focused: "calendar", unfocused: "calendar-outline" },
  MoreTab: { focused: "grid", unfocused: "grid-outline" },
};

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.focused : icons.unfocused;
          return (
            <View style={styles.iconWrapper}>
              {focused && <View style={styles.activeIndicator} />}
              <Ionicons name={iconName} size={focused ? size + 1 : size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarLabelStyle: {
          fontFamily: fonts.body.bold,
          fontSize: fontSizes.xs,
          marginBottom: Platform.OS === "ios" ? 0 : 4,
        },
        tabBarStyle: {
          backgroundColor: colors.background.paper,
          borderTopColor: colors.border.light,
          borderTopWidth: StyleSheet.hairlineWidth,
          paddingTop: 6,
          height: Platform.OS === "ios" ? 90 : 66,
          ...shadows.md,
        },
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ tabBarLabel: "Home" }} />
      <Tab.Screen name="MenuTab" component={MenuStack} options={{ tabBarLabel: "Menu" }} />
      <Tab.Screen name="SpecialsTab" component={SpecialsStack} options={{ tabBarLabel: "Specials" }} />
      <Tab.Screen name="EventsTab" component={EventsStack} options={{ tabBarLabel: "Events" }} />
      <Tab.Screen name="MoreTab" component={MoreStack} options={{ tabBarLabel: "More" }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 2,
  },
  activeIndicator: {
    position: "absolute",
    top: -10,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary.main,
  },
});
