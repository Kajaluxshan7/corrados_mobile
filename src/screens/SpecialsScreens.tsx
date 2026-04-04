import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  ScrollView,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  colors,
  fonts,
  fontSizes,
  spacing,
  borderRadius,
  shadows,
} from "../theme";
import {
  LoadingView,
  ErrorView,
  EmptyView,
  SectionHeader,
  Chip,
  Button,
  DynamicImage,
} from "../components";
import { specialsApi, getImageUrl } from "../services/api";
import type { Special, SpecialsStackParamList } from "../types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ──────────────────────────────────────────────
// Specials List Screen
// ──────────────────────────────────────────────

type SpecialsListProps = NativeStackScreenProps<
  SpecialsStackParamList,
  "Specials"
>;

export function SpecialsScreen({ navigation }: SpecialsListProps) {
  const [specials, setSpecials] = useState<Special[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  const fetchSpecials = useCallback(async () => {
    try {
      setError(null);
      const data = await specialsApi.getActive();
      setSpecials(data.sort((a, b) => a.sortOrder - b.sortOrder));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpecials();
  }, [fetchSpecials]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSpecials();
    setRefreshing(false);
  }, [fetchSpecials]);

  if (loading) return <LoadingView message="Loading specials..." />;
  if (error) return <ErrorView message={error} onRetry={fetchSpecials} />;
  if (specials.length === 0) {
    return (
      <EmptyView
        icon="star-outline"
        title="No specials right now"
        message="Check back soon for our latest deals"
      />
    );
  }

  // Get unique types for filter tabs
  const types = Array.from(new Set(specials.map((s) => s.type)));
  const filteredSpecials = filter
    ? specials.filter((s) => s.type === filter)
    : specials;

  return (
    <View style={styles.container}>
      {/* Filter tabs */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <TouchableOpacity
            style={[styles.filterChip, !filter && styles.filterChipActive]}
            onPress={() => setFilter(null)}
          >
            <Text
              style={[styles.filterText, !filter && styles.filterTextActive]}
            >
              All
            </Text>
          </TouchableOpacity>
          {types.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterChip,
                filter === type && styles.filterChipActive,
              ]}
              onPress={() => setFilter(filter === type ? null : type)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === type && styles.filterTextActive,
                ]}
              >
                {type.replace(/_/g, " ")}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredSpecials}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.main}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.specialCard, shadows.md]}
            onPress={() =>
              navigation.navigate("SpecialDetail", { special: item })
            }
            activeOpacity={0.85}
          >
            {item.imageUrls?.[0] ? (
              <DynamicImage
                uri={getImageUrl(item.imageUrls[0])}
                backgroundColor={colors.background.paper}
              />
            ) : (
              <LinearGradient
                colors={[colors.primary.main, colors.custom.wine]}
                style={[styles.specialImage, styles.gradientPlaceholder]}
              >
                <Ionicons name="star" size={36} color="rgba(255,255,255,0.3)" />
              </LinearGradient>
            )}
            <View style={styles.specialInfo}>
              <View style={styles.chipRow}>
                {item.dayOfWeek && (
                  <Chip
                    label={
                      item.dayOfWeek.charAt(0).toUpperCase() +
                      item.dayOfWeek.slice(1)
                    }
                    variant="primary"
                    size="sm"
                  />
                )}
                <Chip
                  label={item.type.replace(/_/g, " ")}
                  variant="navy"
                  size="sm"
                />
              </View>
              <Text style={styles.specialTitle} numberOfLines={2}>
                {item.title}
              </Text>
              {item.description && (
                <Text style={styles.specialDesc} numberOfLines={3}>
                  {item.description}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ──────────────────────────────────────────────
// Special Detail Screen
// ──────────────────────────────────────────────

type SpecialDetailProps = NativeStackScreenProps<
  SpecialsStackParamList,
  "SpecialDetail"
>;

export function SpecialDetailScreen({ route }: SpecialDetailProps) {
  const { special } = route.params;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.detailContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Image carousel */}
      {special.imageUrls && special.imageUrls.length > 0 ? (
        <FlatList
          data={special.imageUrls}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(url, i) => `${url}-${i}`}
          renderItem={({ item: url }) => (
            <DynamicImage
              uri={getImageUrl(url)}
              backgroundColor={colors.custom.charcoal}
            />
          )}
        />
      ) : (
        <LinearGradient
          colors={[colors.primary.main, colors.custom.wine]}
          style={[styles.detailImage, styles.gradientPlaceholder]}
        >
          <Ionicons name="star" size={56} color="rgba(255,255,255,0.3)" />
        </LinearGradient>
      )}

      <View style={styles.detailContent}>
        <View style={styles.chipRow}>
          {special.dayOfWeek && (
            <Chip
              label={
                special.dayOfWeek.charAt(0).toUpperCase() +
                special.dayOfWeek.slice(1)
              }
              variant="primary"
              size="md"
            />
          )}
          <Chip
            label={special.type.replace(/_/g, " ")}
            variant="navy"
            size="md"
          />
          {special.specialCategory && (
            <Chip
              label={special.specialCategory.replace(/_/g, " ")}
              variant="gold"
              size="md"
            />
          )}
        </View>

        <Text style={styles.detailTitle}>{special.title}</Text>

        {special.description && (
          <Text style={styles.detailDescription}>{special.description}</Text>
        )}

        {(special.displayStartDate || special.displayEndDate) && (
          <View style={styles.dateSection}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={colors.custom.gold}
            />
            <Text style={styles.dateText}>
              {special.displayStartDate &&
                new Date(special.displayStartDate).toLocaleDateString("en-CA", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              {special.displayEndDate &&
                ` — ${new Date(special.displayEndDate).toLocaleDateString(
                  "en-CA",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  },
                )}`}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  list: {
    padding: spacing.base,
    gap: spacing.md,
    paddingBottom: spacing["3xl"],
  },

  // Filter bar
  filterBar: {
    backgroundColor: colors.background.paper,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.light,
  },
  filterScroll: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    alignItems: "center",
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.cream,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  filterChipActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  filterText: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    textTransform: "capitalize",
    letterSpacing: 0.5,
  },
  filterTextActive: {
    color: colors.text.light,
  },

  // Special card
  specialCard: {
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    backgroundColor: colors.background.paper,
  },
  specialImage: {
    width: "100%",
    height: 180,
  },
  gradientPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  specialInfo: {
    padding: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  specialTitle: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes.xl,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    lineHeight: 28,
  },
  specialDesc: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.base,
    color: colors.text.secondary,
    lineHeight: 22,
  },

  // Detail
  detailContainer: {
    paddingBottom: spacing["3xl"],
  },
  detailImage: {
    width: SCREEN_WIDTH,
    height: 280,
  },
  detailContent: {
    padding: spacing.xl,
  },
  detailTitle: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes["3xl"],
    color: colors.text.primary,
    marginBottom: spacing.base,
    lineHeight: 36,
  },
  detailDescription: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.base,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  dateSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.background.cream,
    padding: spacing.base,
    borderRadius: borderRadius.md,
  },
  dateText: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.md,
    color: colors.text.primary,
    flex: 1,
  },
});
