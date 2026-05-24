import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
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
import { LoadingView, ErrorView, DynamicImage } from "../components";
import { menuApi, getImageUrl } from "../services/api";
import type { PrimaryCategory, MenuStackParamList } from "../types";

// ──────────────────────────────────────────────
// 1. Primary Categories Screen
// ──────────────────────────────────────────────

type CategoriesProps = NativeStackScreenProps<
  MenuStackParamList,
  "MenuCategories"
>;

export function MenuCategoriesScreen({ navigation }: CategoriesProps) {
  const [categories, setCategories] = useState<PrimaryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setError(null);
      const data = await menuApi.getPrimaryCategories();
      setCategories(
        data
          .filter((c) => c.isActive)
          .sort((a, b) => a.sortOrder - b.sortOrder),
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCategories();
    setRefreshing(false);
  }, [fetchCategories]);

  if (loading) return <LoadingView message="Loading menu..." />;
  if (error) return <ErrorView message={error} onRetry={fetchCategories} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
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
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.categoryCard, shadows.md]}
            onPress={() =>
              navigation.navigate("MenuSubCategories", {
                primaryCategoryId: item.id,
                title: item.name,
              })
            }
            activeOpacity={0.85}
          >
            {item.imageUrl ? (
              <Image
                source={{ uri: getImageUrl(item.imageUrl) }}
                style={StyleSheet.absoluteFillObject}
                contentFit="cover"
                transition={300}
              />
            ) : (
              <LinearGradient
                colors={gradients[index % gradients.length] as [string, string]}
                style={StyleSheet.absoluteFillObject}
              />
            )}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.65)"]}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.categoryContent}>
              <Text style={styles.categoryTitle}>{item.name}</Text>
              {item.description && (
                <Text style={styles.categoryDesc} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
              <View style={styles.categoryArrow}>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={colors.text.light}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const gradients = [
  [colors.primary.main, colors.primary.dark],
  [colors.secondary.main, colors.secondary.dark],
  [colors.custom.wine, "#5a1f27"],
  [colors.custom.navy, "#1a2d5a"],
  [colors.custom.gold, "#a88a50"],
  [colors.custom.sage, "#6b7d5a"],
];

// ──────────────────────────────────────────────
// 2. Sub-Categories Screen
// ──────────────────────────────────────────────

import type { MenuCategory } from "../types";

type SubCategoriesProps = NativeStackScreenProps<
  MenuStackParamList,
  "MenuSubCategories"
>;

export function MenuSubCategoriesScreen({
  route,
  navigation,
}: SubCategoriesProps) {
  const { primaryCategoryId, title } = route.params;
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const data = await menuApi.getCategories(primaryCategoryId);
      setCategories(
        data
          .filter((c) => c.isActive)
          .sort((a, b) => a.sortOrder - b.sortOrder),
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [primaryCategoryId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <LoadingView message="Loading categories..." />;
  if (error) return <ErrorView message={error} onRetry={fetchData} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.subCategoryCard, shadows.md]}
            onPress={() =>
              navigation.navigate("MenuItems", {
                categoryId: item.id,
                title: item.name,
              })
            }
            activeOpacity={0.85}
          >
            {item.imageUrl ? (
              <DynamicImage
                uri={getImageUrl(item.imageUrl)}
                backgroundColor={colors.background.paper}
              />
            ) : (
              <LinearGradient
                colors={gradients[index % gradients.length] as [string, string]}
                style={styles.subCategoryImage}
              >
                <Ionicons
                  name="restaurant-outline"
                  size={28}
                  color="rgba(255,255,255,0.5)"
                />
              </LinearGradient>
            )}
            <View style={styles.subCategoryInfo}>
              <Text style={styles.subCategoryTitle} numberOfLines={2}>
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ──────────────────────────────────────────────
// 3. Menu Items Screen
// ──────────────────────────────────────────────

import type { MenuItem } from "../types";

type MenuItemsProps = NativeStackScreenProps<MenuStackParamList, "MenuItems">;

export function MenuItemsScreen({ route, navigation }: MenuItemsProps) {
  const { categoryId, title } = route.params;
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const data = await menuApi.getCategoryItems(categoryId);
      setItems(
        data
          .filter((i) => i.isAvailable)
          .sort((a, b) => a.sortOrder - b.sortOrder),
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <LoadingView message="Loading items..." />;
  if (error) return <ErrorView message={error} onRetry={fetchData} />;

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      style={[styles.menuItemCard, shadows.sm]}
      onPress={() => navigation.navigate("MenuItemDetail", { item })}
      activeOpacity={0.85}
    >
      <View style={styles.menuItemMain}>
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          {item.description && (
            <Text style={styles.menuItemDesc} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          {item.dietaryInfo && item.dietaryInfo.length > 0 && (
            <View style={styles.dietaryRow}>
              {item.dietaryInfo.map((info) => (
                <View key={info} style={styles.dietaryChip}>
                  <Text style={styles.dietaryText}>{info}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        {item.imageUrls?.[0] ? (
          <DynamicImage
            uri={getImageUrl(item.imageUrls[0])}
            style={[styles.menuItemImage, { width: 80, height: 80 }]}
            backgroundColor={colors.background.default}
          />
        ) : null}
      </View>
      <View style={styles.menuItemFooter}>
        <Text style={styles.menuItemPrice}>
          {item.hasMeasurements ? "From " : ""}${item.price != null ? item.price.toFixed(2) : "0.00"}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={colors.text.muted} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={renderMenuItem}
      />
    </View>
  );
}

// ──────────────────────────────────────────────
// 4. Menu Item Detail Screen
// ──────────────────────────────────────────────

type MenuItemDetailProps = NativeStackScreenProps<
  MenuStackParamList,
  "MenuItemDetail"
>;

export function MenuItemDetailScreen({ route }: MenuItemDetailProps) {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <FlatList
        data={[item]}
        keyExtractor={() => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={() => (
          <View>
            {/* Images Carousel */}
            {item.imageUrls && item.imageUrls.length > 0 ? (
              <FlatList
                data={item.imageUrls}
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
                colors={[colors.primary.main, colors.primary.dark]}
                style={styles.detailImagePlaceholder}
              >
                <Ionicons
                  name="restaurant"
                  size={48}
                  color="rgba(255,255,255,0.4)"
                />
              </LinearGradient>
            )}

            <View style={styles.detailContent}>
              <Text style={styles.detailName}>{item.name}</Text>
              <Text style={styles.detailPrice}>${item.price != null ? item.price.toFixed(2) : "0.00"}</Text>

              {item.description && (
                <Text style={styles.detailDescription}>{item.description}</Text>
              )}

              {/* Measurements / Sizes */}
              {item.hasMeasurements &&
                item.measurements &&
                item.measurements.length > 0 && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>
                      Available Sizes
                    </Text>
                    {item.measurements
                      .filter((m) => m.isAvailable)
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((m) => (
                        <View key={m.id} style={styles.measurementRow}>
                          <Text style={styles.measurementName}>
                            {m.measurementTypeEntity.name}
                          </Text>
                          <Text style={styles.measurementPrice}>
                            ${m.price != null ? m.price.toFixed(2) : "0.00"}
                          </Text>
                        </View>
                      ))}
                  </View>
                )}

              {/* Dietary Info */}
              {item.dietaryInfo && item.dietaryInfo.length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Dietary Info</Text>
                  <View style={styles.chipRow}>
                    {item.dietaryInfo.map((info) => (
                      <View key={info} style={styles.detailChip}>
                        <Ionicons
                          name="leaf"
                          size={12}
                          color={colors.secondary.main}
                        />
                        <Text style={styles.detailChipText}>{info}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Allergens */}
              {item.allergens && item.allergens.length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Allergens</Text>
                  <View style={styles.chipRow}>
                    {item.allergens.map((allergen) => (
                      <View key={allergen} style={styles.allergenChip}>
                        <Ionicons
                          name="warning"
                          size={12}
                          color={colors.custom.wine}
                        />
                        <Text style={styles.allergenChipText}>{allergen}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
      />
    </View>
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
  columnWrapper: {
    gap: spacing.md,
  },

  // Primary category card
  categoryCard: {
    height: 200,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    backgroundColor: colors.background.paper,
  },
  categoryContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  categoryTitle: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes["2xl"],
    color: colors.text.light,
    marginBottom: spacing.xs,
  },
  categoryDesc: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.sm,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  categoryArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  // Sub-category card
  subCategoryCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    backgroundColor: colors.background.paper,
  },
  subCategoryImage: {
    width: "100%",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  subCategoryInfo: {
    padding: spacing.md,
    paddingVertical: spacing.base,
  },
  subCategoryTitle: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes.base,
    color: colors.text.primary,
    textAlign: "center",
  },

  // Menu item card
  menuItemCard: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    padding: spacing.base,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary.light,
  },
  menuItemMain: {
    flexDirection: "row",
    gap: spacing.md,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemName: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes.base,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  menuItemDesc: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  menuItemImage: {
    borderRadius: borderRadius.md,
    overflow: "hidden",
  },
  menuItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border.light,
  },
  menuItemPrice: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.base,
    color: colors.primary.main,
  },
  dietaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  dietaryChip: {
    backgroundColor: colors.secondary.main + "15",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  dietaryText: {
    fontFamily: fonts.body.family,
    fontSize: 10,
    color: colors.secondary.main,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Detail screen
  detailImage: {
    width: Dimensions.get("window").width,
    height: 280,
  },
  detailImagePlaceholder: {
    width: "100%",
    height: 280,
    justifyContent: "center",
    alignItems: "center",
  },
  detailContent: {
    padding: spacing.xl,
  },
  detailName: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes["3xl"],
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  detailPrice: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.xl,
    color: colors.primary.main,
    marginBottom: spacing.base,
  },
  detailDescription: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.base,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  detailSection: {
    marginBottom: spacing.xl,
  },
  detailSectionTitle: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.sm,
    color: colors.text.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  measurementRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.light,
  },
  measurementName: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.base,
    color: colors.text.primary,
  },
  measurementPrice: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.base,
    color: colors.primary.main,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  detailChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.secondary.main + "12",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  detailChipText: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.sm,
    color: colors.secondary.main,
  },
  allergenChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.custom.wine + "12",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  allergenChipText: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.sm,
    color: colors.custom.wine,
  },
});

// Need Dimensions import
import { Dimensions } from "react-native";
