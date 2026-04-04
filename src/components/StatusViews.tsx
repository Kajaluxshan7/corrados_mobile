import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, fontSizes, spacing, borderRadius } from "../theme";

interface LoadingViewProps {
  message?: string;
}

export function LoadingView({ message = "Loading..." }: LoadingViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.loadingSpinnerWrapper}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorView({
  message = "Something went wrong",
  onRetry,
}: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="alert-circle-outline" size={40} color={colors.primary.main} />
      </View>
      <Text style={styles.errorTitle}>Oops!</Text>
      <Text style={styles.errorMessage}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
          <Ionicons name="refresh" size={16} color={colors.text.light} />
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

interface EmptyViewProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title?: string;
  message?: string;
}

export function EmptyView({
  icon = "documents-outline",
  title = "Nothing here yet",
  message = "Check back later for updates",
}: EmptyViewProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, styles.iconCircleEmpty]}>
        <Ionicons name={icon} size={40} color={colors.text.muted} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing["2xl"],
    backgroundColor: colors.background.default,
    gap: spacing.md,
  },
  loadingSpinnerWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary.main + "12",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.main + "12",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircleEmpty: {
    backgroundColor: colors.background.cream,
  },
  message: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.base,
    color: colors.text.secondary,
  },
  errorTitle: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes.xl,
    color: colors.text.primary,
  },
  errorMessage: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.base,
    color: colors.text.secondary,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 22,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  retryText: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.sm,
    color: colors.text.light,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  emptyTitle: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes.lg,
    color: colors.text.primary,
  },
  emptyMessage: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.base,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 260,
  },
});
