import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  RefreshControl,
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
import { LoadingView, ErrorView, EmptyView, Chip, DynamicImage } from "../components";
import { partyMenuApi, getImageUrl } from "../services/api";
import type { PartyMenu, MoreStackParamList } from "../types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ──────────────────────────────────────────────
// Party Menus List Screen
// ──────────────────────────────────────────────

type PartyMenusProps = NativeStackScreenProps<MoreStackParamList, "PartyMenus">;

export function PartyMenusScreen({ navigation }: PartyMenusProps) {
  const [menus, setMenus] = useState<PartyMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMenus = useCallback(async () => {
    try {
      setError(null);
      const data = await partyMenuApi.getAll();
      setMenus(
        data
          .filter((m) => m.isActive)
          .sort((a, b) => a.sortOrder - b.sortOrder),
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMenus();
    setRefreshing(false);
  }, [fetchMenus]);

  if (loading) return <LoadingView message="Loading party menus..." />;
  if (error) return <ErrorView message={error} onRetry={fetchMenus} />;
  if (menus.length === 0) {
    return (
      <EmptyView
        icon="people-outline"
        title="No party menus available"
        message="Contact us to plan your event"
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={menus}
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
            style={[styles.card, shadows.md]}
            onPress={() =>
              navigation.navigate("PartyMenuDetail", { partyMenu: item })
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
                colors={[colors.secondary.main, colors.custom.sage]}
                style={[styles.cardImage, styles.gradientPlaceholder]}
              >
                <Ionicons
                  name="people"
                  size={36}
                  color="rgba(255,255,255,0.3)"
                />
              </LinearGradient>
            )}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={styles.cardOverlay}
            />
            <View style={styles.cardContent}>
              <View style={styles.chipRow}>
                <Chip label={item.menuType} variant="gold" size="sm" />
              </View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <View style={styles.cardMeta}>
                <Text style={styles.cardPrice}>
                  ${item.pricePerPerson != null ? item.pricePerPerson.toFixed(2) : "0.00"}/person
                </Text>
                {!!item.minimumGuests && (
                  <Text style={styles.cardGuests}>
                    Min {item.minimumGuests} guests
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ──────────────────────────────────────────────
// Party Menu Detail Screen
// ──────────────────────────────────────────────

type PartyMenuDetailProps = NativeStackScreenProps<
  MoreStackParamList,
  "PartyMenuDetail"
>;

export function PartyMenuDetailScreen({ route }: PartyMenuDetailProps) {
  const { partyMenu } = route.params;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.detailContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Image */}
      {partyMenu.imageUrls && partyMenu.imageUrls.length > 0 ? (
        <FlatList
          data={partyMenu.imageUrls}
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
          colors={[colors.secondary.main, colors.custom.sage]}
          style={[styles.detailImage, styles.gradientPlaceholder]}
        >
          <Ionicons name="people" size={56} color="rgba(255,255,255,0.3)" />
        </LinearGradient>
      )}

      <View style={styles.detailContent}>
        <View style={styles.chipRow}>
          <Chip label={partyMenu.menuType} variant="gold" size="md" />
        </View>

        <Text style={styles.detailTitle}>{partyMenu.name}</Text>

        {/* Price & Guest info */}
        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Ionicons name="pricetag" size={18} color={colors.primary.main} />
            <Text style={styles.priceLabel}>Price per person</Text>
            <Text style={styles.priceValue}>
              ${partyMenu.pricePerPerson != null ? partyMenu.pricePerPerson.toFixed(2) : "0.00"}
            </Text>
          </View>
          {!!(partyMenu.minimumGuests || partyMenu.maximumGuests) && (
            <View style={styles.priceRow}>
              <Ionicons name="people" size={18} color={colors.secondary.main} />
              <Text style={styles.priceLabel}>Group size</Text>
              <Text style={styles.priceValue}>
                {partyMenu.minimumGuests && `${partyMenu.minimumGuests}`}
                {partyMenu.maximumGuests &&
                  ` — ${partyMenu.maximumGuests}`}{" "}
                guests
              </Text>
            </View>
          )}
        </View>

        {partyMenu.description && (
          <Text style={styles.detailDescription}>{partyMenu.description}</Text>
        )}

        {/* Sections */}
        {partyMenu.sections &&
          partyMenu.sections
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((section) => (
              <View key={section.id} style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Chip
                    label={section.sectionType.replace(/_/g, " ")}
                    variant="outlined"
                    size="sm"
                  />
                </View>
                {section.instruction && (
                  <Text style={styles.sectionInstruction}>
                    {section.instruction}
                  </Text>
                )}
                {section.items
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((sectionItem) => (
                    <View key={sectionItem.id} style={styles.sectionItem}>
                      <View style={styles.sectionItemDot} />
                      <View style={styles.sectionItemContent}>
                        <Text style={styles.sectionItemName}>
                          {sectionItem.name}
                        </Text>
                        {sectionItem.description && (
                          <Text style={styles.sectionItemDesc}>
                            {sectionItem.description}
                          </Text>
                        )}
                        {sectionItem.notes && (
                          <Text style={styles.sectionItemNotes}>
                            {sectionItem.notes}
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}
              </View>
            ))}
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

  // Card
  card: {
    height: 220,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    backgroundColor: colors.background.paper,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: spacing.base,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes.xl,
    color: colors.text.light,
    marginBottom: spacing.xs,
  },
  cardMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardPrice: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.base,
    color: colors.custom.gold,
  },
  cardGuests: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.sm,
    color: "rgba(255,255,255,0.7)",
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
  priceCard: {
    backgroundColor: colors.background.cream,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  priceLabel: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    flex: 1,
  },
  priceValue: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.md,
    color: colors.text.primary,
  },
  detailDescription: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.base,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },

  // Sections
  sectionCard: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes.lg,
    color: colors.text.primary,
    flex: 1,
  },
  sectionInstruction: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.sm,
    color: colors.primary.main,
    fontStyle: "italic",
    marginBottom: spacing.md,
  },
  sectionItem: {
    flexDirection: "row",
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border.light,
  },
  sectionItemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.custom.gold,
    marginTop: 7,
  },
  sectionItemContent: {
    flex: 1,
  },
  sectionItemName: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.md,
    color: colors.text.primary,
  },
  sectionItemDesc: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  sectionItemNotes: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.xs,
    color: colors.text.muted,
    fontStyle: "italic",
    marginTop: 2,
  },
});
