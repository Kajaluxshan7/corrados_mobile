import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
} from "@expo-google-fonts/playfair-display";
import {
  Lato_300Light,
  Lato_400Regular,
  Lato_700Bold,
} from "@expo-google-fonts/lato";
import { TabNavigator } from "./src/navigation";
import { colors } from "./src/theme";

// Suppress common non-critical warnings
LogBox.ignoreLogs(["Sending `onAnimatedValueUpdate`"]);

// Keep splash visible while fonts and assets load
SplashScreen.preventAutoHideAsync();

const PRELOAD_ASSETS = [
  require("./src/assets/logo-white-on-blue.png"),
  require("./src/assets/logo-blue.png"),
  require("./src/assets/logo-white-on-black.png"),
];

export default function App() {
  const [assetsReady, setAssetsReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    "PlayfairDisplay-Regular": PlayfairDisplay_400Regular,
    "PlayfairDisplay-Bold": PlayfairDisplay_700Bold,
    "Lato-Light": Lato_300Light,
    "Lato-Regular": Lato_400Regular,
    "Lato-Bold": Lato_700Bold,
  });

  useEffect(() => {
    Asset.loadAsync(PRELOAD_ASSETS)
      .catch(() => {
        // Non-critical: proceed even if preload fails
      })
      .finally(() => setAssetsReady(true));
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if ((fontsLoaded || fontError) && assetsReady) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, assetsReady]);

  if ((!fontsLoaded && !fontError) || !assetsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <StatusBar style="dark" />
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
});
