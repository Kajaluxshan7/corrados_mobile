import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts, fontSizes, spacing } from "../theme";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  height?: number;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function PageHero({
  title,
  subtitle,
  backgroundImage,
  height = 220,
  children,
  style,
}: PageHeroProps) {
  const insets = useSafeAreaInsets();

  const content = (
    <View style={[styles.content, { paddingTop: insets.top + spacing.xl }]}>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );

  if (backgroundImage) {
    return (
      <ImageBackground
        source={{ uri: backgroundImage }}
        style={[styles.container, { height }, style]}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(45,41,38,0.6)", "rgba(45,41,38,0.85)"]}
          style={StyleSheet.absoluteFillObject}
        />
        {content}
      </ImageBackground>
    );
  }

  return (
    <LinearGradient
      colors={[colors.custom.navy, colors.custom.charcoal]}
      style={[styles.container, { height }, style]}
    >
      {content}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "flex-end",
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xl,
  },
  subtitle: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.xs,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.custom.gold,
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes["4xl"],
    color: colors.text.light,
    lineHeight: 40,
  },
});
