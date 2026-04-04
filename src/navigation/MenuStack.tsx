import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  MenuCategoriesScreen,
  MenuSubCategoriesScreen,
  MenuItemsScreen,
  MenuItemDetailScreen,
} from "../screens";
import type { MenuStackParamList } from "../types";
import { colors, fonts, fontSizes } from "../theme";

const Stack = createNativeStackNavigator<MenuStackParamList>();

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

export function MenuStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="MenuCategories"
        component={MenuCategoriesScreen}
        options={{ title: "Our Menu" }}
      />
      <Stack.Screen
        name="MenuSubCategories"
        component={MenuSubCategoriesScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
      <Stack.Screen
        name="MenuItems"
        component={MenuItemsScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
      <Stack.Screen
        name="MenuItemDetail"
        component={MenuItemDetailScreen}
        options={({ route }) => ({ title: route.params.item.name })}
      />
    </Stack.Navigator>
  );
}
