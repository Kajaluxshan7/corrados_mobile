import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors, fonts, fontSizes, spacing, borderRadius } from "../theme";

interface ChipProps {
  label: string;
  variant?: "primary" | "secondary" | "gold" | "wine" | "outlined" | "navy";
  size?: "sm" | "md";
  style?: ViewStyle;
}

const variantStyles: Record<
  string,
  { bg: string; text: string; border?: string }
> = {
  primary: { bg: colors.primary.main, text: "#FFFFFF" },
  secondary: { bg: colors.secondary.main, text: "#FFFFFF" },
  gold: { bg: colors.custom.gold, text: "#FFFFFF" },
  wine: { bg: colors.custom.wine, text: "#FFFFFF" },
  navy: { bg: colors.custom.navy, text: "#FFFFFF" },
  outlined: {
    bg: "transparent",
    text: colors.text.primary,
    border: colors.border.main,
  },
};

export function Chip({
  label,
  variant = "primary",
  size = "sm",
  style,
}: ChipProps) {
  const v = variantStyles[variant];

  return (
    <View
      style={[
        styles.chip,
        size === "md" && styles.chipMd,
        { backgroundColor: v.bg },
        v.border ? { borderWidth: 1, borderColor: v.border } : undefined,
        style,
      ]}
    >
      <Text
        style={[
          styles.chipText,
          size === "md" && styles.chipTextMd,
          { color: v.text },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 1,
    borderRadius: borderRadius.full,
    alignSelf: "flex-start",
  },
  chipMd: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
  },
  chipText: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.xs,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  chipTextMd: {
    fontSize: fontSizes.sm,
  },
});
