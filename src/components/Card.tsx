import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  fonts,
  fontSizes,
  spacing,
  borderRadius,
  shadows,
} from "../theme";
import { getImageUrl } from "../services/api";

interface ImageCardProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  onPress: () => void;
  height?: number;
  overlay?: boolean;
  chips?: React.ReactNode;
  footer?: React.ReactNode;
  style?: ViewStyle;
}

export function ImageCard({
  title,
  subtitle,
  imageUrl,
  onPress,
  height = 200,
  overlay = true,
  chips,
  footer,
  style,
}: ImageCardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, shadows.md, { height }, style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {imageUrl ? (
        <Image
          source={{ uri: getImageUrl(imageUrl) }}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          transition={300}
          placeholder={require("../assets/placeholder.png")}
        />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, styles.placeholderBg]}>
          <Ionicons name="image-outline" size={40} color={colors.text.muted} />
        </View>
      )}
      {overlay && (
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <View style={styles.content}>
        {chips && <View style={styles.chipRow}>{chips}</View>}
        <View style={styles.bottomContent}>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {footer}
        </View>
      </View>
    </TouchableOpacity>
  );
}

interface ListCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  onPress: () => void;
  rightContent?: React.ReactNode;
  chips?: React.ReactNode;
  style?: ViewStyle;
}

export function ListCard({
  title,
  subtitle,
  description,
  imageUrl,
  onPress,
  rightContent,
  chips,
  style,
}: ListCardProps) {
  return (
    <TouchableOpacity
      style={[styles.listContainer, shadows.sm, style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {imageUrl && (
        <Image
          source={{ uri: getImageUrl(imageUrl) }}
          style={styles.listImage}
          contentFit="cover"
          transition={300}
          placeholder={require("../assets/placeholder.png")}
        />
      )}
      <View style={[styles.listContent, !imageUrl && styles.listContentFull]}>
        {chips && <View style={styles.chipRow}>{chips}</View>}
        {subtitle && <Text style={styles.listSubtitle}>{subtitle}</Text>}
        <Text style={styles.listTitle} numberOfLines={2}>
          {title}
        </Text>
        {description && (
          <Text style={styles.listDescription} numberOfLines={2}>
            {description}
          </Text>
        )}
      </View>
      {rightContent && <View style={styles.rightContent}>{rightContent}</View>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    backgroundColor: colors.background.paper,
  },
  placeholderBg: {
    backgroundColor: colors.background.cream,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: spacing.base,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  bottomContent: {
    marginTop: "auto",
  },
  subtitle: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.xs,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.custom.gold,
    marginBottom: 2,
  },
  title: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes.lg,
    color: colors.text.light,
    lineHeight: 24,
  },
  // List card styles
  listContainer: {
    flexDirection: "row",
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    backgroundColor: colors.background.paper,
  },
  listImage: {
    width: 100,
    height: "100%",
    minHeight: 100,
  },
  listContent: {
    flex: 1,
    padding: spacing.md,
    justifyContent: "center",
  },
  listContentFull: {
    paddingLeft: spacing.base,
  },
  listSubtitle: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.xs,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.custom.gold,
    marginBottom: 2,
  },
  listTitle: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes.base,
    color: colors.text.primary,
    lineHeight: 22,
  },
  listDescription: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  rightContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: spacing.base,
  },
});
