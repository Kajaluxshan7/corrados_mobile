import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
  Animated,
  StatusBar,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
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
import { LoadingView, ErrorView, EmptyView } from "../components";
import { storiesApi, getImageUrl } from "../services/api";
import type { StoryCategory, Story, MoreStackParamList } from "../types";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const STORY_RING_SIZE = 80;
const PROGRESS_DURATION = 5000; // 5 seconds per story

// ──────────────────────────────────────────────
// Stories Categories Screen
// ──────────────────────────────────────────────

type StoriesProps = NativeStackScreenProps<MoreStackParamList, "Stories">;

export function StoriesScreen({ navigation }: StoriesProps) {
  const [categories, setCategories] = useState<StoryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const data = await storiesApi.getCategories();
      setCategories(
        data
          .filter((c) => c.isActive && c.stories.some((s) => s.isActive))
          .sort((a, b) => a.sortOrder - b.sortOrder),
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
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

  if (loading) return <LoadingView message="Loading stories..." />;
  if (error) return <ErrorView message={error} onRetry={fetchData} />;
  if (categories.length === 0) {
    return (
      <EmptyView
        icon="images-outline"
        title="No stories yet"
        message="Check back for updates"
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Story rings row */}
      <View style={styles.ringsSection}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.ringsContainer}
          renderItem={({ item }) => {
            const firstStory = item.stories.find((s) => s.isActive);
            return (
              <TouchableOpacity
                style={styles.ringItem}
                onPress={() =>
                  navigation.navigate("StoryViewer", {
                    stories: item.stories.filter((s) => s.isActive),
                    initialIndex: 0,
                  })
                }
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[
                    colors.primary.main,
                    colors.custom.gold,
                    colors.custom.wine,
                  ]}
                  style={styles.ringBorder}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.ringInner}>
                    {firstStory?.imageUrls?.[0] ? (
                      <Image
                        source={{ uri: getImageUrl(firstStory.imageUrls[0]) }}
                        style={styles.ringImage}
                        contentFit="cover"
                      />
                    ) : (
                      <View style={styles.ringPlaceholder}>
                        <Ionicons
                          name="images"
                          size={24}
                          color={colors.text.muted}
                        />
                      </View>
                    )}
                  </View>
                </LinearGradient>
                <Text style={styles.ringLabel} numberOfLines={1}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Full gallery grid */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.galleryContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.main}
          />
        }
        renderItem={({ item: category }) => (
          <View style={styles.categorySection}>
            <Text style={styles.categorySectionTitle}>{category.name}</Text>
            <View style={styles.photoGrid}>
              {category.stories
                .filter((s) => s.isActive)
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((story, index) => (
                  <TouchableOpacity
                    key={story.id}
                    style={[
                      styles.photoItem,
                      index % 3 === 0 && styles.photoItemLarge,
                      shadows.sm,
                    ]}
                    onPress={() =>
                      navigation.navigate("StoryViewer", {
                        stories: category.stories.filter((s) => s.isActive),
                        initialIndex: index,
                      })
                    }
                    activeOpacity={0.85}
                  >
                    {story.imageUrls?.[0] && (
                      <Image
                        source={{ uri: getImageUrl(story.imageUrls[0]) }}
                        style={StyleSheet.absoluteFillObject}
                        contentFit="cover"
                        transition={300}
                      />
                    )}
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}

// ──────────────────────────────────────────────
// Story Viewer (Full Screen Modal)
// ──────────────────────────────────────────────

type StoryViewerProps = NativeStackScreenProps<
  MoreStackParamList,
  "StoryViewer"
>;

export function StoryViewerScreen({ route, navigation }: StoryViewerProps) {
  const { stories, initialIndex } = route.params;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentStory = stories[currentIndex];

  const startProgress = useCallback(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: PROGRESS_DURATION,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        goToNext();
      }
    });
  }, [currentIndex]);

  useEffect(() => {
    startProgress();
    return () => {
      progress.stopAnimation();
    };
  }, [currentIndex, startProgress]);

  const goToNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.goBack();
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      progress.setValue(0);
      startProgress();
    }
  };

  const handlePress = (evt: any) => {
    const x = evt.nativeEvent.locationX;
    if (x < SCREEN_WIDTH / 3) {
      goToPrevious();
    } else {
      goToNext();
    }
  };

  return (
    <View style={styles.viewerContainer}>
      <StatusBar barStyle="light-content" />

      {/* Image */}
      {currentStory?.imageUrls?.[0] && (
        <Image
          source={{ uri: getImageUrl(currentStory.imageUrls[0]) }}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          transition={200}
        />
      )}

      {/* Top overlay with progress bars */}
      <LinearGradient
        colors={["rgba(0,0,0,0.6)", "transparent"]}
        style={[
          styles.viewerTopOverlay,
          { paddingTop: insets.top + spacing.sm },
        ]}
      >
        {/* Progress bars */}
        <View style={styles.progressRow}>
          {stories.map((_, i) => (
            <View key={i} style={styles.progressBarBg}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width:
                      i < currentIndex
                        ? "100%"
                        : i === currentIndex
                          ? progress.interpolate({
                              inputRange: [0, 1],
                              outputRange: ["0%", "100%"],
                            })
                          : "0%",
                  },
                ]}
              />
            </View>
          ))}
        </View>

        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Tap zones */}
      <TouchableOpacity
        style={StyleSheet.absoluteFillObject}
        activeOpacity={1}
        onPress={handlePress}
      />

      {/* Counter */}
      <View
        style={[
          styles.viewerBottom,
          { paddingBottom: insets.bottom + spacing.base },
        ]}
      >
        <Text style={styles.counterText}>
          {currentIndex + 1} / {stories.length}
        </Text>
      </View>
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

  // Story rings
  ringsSection: {
    backgroundColor: colors.background.paper,
    paddingVertical: spacing.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.light,
  },
  ringsContainer: {
    paddingHorizontal: spacing.base,
    gap: spacing.base,
  },
  ringItem: {
    alignItems: "center",
    width: STORY_RING_SIZE + 8,
  },
  ringBorder: {
    width: STORY_RING_SIZE,
    height: STORY_RING_SIZE,
    borderRadius: STORY_RING_SIZE / 2,
    padding: 3,
  },
  ringInner: {
    flex: 1,
    borderRadius: STORY_RING_SIZE / 2,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.background.paper,
  },
  ringImage: {
    width: "100%",
    height: "100%",
  },
  ringPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.cream,
  },
  ringLabel: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.xs,
    color: colors.text.primary,
    marginTop: spacing.xs,
    textAlign: "center",
  },

  // Gallery
  galleryContainer: {
    padding: spacing.base,
    paddingBottom: spacing["3xl"],
  },
  categorySection: {
    marginBottom: spacing.xl,
  },
  categorySectionTitle: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes.lg,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  photoItem: {
    width: (SCREEN_WIDTH - spacing.base * 2 - spacing.xs * 2) / 3,
    height: (SCREEN_WIDTH - spacing.base * 2 - spacing.xs * 2) / 3,
    borderRadius: borderRadius.sm,
    overflow: "hidden",
    backgroundColor: colors.background.cream,
  },
  photoItemLarge: {
    width:
      ((SCREEN_WIDTH - spacing.base * 2 - spacing.xs) / 3) * 2 + spacing.xs,
    height: (SCREEN_WIDTH - spacing.base * 2 - spacing.xs * 2) / 3,
  },

  // Story Viewer
  viewerContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  viewerTopOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
  },
  progressRow: {
    flexDirection: "row",
    gap: 3,
    marginBottom: spacing.md,
  },
  progressBarBg: {
    flex: 1,
    height: 2.5,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: spacing.xs,
  },
  viewerBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  counterText: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.sm,
    color: "rgba(255,255,255,0.7)",
  },
});
