import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  colors,
  fonts,
  fontSizes,
  spacing,
  borderRadius,
  shadows,
} from "../theme";
import { config } from "../config";
import type { MoreStackParamList } from "../types";

type Props = NativeStackScreenProps<MoreStackParamList, "MoreMenu">;

interface MenuItem {
  title: string;
  icon: string;
  screen?: keyof MoreStackParamList;
  url?: string;
  gradient: [string, string];
  description: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    title: "About Us",
    icon: "heart",
    screen: "About",
    gradient: [colors.primary.main, colors.custom.wine],
    description: "Our story & values",
  },
  {
    title: "Contact",
    icon: "call",
    screen: "Contact",
    gradient: [colors.custom.navy, "#3B5998"],
    description: "Get in touch",
  },
  {
    title: "Party Menus",
    icon: "people",
    screen: "PartyMenus",
    gradient: [colors.custom.gold, "#B8860B"],
    description: "Catering & groups",
  },
  {
    title: "Stories",
    icon: "images",
    screen: "Stories",
    gradient: [colors.custom.wine, colors.primary.main],
    description: "Behind the scenes",
  },
  {
    title: "Opening Hours",
    icon: "time",
    screen: "OpeningHours",
    gradient: [colors.secondary.main, "#1B3D20"],
    description: "When to visit",
  },
  {
    title: "Newsletter",
    icon: "mail",
    screen: "Newsletter",
    gradient: ["#6366F1", "#8B5CF6"],
    description: "Stay updated",
  },
  {
    title: "Order Online",
    icon: "bag-handle",
    url: config.business.orderUrl,
    gradient: [colors.primary.main, "#D4736E"],
    description: "Takeout & delivery",
  },
  {
    title: "Gift Cards",
    icon: "gift",
    url: config.business.giftCardsUrl,
    gradient: [colors.custom.gold, colors.custom.wine],
    description: "Give the gift of flavor",
  },
];

export function MoreScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const handlePress = (item: MenuItem) => {
    if (item.url) {
      Linking.openURL(item.url);
    } else if (item.screen) {
      navigation.navigate(item.screen as any);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + spacing["3xl"] },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.subtitle}>EXPLORE</Text>
        <Text style={styles.title}>More from Corrado's</Text>
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, shadows.md]}
            onPress={() => handlePress(item)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={item.gradient}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardIconBg}>
                <Ionicons name={item.icon as any} size={24} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>

              {item.url && (
                <View style={styles.externalBadge}>
                  <Ionicons
                    name="open-outline"
                    size={12}
                    color="rgba(255,255,255,0.7)"
                  />
                </View>
              )}

              {/* Decorative circle */}
              <View style={styles.decorCircle} />
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick contacts */}
      <View style={[styles.quickSection, shadows.sm]}>
        <Text style={styles.quickTitle}>Quick Contact</Text>
        <TouchableOpacity
          style={styles.quickRow}
          onPress={() =>
            Linking.openURL(
              `tel:${config.business.phone.replace(/[^0-9+]/g, "")}`,
            )
          }
        >
          <Ionicons name="call-outline" size={18} color={colors.primary.main} />
          <Text style={styles.quickText}>{config.business.phone}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickRow}
          onPress={() => Linking.openURL(`mailto:${config.business.email}`)}
        >
          <Ionicons name="mail-outline" size={18} color={colors.primary.main} />
          <Text style={styles.quickText}>{config.business.email}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  content: {
    padding: spacing.base,
    paddingTop: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  subtitle: {
    fontFamily: fonts.body.familyBold,
    fontSize: fontSizes.xs,
    color: colors.custom.gold,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes["2xl"],
    color: colors.text.primary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  card: {
    width: "47.5%",
    borderRadius: borderRadius.xl,
    overflow: "hidden",
  },
  cardGradient: {
    padding: spacing.base,
    minHeight: 140,
    justifyContent: "flex-end",
    position: "relative",
    overflow: "hidden",
  },
  cardIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontFamily: fonts.body.familyBold,
    fontSize: fontSizes.base,
    color: "#fff",
    marginBottom: 2,
  },
  cardDescription: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.xs,
    color: "rgba(255,255,255,0.75)",
  },
  externalBadge: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
  },
  decorCircle: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  quickSection: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  quickTitle: {
    fontFamily: fonts.body.familyBold,
    fontSize: fontSizes.base,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  quickRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  quickText: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.base,
    color: colors.text.secondary,
  },
});
