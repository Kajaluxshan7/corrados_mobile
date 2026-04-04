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
import { LoadingView, ErrorView, EmptyView, Chip, Button, DynamicImage } from "../components";
import { eventsApi, getImageUrl } from "../services/api";
import type { Event, EventsStackParamList } from "../types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function formatEventType(type: string): string {
  return type.replace(/_/g, " ");
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
  });
}

// ──────────────────────────────────────────────
// Events List Screen
// ──────────────────────────────────────────────

type EventsListProps = NativeStackScreenProps<EventsStackParamList, "Events">;

export function EventsScreen({ navigation }: EventsListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      setError(null);
      const data = await eventsApi.getActive();
      setEvents(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  }, [fetchEvents]);

  if (loading) return <LoadingView message="Loading events..." />;
  if (error) return <ErrorView message={error} onRetry={fetchEvents} />;
  if (events.length === 0) {
    return (
      <EmptyView
        icon="calendar-outline"
        title="No upcoming events"
        message="Stay tuned for exciting events"
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
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
            style={[styles.eventCard, shadows.md]}
            onPress={() => navigation.navigate("EventDetail", { event: item })}
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
                style={[styles.eventImage, styles.gradientPlaceholder]}
              >
                <Ionicons
                  name="calendar"
                  size={36}
                  color="rgba(255,255,255,0.3)"
                />
              </LinearGradient>
            )}
            {/* Date badge */}
            {item.eventStartDate && (
              <View style={styles.dateBadge}>
                <Text style={styles.dateBadgeMonth}>
                  {new Date(item.eventStartDate).toLocaleDateString("en-CA", {
                    month: "short",
                  })}
                </Text>
                <Text style={styles.dateBadgeDay}>
                  {new Date(item.eventStartDate).getDate()}
                </Text>
              </View>
            )}
            <View style={styles.eventInfo}>
              <Chip
                label={formatEventType(item.type)}
                variant="secondary"
                size="sm"
              />
              <Text style={styles.eventTitle} numberOfLines={2}>
                {item.title}
              </Text>
              {item.eventStartDate && (
                <View style={styles.eventDateRow}>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={colors.text.muted}
                  />
                  <Text style={styles.eventDateText}>
                    {formatDate(item.eventStartDate)} at{" "}
                    {formatTime(item.eventStartDate)}
                  </Text>
                </View>
              )}
              {item.description && (
                <Text style={styles.eventDesc} numberOfLines={2}>
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
// Event Detail Screen
// ──────────────────────────────────────────────

type EventDetailProps = NativeStackScreenProps<
  EventsStackParamList,
  "EventDetail"
>;

export function EventDetailScreen({ route }: EventDetailProps) {
  const { event } = route.params;

  const handleTicketPress = () => {
    if (event.ticketLink) {
      Linking.openURL(event.ticketLink);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.detailContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Image carousel */}
      {event.imageUrls && event.imageUrls.length > 0 ? (
        <FlatList
          data={event.imageUrls}
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
          <Ionicons name="calendar" size={56} color="rgba(255,255,255,0.3)" />
        </LinearGradient>
      )}

      <View style={styles.detailContent}>
        <Chip
          label={formatEventType(event.type)}
          variant="secondary"
          size="md"
          style={{ marginBottom: spacing.md }}
        />

        <Text style={styles.detailTitle}>{event.title}</Text>

        {/* Date & Time Info */}
        {event.eventStartDate && (
          <View style={styles.dateInfoCard}>
            <View style={styles.dateInfoRow}>
              <Ionicons name="calendar" size={20} color={colors.primary.main} />
              <View>
                <Text style={styles.dateInfoLabel}>Date</Text>
                <Text style={styles.dateInfoValue}>
                  {formatDate(event.eventStartDate)}
                  {event.eventEndDate && ` — ${formatDate(event.eventEndDate)}`}
                </Text>
              </View>
            </View>
            <View style={styles.dateInfoRow}>
              <Ionicons name="time" size={20} color={colors.primary.main} />
              <View>
                <Text style={styles.dateInfoLabel}>Time</Text>
                <Text style={styles.dateInfoValue}>
                  {formatTime(event.eventStartDate)}
                  {event.eventEndDate && ` — ${formatTime(event.eventEndDate)}`}
                </Text>
              </View>
            </View>
          </View>
        )}

        {event.description && (
          <Text style={styles.detailDescription}>{event.description}</Text>
        )}

        {event.ticketLink && (
          <Button
            title="Get Tickets"
            variant="contained"
            color="primary"
            size="lg"
            fullWidth
            icon={<Ionicons name="ticket" size={18} color="#fff" />}
            onPress={handleTicketPress}
            style={{ marginTop: spacing.xl }}
          />
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

  // Event card
  eventCard: {
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    backgroundColor: colors.background.paper,
  },
  eventImage: {
    width: "100%",
    height: 180,
  },
  gradientPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  dateBadge: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
    minWidth: 52,
    ...shadows.md,
  },
  dateBadgeMonth: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.xs,
    color: "rgba(255,255,255,0.85)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  dateBadgeDay: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes["2xl"],
    color: colors.text.light,
    lineHeight: 28,
  },
  eventInfo: {
    padding: spacing.base,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  eventTitle: {
    fontFamily: fonts.heading.family,
    fontSize: fontSizes.xl,
    color: colors.text.primary,
    lineHeight: 26,
  },
  eventDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  eventDateText: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.sm,
    color: colors.text.muted,
  },
  eventDesc: {
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
    height: 300,
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
  dateInfoCard: {
    backgroundColor: colors.background.cream,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    gap: spacing.base,
    marginBottom: spacing.xl,
  },
  dateInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  dateInfoLabel: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.xs,
    color: colors.text.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  dateInfoValue: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.md,
    color: colors.text.primary,
  },
  detailDescription: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.base,
    color: colors.text.secondary,
    lineHeight: 24,
  },
});
