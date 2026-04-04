import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  fonts,
  fontSizes,
  spacing,
  borderRadius,
  shadows,
} from "../theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "dark" | "light";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap | React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = "contained",
  color = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const bgColor = getBgColor(variant, color);
  const txtColor = getTextColor(variant, color);
  const borderColor =
    variant === "outlined" ? getTxtColorRaw(color) : undefined;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        sizeStyles[size],
        { backgroundColor: bgColor },
        borderColor ? { borderWidth: 1.5, borderColor } : undefined,
        fullWidth && styles.fullWidth,
        variant === "contained" && shadows.sm,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={txtColor} />
      ) : (
        <>
          {typeof icon === "string" ? (
            <Ionicons
              name={icon as keyof typeof Ionicons.glyphMap}
              size={size === "lg" ? 18 : size === "sm" ? 14 : 16}
              color={txtColor}
            />
          ) : (
            icon
          )}
          <Text
            style={[
              styles.text,
              sizeTextStyles[size],
              { color: txtColor },
              icon ? { marginLeft: spacing.sm } : undefined,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

function getTxtColorRaw(color: string): string {
  switch (color) {
    case "primary":
      return colors.primary.main;
    case "secondary":
      return colors.secondary.main;
    case "dark":
      return colors.text.primary;
    case "light":
      return colors.text.light;
    default:
      return colors.primary.main;
  }
}

function getBgColor(variant: string, color: string): string {
  if (variant === "outlined" || variant === "text") return "transparent";
  return getTxtColorRaw(color);
}

function getTextColor(variant: string, color: string): string {
  if (variant === "contained") {
    return color === "light" ? colors.text.primary : "#FFFFFF";
  }
  return getTxtColorRaw(color);
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.full,
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontFamily: fonts.body.bold,
    textTransform: "uppercase",
    letterSpacing: 1.3,
  },
});

const sizeStyles: Record<string, ViewStyle> = {
  sm: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  md: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  lg: {
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing.base,
  },
};

const sizeTextStyles: Record<string, TextStyle> = {
  sm: { fontSize: fontSizes.xs },
  md: { fontSize: fontSizes.sm },
  lg: { fontSize: fontSizes.md },
};
