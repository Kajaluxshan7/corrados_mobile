import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Linking,
  Platform,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import {
  colors,
  fonts,
  fontSizes,
  spacing,
  borderRadius,
  shadows,
} from "../theme";
import { SectionHeader, Button, DynamicImage } from "../components";
import { specialsApi, eventsApi, getImageUrl } from "../services/api";
import { config } from "../config";
import type { Special, Event } from "../types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TILE_GAP = spacing.sm;
const TILE_PADDING = spacing.base;
const EVENT_CARD_WIDTH = SCREEN_WIDTH * 0.78;

// ──────────────────────────────────────────────
// Navigation Tile Data
// ──────────────────────────────────────────────

interface NavTile {
  key: string;
  label: string;
  subtitle: string;
  route: string;
  tab?: string;
  colSpan: number;
  rowSpan: number;
  gradient: string[];
  image?: any;
}

const NAV_TILES: NavTile[] = [
  {
    key: "about",
    label: "About Us",
    subtitle: "Our story & values",
    route: "About",
    tab: "MoreTab",
    colSpan: 2,
    rowSpan: 2,
    gradient: [colors.custom.navy, "#1a2d5a"],
    image: require("../assets/logo-white-on-blue.png"),
  },
  {
    key: "menus",
    label: "Our Menu",
    subtitle: "Explore dishes",
    route: "MenuCategories",
    tab: "MenuTab",
    colSpan: 1,
    rowSpan: 1,
    gradient: [colors.primary.main, colors.primary.dark],
  },
  {
    key: "specials",
    label: "Specials",
    subtitle: "Daily deals",
    route: "Specials",
    tab: "SpecialsTab",
    colSpan: 1,
    rowSpan: 1,
    gradient: [colors.custom.wine, "#5a1f27"],
  },
  {
    key: "family",
    label: "Party Menus",
    subtitle: "Group dining",
    route: "PartyMenus",
    tab: "MoreTab",
    colSpan: 1,
    rowSpan: 1,
    gradient: [colors.secondary.main, colors.secondary.dark],
  },
  {
    key: "events",
    label: "Events",
    subtitle: "What's on",
    route: "Events",
    tab: "EventsTab",
    colSpan: 1,
    rowSpan: 1,
    gradient: [colors.custom.gold, "#a88a50"],
  },
  {
    key: "gallery",
    label: "Stories",
    subtitle: "Behind the scenes",
    route: "Stories",
    tab: "MoreTab",
    colSpan: 2,
    rowSpan: 1,
    gradient: [colors.custom.sage, "#6b7d5a"],
  },
  {
    key: "hours",
    label: "Hours",
    subtitle: "When to visit",
    route: "OpeningHours",
    tab: "MoreTab",
    colSpan: 1,
    rowSpan: 1,
    gradient: ["#5C524D", "#3a3330"],
  },
  {
    key: "contact",
    label: "Contact",
    subtitle: "Get in touch",
    route: "Contact",
    tab: "MoreTab",
    colSpan: 1,
    rowSpan: 1,
    gradient: [colors.custom.charcoal, "#1a1715"],
  },
];

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [specials, setSpecials] = useState<Special[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const fetchData = useCallback(async () => {
    try {
      const [specialsData, eventsData] = await Promise.all([
        specialsApi.getActive().catch(() => []),
        eventsApi.getActive().catch(() => []),
      ]);
      setSpecials(specialsData);
      setEvents(eventsData);
    } catch {
      // Silently fail — sections will just show empty
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const handleTilePress = (tile: NavTile) => {
    if (tile.tab) {
      navigation.navigate(tile.tab, { screen: tile.route });
    }
  };

  const handleOrderPress = () => {
    Linking.openURL(config.business.orderUrl);
  };

  const handleCallPress = () => {
    Linking.openURL(`tel:${config.business.phone.replace(/[^0-9+]/g, "")}`);
  };

  // Calculate tile dimensions
  const usableWidth = SCREEN_WIDTH - TILE_PADDING * 2;
  const colWidth = (usableWidth - TILE_GAP) / 2;
  const singleHeight = colWidth * 0.6;

  // Header animation
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.root}>
      {/* Status bar background */}
      <LinearGradient
        colors={[colors.custom.navy, colors.custom.navy]}
        style={[styles.statusBar, { height: insets.top }]}
      />

      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.main}
            colors={[colors.primary.main]}
          />
        }
      >
        {/* ─── Header / Hero ─── */}
        <Animated.View style={[styles.hero, { opacity: headerOpacity }]}>
          <LinearGradient
            colors={[colors.custom.navy, "#1a2d5a", colors.custom.charcoal]}
            style={styles.heroGradient}
          >
            <View
              style={[
                styles.heroContent,
                { paddingTop: insets.top + spacing.lg },
              ]}
            >
              <Image
                source={require("../assets/logo-white-on-blue.png")}
                style={styles.logo}
                contentFit="contain"
              />
              <Text style={styles.heroTagline}>{config.business.tagline}</Text>
              <Text style={styles.heroBadge}>WHITBY, ON • EST. 2010</Text>

              {/* Quick action buttons */}
              <View style={styles.heroActions}>
                <TouchableOpacity
                  style={styles.heroButton}
                  onPress={handleOrderPress}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="bag-handle"
                    size={18}
                    color={colors.text.light}
                  />
                  <Text style={styles.heroButtonText}>Order Online</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.heroButton, styles.heroButtonOutlined]}
                  onPress={handleCallPress}
                  activeOpacity={0.8}
                >
                  <Ionicons name="call" size={18} color={colors.text.light} />
                  <Text style={styles.heroButtonText}>Call Us</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ─── Navigation Tiles (Bento Grid) ─── */}
        <View style={styles.tilesSection}>
          <SectionHeader
            subtitle="EXPLORE"
            title="Welcome to Corrado's"
            description="Family-owned Italian restaurant in the heart of Whitby"
          />
          <View style={styles.tilesGrid}>
            {NAV_TILES.map((tile) => {
              const tileWidth =
                tile.colSpan === 2 ? colWidth * 2 + TILE_GAP : colWidth;
              const tileHeight =
                tile.rowSpan === 2 ? singleHeight * 2 + TILE_GAP : singleHeight;

              return (
                <TouchableOpacity
                  key={tile.key}
                  style={[
                    styles.tile,
                    shadows.md,
                    { width: tileWidth, height: tileHeight },
                  ]}
                  onPress={() => handleTilePress(tile)}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={tile.gradient as [string, string]}
                    style={styles.tileGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {tile.image && (
                      <Image
                        source={tile.image}
                        style={styles.tileBackgroundImage}
                        contentFit="contain"
                      />
                    )}
                    <View style={styles.tileContent}>
                      <View style={styles.tileBottom}>
                        <View style={styles.tileLabelGroup}>
                          <Text
                            style={[
                              styles.tileLabel,
                              tile.rowSpan === 2 && styles.tileLabelLarge,
                            ]}
                          >
                            {tile.label}
                          </Text>
                          <Text style={styles.tileSubtitle}>{tile.subtitle}</Text>
                        </View>
                        <View style={styles.tileArrow}>
                          <Ionicons
                            name="arrow-forward"
                            size={14}
                            color="rgba(255,255,255,0.7)"
                          />
                        </View>
                      </View>
                    </View>
                    {/* Decorative circle */}
                    <View
                      style={[
                        styles.tileDecor,
                        tile.rowSpan === 2 && styles.tileDecorLarge,
                      ]}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ─── Featured Specials ─── */}
        {specials.length > 0 && (
          <View style={styles.specialsSection}>
            <SectionHeader
              subtitle="DAILY SPECIALS"
              title="Something Special Every Day"
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.horizontalList,
                specials.length === 1 && styles.horizontalListCentered,
              ]}
              snapToInterval={specials.length > 1 ? SCREEN_WIDTH * 0.75 + spacing.md : undefined}
              decelerationRate="fast"
            >
              {specials.slice(0, 6).map((special) => (
                <TouchableOpacity
                  key={special.id}
                  style={[styles.specialCard, shadows.md]}
                  onPress={() =>
                    navigation.navigate("SpecialsTab", {
                      screen: "SpecialDetail",
                      params: { special },
                    })
                  }
                  activeOpacity={0.85}
                >
                  {special.imageUrls?.[0] ? (
                    <DynamicImage
                      uri={getImageUrl(special.imageUrls[0])}
                      backgroundColor={colors.background.paper}
                    />
                  ) : (
                    <LinearGradient
                      colors={[colors.primary.main, colors.custom.wine]}
                      style={styles.specialImage}
                    >
                      <Ionicons
                        name="star"
                        size={32}
                        color="rgba(255,255,255,0.4)"
                      />
                    </LinearGradient>
                  )}
                  <View style={styles.specialInfo}>
                    <View style={styles.specialChips}>
                      {special.dayOfWeek && (
                        <View style={styles.miniChip}>
                          <Text style={styles.miniChipText}>
                            {special.dayOfWeek.charAt(0).toUpperCase() +
                              special.dayOfWeek.slice(1)}
                          </Text>
                        </View>
                      )}
                      <View style={[styles.miniChip, styles.miniChipType]}>
                        <Text style={styles.miniChipText}>
                          {special.type.replace("_", " ")}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.specialTitle} numberOfLines={1}>
                      {special.title}
                    </Text>
                    {special.description && (
                      <Text style={styles.specialDesc} numberOfLines={2}>
                        {special.description}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.sectionCta}>
              <Button
                title="View All Specials"
                variant="outlined"
                color="primary"
                onPress={() => navigation.navigate("SpecialsTab")}
              />
            </View>
          </View>
        )}

        {/* ─── Upcoming Events ─── */}
        {events.length > 0 && (
          <View style={styles.eventsSection}>
            <View style={styles.eventsSectionHeader}>
              <View>
                <Text style={styles.eventsSectionSubtitle}>WHAT'S HAPPENING</Text>
                <Text style={styles.eventsSectionTitle}>Upcoming Events</Text>
              </View>
              <TouchableOpacity
                style={styles.eventsViewAll}
                onPress={() => navigation.navigate("EventsTab")}
                activeOpacity={0.7}
              >
                <Text style={styles.eventsViewAllText}>See all</Text>
                <Ionicons name="arrow-forward" size={14} color={colors.primary.main} />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.horizontalList,
                events.length === 1 && styles.horizontalListCentered,
              ]}
              snapToInterval={events.length > 1 ? EVENT_CARD_WIDTH + spacing.md : undefined}
              decelerationRate="fast"
            >
              {events.slice(0, 6).map((event) => {
                const eventDate = event.eventStartDate
                  ? new Date(event.eventStartDate)
                  : null;
                const dayNum = eventDate
                  ? eventDate.toLocaleDateString("en-CA", { day: "numeric" })
                  : null;
                const monthAbbr = eventDate
                  ? eventDate.toLocaleDateString("en-CA", { month: "short" }).toUpperCase()
                  : null;
                const weekday = eventDate
                  ? eventDate.toLocaleDateString("en-CA", { weekday: "long" })
                  : null;

                return (
                  <TouchableOpacity
                    key={event.id}
                    style={[styles.eventCard, shadows.lg]}
                    onPress={() =>
                      navigation.navigate("EventsTab", {
                        screen: "EventDetail",
                        params: { event },
                      })
                    }
                    activeOpacity={0.9}
                  >
                    {/* Background image or gradient */}
                    <View style={styles.eventCardBg}>
                      {event.imageUrls?.[0] ? (
                        <DynamicImage
                          uri={getImageUrl(event.imageUrls[0])}
                          backgroundColor={colors.custom.charcoal}
                          style={StyleSheet.absoluteFillObject}
                          defaultAspectRatio={EVENT_CARD_WIDTH / 260}
                        />
                      ) : (
                        <LinearGradient
                          colors={["#1A3A1E", colors.secondary.main, colors.custom.sage]}
                          style={StyleSheet.absoluteFill}
                          start={{ x: 0.1, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <Ionicons
                            name="sparkles"
                            size={64}
                            color="rgba(255,255,255,0.07)"
                            style={styles.eventBgIcon}
                          />
                        </LinearGradient>
                      )}
                    </View>

                    {/* Dark overlay */}
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.85)"]}
                      style={[StyleSheet.absoluteFill, styles.eventOverlay]}
                    />

                    {/* Date badge — top left */}
                    {dayNum && (
                      <View style={styles.eventDateBadge}>
                        <Text style={styles.eventDateBadgeMonth}>{monthAbbr}</Text>
                        <Text style={styles.eventDateBadgeDay}>{dayNum}</Text>
                      </View>
                    )}

                    {/* Type pill — top right */}
                    <View style={styles.eventTypePill}>
                      <Text style={styles.eventTypePillText}>
                        {event.type.replace(/_/g, " ")}
                      </Text>
                    </View>

                    {/* Bottom content */}
                    <View style={styles.eventCardBottom}>
                      {weekday && (
                        <Text style={styles.eventCardWeekday}>{weekday}</Text>
                      )}
                      <Text style={styles.eventCardTitle} numberOfLines={2}>
                        {event.title}
                      </Text>
                      {event.description && (
                        <Text style={styles.eventCardDesc} numberOfLines={1}>
                          {event.description}
                        </Text>
                      )}
                      <View style={styles.eventCardCta}>
                        <Text style={styles.eventCardCtaText}>View Details</Text>
                        <Ionicons name="arrow-forward" size={13} color={colors.custom.gold} />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* ─── Quick Info Bar ─── */}
        <View style={styles.infoSection}>
          <SectionHeader subtitle="VISIT US" title="Come Dine With Us" />
          <View style={styles.infoCards}>
            <TouchableOpacity
              style={[styles.infoCard, shadows.sm]}
              onPress={() =>
                navigation.navigate("MoreTab", { screen: "OpeningHours" })
              }
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.infoIcon,
                  { backgroundColor: colors.primary.main + "15" },
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={22}
                  color={colors.primary.main}
                />
              </View>
              <Text style={styles.infoLabel}>Hours</Text>
              <Text style={styles.infoValue}>{config.business.hours}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.infoCard, shadows.sm]}
              onPress={() =>
                Linking.openURL(
                  Platform.select({
                    ios: `maps:0,0?q=${config.business.address}`,
                    default: `geo:0,0?q=${config.business.address}`,
                  })!,
                )
              }
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.infoIcon,
                  { backgroundColor: colors.secondary.main + "15" },
                ]}
              >
                <Ionicons
                  name="location-outline"
                  size={22}
                  color={colors.secondary.main}
                />
              </View>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{config.business.address}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.infoCard, shadows.sm]}
              onPress={handleCallPress}
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.infoIcon,
                  { backgroundColor: colors.custom.gold + "15" },
                ]}
              >
                <Ionicons
                  name="call-outline"
                  size={22}
                  color={colors.custom.gold}
                />
              </View>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{config.business.phone}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Newsletter CTA ─── */}
        <View style={styles.newsletterSection}>
          <LinearGradient
            colors={[colors.custom.navy, colors.custom.charcoal]}
            style={styles.newsletterGradient}
          >
            <Ionicons
              name="mail-outline"
              size={36}
              color={colors.custom.gold}
            />
            <Text style={styles.newsletterTitle}>Stay in the Loop</Text>
            <Text style={styles.newsletterDesc}>
              Subscribe to get exclusive deals, event updates, and seasonal menu
              alerts.
            </Text>
            <Button
              title="Subscribe"
              variant="contained"
              color="primary"
              onPress={() =>
                navigation.navigate("MoreTab", { screen: "Newsletter" })
              }
            />
          </LinearGradient>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  statusBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },

  // ─── Hero ───
  hero: {
    width: "100%",
  },
  heroGradient: {
    width: "100%",
  },
  heroContent: {
    alignItems: "center",
    paddingBottom: spacing["2xl"],
    paddingHorizontal: spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: spacing.md,
  },
  heroTagline: {
    fontFamily: fonts.heading.regular,
    fontSize: fontSizes.lg,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  heroBadge: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.xs,
    letterSpacing: 3,
    color: colors.custom.gold,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.custom.gold + "50",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  heroActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  heroButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
  },
  heroButtonOutlined: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.4)",
  },
  heroButtonText: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.sm,
    color: colors.text.light,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // ─── Tiles ───
  tilesSection: {
    paddingTop: spacing["2xl"],
    paddingBottom: spacing.xl,
  },
  tilesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: TILE_PADDING,
    gap: TILE_GAP,
  },
  tile: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
  },
  tileGradient: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  tileContent: {
    flex: 1,
    padding: spacing.base,
    justifyContent: "flex-end",
    zIndex: 1,
  },
  tileIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  tileBottom: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.xs,
  },
  tileLabel: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes.base,
    color: colors.text.light,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  tileLabelLarge: {
    fontSize: fontSizes.lg,
  },
  tileArrow: {
    width: 26,
    height: 26,
    borderRadius: 13,
    flexShrink: 0,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  tileDecor: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  tileDecorLarge: {
    width: 160,
    height: 160,
    top: -50,
    right: -50,
    borderRadius: 80,
  },
  tileBackgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
  },
  tileLabelGroup: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  tileSubtitle: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.xs,
    color: "rgba(255,255,255,0.65)",
    marginTop: 2,
  },

  // ─── Specials ───
  specialsSection: {
    paddingTop: spacing["2xl"],
    paddingBottom: spacing.xl,
    backgroundColor: colors.background.cream,
  },
  horizontalList: {
    paddingHorizontal: TILE_PADDING,
    gap: spacing.md,
  },
  horizontalListCentered: {
    flexGrow: 1,
    justifyContent: "center",
  },
  specialCard: {
    width: SCREEN_WIDTH * 0.75,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    backgroundColor: colors.background.paper,
  },
  specialImage: {
    width: "100%",
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  specialInfo: {
    padding: spacing.md,
  },
  specialChips: {
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  miniChip: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  miniChipType: {
    backgroundColor: colors.custom.navy,
  },
  miniChipText: {
    fontFamily: fonts.body.bold,
    fontSize: 9,
    color: colors.text.light,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  specialTitle: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes.base,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  specialDesc: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  sectionCta: {
    alignItems: "center",
    marginTop: spacing.xl,
  },

  // ─── Events ───
  eventsSection: {
    paddingTop: spacing["2xl"],
    paddingBottom: spacing["2xl"],
    backgroundColor: colors.background.cream,
  },
  eventsSectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: TILE_PADDING,
    marginBottom: spacing.lg,
  },
  eventsSectionSubtitle: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.xs,
    color: colors.primary.main,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  eventsSectionTitle: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes["2xl"],
    color: colors.text.primary,
  },
  eventsViewAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingBottom: 4,
  },
  eventsViewAllText: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.sm,
    color: colors.primary.main,
  },
  eventCard: {
    width: EVENT_CARD_WIDTH,
    height: 260,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    backgroundColor: colors.custom.charcoal,
  },
  eventCardBg: {
    ...StyleSheet.absoluteFillObject,
  },
  eventOverlay: {
    borderRadius: borderRadius.xl,
  },
  eventBgIcon: {
    position: "absolute",
    bottom: -12,
    right: -12,
  },
  eventDateBadge: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.custom.gold,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    alignItems: "center",
    minWidth: 44,
  },
  eventDateBadgeMonth: {
    fontFamily: fonts.body.bold,
    fontSize: 9,
    color: "#1C1917",
    letterSpacing: 1,
  },
  eventDateBadgeDay: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes.xl,
    color: "#1C1917",
    lineHeight: 26,
  },
  eventTypePill: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  eventTypePillText: {
    fontFamily: fonts.body.bold,
    fontSize: 9,
    color: colors.text.light,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  eventCardBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  eventCardWeekday: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.xs,
    color: colors.custom.gold,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  eventCardTitle: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes.lg,
    color: colors.text.light,
    marginBottom: spacing.xs,
    lineHeight: 24,
  },
  eventCardDesc: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.sm,
    color: "rgba(255,255,255,0.65)",
    marginBottom: spacing.sm,
  },
  eventCardCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  eventCardCtaText: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.xs,
    color: colors.custom.gold,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // ─── Info section ───
  infoSection: {
    paddingTop: spacing["2xl"],
    paddingBottom: spacing.xl,
    backgroundColor: colors.background.default,
  },
  infoCards: {
    paddingHorizontal: TILE_PADDING,
    gap: spacing.md,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    gap: spacing.md,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  infoLabel: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.xs,
    color: colors.text.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  infoValue: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.sm,
    color: colors.text.primary,
    flex: 1,
    marginTop: 1,
  },

  // ─── Newsletter ───
  newsletterSection: {
    paddingHorizontal: TILE_PADDING,
    paddingVertical: spacing.xl,
    backgroundColor: colors.background.default,
  },
  newsletterGradient: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: "center",
  },
  newsletterTitle: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes.xl,
    color: colors.text.light,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  newsletterDesc: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.md,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 22,
    maxWidth: 300,
  },
});
