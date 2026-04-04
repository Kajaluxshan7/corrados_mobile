import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors, fonts, fontSizes, spacing, letterSpacing } from "../theme";

interface SectionHeaderProps {
  subtitle?: string;
  title: string;
  description?: string;
  light?: boolean;
  align?: "center" | "left";
  style?: ViewStyle;
}

export function SectionHeader({
  subtitle,
  title,
  description,
  light = false,
  align = "center",
  style,
}: SectionHeaderProps) {
  return (
    <View
      style={[styles.container, align === "left" && styles.alignLeft, style]}
    >
      {subtitle && (
        <View style={[styles.subtitleRow, align === "left" && styles.subtitleRowLeft]}>
          <View style={styles.accentLine} />
          <Text
            style={[
              styles.subtitle,
              light ? styles.subtitleLight : styles.subtitleDark,
            ]}
          >
            {subtitle}
          </Text>
          <View style={styles.accentLine} />
        </View>
      )}
      <Text
        style={[
          styles.title,
          light ? styles.titleLight : styles.titleDark,
          align === "left" && styles.textLeft,
        ]}
      >
        {title}
      </Text>
      {description && (
        <Text
          style={[
            styles.description,
            light ? styles.descriptionLight : styles.descriptionDark,
            align === "left" && styles.textLeft,
          ]}
        >
          {description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.base,
  },
  alignLeft: {
    alignItems: "flex-start",
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  subtitleRowLeft: {
    alignSelf: "flex-start",
  },
  accentLine: {
    height: 1,
    width: 24,
    backgroundColor: colors.custom.gold,
    opacity: 0.7,
  },
  subtitle: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.xs,
    letterSpacing: letterSpacing.widest,
    textTransform: "uppercase",
  },
  subtitleDark: {
    color: colors.custom.gold,
  },
  subtitleLight: {
    color: colors.custom.gold,
  },
  title: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes["3xl"],
    lineHeight: 38,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  titleDark: {
    color: colors.text.primary,
  },
  titleLight: {
    color: colors.text.light,
  },
  description: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.md,
    lineHeight: 23,
    maxWidth: 340,
    textAlign: "center",
  },
  descriptionDark: {
    color: colors.text.secondary,
  },
  descriptionLight: {
    color: "rgba(255,255,255,0.75)",
  },
  textLeft: {
    textAlign: "left",
  },
});
