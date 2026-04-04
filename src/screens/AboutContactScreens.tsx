import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
  Platform,
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
import { SectionHeader, Button } from "../components";
import { config } from "../config";

export function AboutScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <LinearGradient
        colors={[colors.custom.navy, colors.custom.charcoal]}
        style={styles.hero}
      >
        <Image
          source={require("../assets/logo-white-on-blue.png")}
          style={styles.heroLogo}
          contentFit="contain"
        />
        <Text style={styles.heroTitle}>Our Story</Text>
        <Text style={styles.heroBadge}>EST. 2010 • WHITBY, ON</Text>
      </LinearGradient>

      {/* Story section */}
      <View style={styles.section}>
        <SectionHeader
          subtitle="WHO WE ARE"
          title="A Taste of Italy in Whitby"
        />
        <Text style={styles.bodyText}>
          Welcome to Corrado's Restaurant and Bar — a family-owned Italian
          restaurant nestled in the heart of downtown Whitby. Since 2010, we've
          been serving authentic Italian cuisine made with love, fresh
          ingredients, and recipes passed down through generations.
        </Text>
        <Text style={styles.bodyText}>
          Whether you're joining us for a cozy dinner, a lively night out with
          friends, or a special celebration, our warm atmosphere and genuine
          hospitality will make you feel right at home. From our hand-crafted
          pasta to our wood-fired pizzas, every dish tells a story of Italian
          tradition.
        </Text>
      </View>

      {/* Features */}
      <View style={styles.featuresSection}>
        <SectionHeader subtitle="WHY CHOOSE US" title="What Makes Us Special" />
        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <View key={feature.title} style={[styles.featureCard, shadows.sm]}>
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: feature.color + "15" },
                ]}
              >
                <Ionicons name={feature.icon} size={24} color={feature.color} />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA */}
      <View style={styles.ctaSection}>
        <LinearGradient
          colors={[colors.primary.main, colors.primary.dark]}
          style={styles.ctaGradient}
        >
          <Text style={styles.ctaTitle}>Ready to Dine?</Text>
          <Text style={styles.ctaDesc}>
            Make a reservation or order online for pickup and delivery.
          </Text>
          <View style={styles.ctaButtons}>
            <Button
              title="Order Online"
              variant="contained"
              color="light"
              icon={
                <Ionicons
                  name="bag-handle"
                  size={16}
                  color={colors.text.primary}
                />
              }
              onPress={() => Linking.openURL(config.business.orderUrl)}
            />
            <Button
              title="Call Us"
              variant="outlined"
              color="light"
              icon={
                <Ionicons name="call" size={16} color={colors.text.light} />
              }
              onPress={() =>
                Linking.openURL(
                  `tel:${config.business.phone.replace(/[^0-9+]/g, "")}`,
                )
              }
            />
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}

const features = [
  {
    icon: "restaurant" as const,
    title: "Fresh Ingredients",
    description: "Locally sourced produce and imported Italian specialties",
    color: colors.primary.main,
  },
  {
    icon: "wifi" as const,
    title: "Free WiFi",
    description: "Stay connected while you dine",
    color: colors.custom.navy,
  },
  {
    icon: "car" as const,
    title: "Free Parking",
    description: "Convenient parking available",
    color: colors.secondary.main,
  },
  {
    icon: "accessibility" as const,
    title: "Accessible",
    description: "Wheelchair accessible dining",
    color: colors.custom.gold,
  },
  {
    icon: "people" as const,
    title: "Group Dining",
    description: "Perfect for large parties and events",
    color: colors.custom.wine,
  },
  {
    icon: "wine" as const,
    title: "Full Bar",
    description: "Extensive wine, beer, and cocktail menu",
    color: colors.custom.sage,
  },
];

// ──────────────────────────────────────────────
// Contact Screen
// ──────────────────────────────────────────────

export function ContactScreen() {
  const openMap = () => {
    const address = encodeURIComponent(config.business.address);
    const url = Platform.select({
      ios: `maps:0,0?q=${address}`,
      default: `geo:0,0?q=${address}`,
    });
    if (url) Linking.openURL(url);
  };

  const openPhone = () => {
    Linking.openURL(`tel:${config.business.phone.replace(/[^0-9+]/g, "")}`);
  };

  const openEmail = () => {
    Linking.openURL(`mailto:${config.business.email}`);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <LinearGradient
        colors={[colors.custom.charcoal, colors.custom.navy]}
        style={styles.contactHero}
      >
        <Ionicons name="location" size={40} color={colors.custom.gold} />
        <Text style={styles.contactHeroTitle}>Get in Touch</Text>
        <Text style={styles.contactHeroDesc}>We'd love to hear from you</Text>
      </LinearGradient>

      <View style={styles.contactContent}>
        {/* Contact cards */}
        <TouchableOpacity
          style={[styles.contactCard, shadows.sm]}
          onPress={openPhone}
          activeOpacity={0.85}
        >
          <View
            style={[
              styles.contactIcon,
              { backgroundColor: colors.primary.main + "15" },
            ]}
          >
            <Ionicons name="call" size={24} color={colors.primary.main} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Phone</Text>
            <Text style={styles.contactValue}>{config.business.phone}</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.text.muted}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.contactCard, shadows.sm]}
          onPress={openEmail}
          activeOpacity={0.85}
        >
          <View
            style={[
              styles.contactIcon,
              { backgroundColor: colors.custom.navy + "15" },
            ]}
          >
            <Ionicons name="mail" size={24} color={colors.custom.navy} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>{config.business.email}</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.text.muted}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.contactCard, shadows.sm]}
          onPress={openMap}
          activeOpacity={0.85}
        >
          <View
            style={[
              styles.contactIcon,
              { backgroundColor: colors.secondary.main + "15" },
            ]}
          >
            <Ionicons name="location" size={24} color={colors.secondary.main} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Address</Text>
            <Text style={styles.contactValue}>{config.business.address}</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.text.muted}
          />
        </TouchableOpacity>

        <View style={[styles.contactCard, shadows.sm]}>
          <View
            style={[
              styles.contactIcon,
              { backgroundColor: colors.custom.gold + "15" },
            ]}
          >
            <Ionicons name="time" size={24} color={colors.custom.gold} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Hours</Text>
            <Text style={styles.contactValue}>{config.business.hours}</Text>
          </View>
        </View>

        {/* Social Links */}
        <Text style={styles.socialTitle}>Follow Us</Text>
        <View style={styles.socialRow}>
          {socialLinks.map((social) => (
            <TouchableOpacity
              key={social.name}
              style={[styles.socialButton, shadows.sm]}
              onPress={() => Linking.openURL(social.url)}
              activeOpacity={0.85}
            >
              <Ionicons name={social.icon} size={24} color={social.color} />
              <Text style={styles.socialName}>{social.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order CTA */}
        <View style={styles.orderSection}>
          <Button
            title="Order Online"
            variant="contained"
            color="primary"
            size="lg"
            fullWidth
            icon={<Ionicons name="bag-handle" size={18} color="#fff" />}
            onPress={() => Linking.openURL(config.business.orderUrl)}
          />
          <Button
            title="Gift Cards"
            variant="outlined"
            color="primary"
            size="lg"
            fullWidth
            icon={
              <Ionicons name="gift" size={18} color={colors.primary.main} />
            }
            onPress={() => Linking.openURL(config.business.giftCardsUrl)}
            style={{ marginTop: spacing.md }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const socialLinks = [
  {
    name: "Facebook",
    icon: "logo-facebook" as const,
    color: "#1877F2",
    url: config.business.social.facebook,
  },
  {
    name: "Instagram",
    icon: "logo-instagram" as const,
    color: "#E4405F",
    url: config.business.social.instagram,
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  content: {
    paddingBottom: spacing["3xl"],
  },

  // About hero
  hero: {
    alignItems: "center",
    paddingTop: spacing["3xl"],
    paddingBottom: spacing["2xl"],
    paddingHorizontal: spacing.xl,
  },
  heroLogo: {
    width: 100,
    height: 100,
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes["4xl"],
    color: colors.text.light,
    marginBottom: spacing.sm,
  },
  heroBadge: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.xs,
    letterSpacing: 2,
    color: colors.custom.gold,
  },

  // About sections
  section: {
    padding: spacing.xl,
    paddingTop: spacing["2xl"],
  },
  bodyText: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.base,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.base,
  },
  featuresSection: {
    paddingVertical: spacing["2xl"],
    paddingHorizontal: spacing.base,
    backgroundColor: colors.background.cream,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    justifyContent: "center",
  },
  featureCard: {
    width: "47%" as any,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    alignItems: "center",
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  featureTitle: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes.md,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  featureDesc: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 18,
  },

  // CTA
  ctaSection: {
    padding: spacing.base,
    paddingTop: spacing.xl,
  },
  ctaGradient: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: "center",
  },
  ctaTitle: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes.xl,
    color: colors.text.light,
    marginBottom: spacing.sm,
  },
  ctaDesc: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.md,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  ctaButtons: {
    flexDirection: "row",
    gap: spacing.md,
  },

  // Contact hero
  contactHero: {
    alignItems: "center",
    paddingTop: spacing["2xl"],
    paddingBottom: spacing["2xl"],
  },
  contactHeroTitle: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes["3xl"],
    color: colors.text.light,
    marginTop: spacing.md,
  },
  contactHeroDesc: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.md,
    color: "rgba(255,255,255,0.7)",
    marginTop: spacing.xs,
  },

  // Contact cards
  contactContent: {
    padding: spacing.base,
    paddingTop: spacing.xl,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.xs,
    color: colors.text.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  contactValue: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.md,
    color: colors.text.primary,
    marginTop: 2,
  },

  // Social
  socialTitle: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes.lg,
    color: colors.text.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  socialButton: {
    alignItems: "center",
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  socialName: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.sm,
    color: colors.text.primary,
  },

  // Order section
  orderSection: {
    marginTop: spacing.md,
  },
});
