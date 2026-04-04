import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  colors,
  fonts,
  fontSizes,
  spacing,
  borderRadius,
  shadows,
} from "../theme";
import {
  SectionHeader,
  LoadingView,
  ErrorView,
  EmptyView,
} from "../components";
import { openingHoursApi } from "../services/api";
import type { OpeningHours, DayOfWeek } from "../types";

const DAY_ORDER: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const JS_DAY_MAP: Record<number, DayOfWeek> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const h = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${h}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function OpeningHoursScreen() {
  const [hours, setHours] = useState<OpeningHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const today = JS_DAY_MAP[new Date().getDay()];

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const data = await openingHoursApi.getAll();
      setHours(
        data.sort(
          (a, b) =>
            DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek),
        ),
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

  if (loading) return <LoadingView message="Loading hours..." />;
  if (error) return <ErrorView message={error} onRetry={fetchData} />;
  if (hours.length === 0) {
    return (
      <EmptyView
        icon="time-outline"
        title="Hours not available"
        message="Please check back later"
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={hours}
        keyExtractor={(item) => item.dayOfWeek}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + spacing["3xl"] },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.main}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <SectionHeader
              subtitle="Visit Us"
              title="Opening Hours"
              description="We look forward to welcoming you"
              align="center"
            />
          </View>
        }
        renderItem={({ item }) => {
          const isToday = item.dayOfWeek === today;
          return (
            <View
              style={[
                styles.dayCard,
                isToday && styles.dayCardToday,
                shadows.sm,
              ]}
            >
              {/* Today badge */}
              {isToday && (
                <View style={styles.todayBadge}>
                  <Text style={styles.todayBadgeText}>TODAY</Text>
                </View>
              )}

              <View style={styles.dayRow}>
                <View style={styles.dayInfo}>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={isToday ? colors.primary.main : colors.text.muted}
                    style={styles.dayIcon}
                  />
                  <Text
                    style={[styles.dayName, isToday && styles.dayNameToday]}
                  >
                    {DAY_LABELS[item.dayOfWeek]}
                  </Text>
                </View>

                {item.isOpen ? (
                  <View style={styles.timeInfo}>
                    <Text
                      style={[styles.timeText, isToday && styles.timeTextToday]}
                    >
                      {formatTime(item.openTime)} – {formatTime(item.closeTime)}
                    </Text>
                    <View style={[styles.statusDot, styles.statusOpen]} />
                  </View>
                ) : (
                  <View style={styles.timeInfo}>
                    <Text style={styles.closedText}>Closed</Text>
                    <View style={[styles.statusDot, styles.statusClosed]} />
                  </View>
                )}
              </View>

              {item.specialNote ? (
                <View style={styles.noteContainer}>
                  <Ionicons
                    name="information-circle-outline"
                    size={14}
                    color={colors.custom.gold}
                  />
                  <Text style={styles.noteText}>{item.specialNote}</Text>
                </View>
              ) : null}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  listContent: {
    padding: spacing.base,
  },
  header: {
    marginBottom: spacing.xl,
    paddingTop: spacing.base,
  },
  dayCard: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  dayCardToday: {
    borderColor: colors.primary.main,
    borderWidth: 1.5,
    backgroundColor: colors.primary.main + "08",
  },
  todayBadge: {
    position: "absolute",
    top: -1,
    right: spacing.base,
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs / 2,
    borderBottomLeftRadius: borderRadius.sm,
    borderBottomRightRadius: borderRadius.sm,
  },
  todayBadgeText: {
    fontFamily: fonts.body.familyBold,
    fontSize: fontSizes.xs,
    color: "#fff",
    letterSpacing: 1,
  },
  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  dayIcon: {
    marginRight: spacing.sm,
  },
  dayName: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.base,
    color: colors.text.primary,
  },
  dayNameToday: {
    fontFamily: fonts.body.familyBold,
    color: colors.primary.main,
  },
  timeInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.base,
    color: colors.text.secondary,
    marginRight: spacing.sm,
  },
  timeTextToday: {
    fontFamily: fonts.body.familyBold,
    color: colors.primary.main,
  },
  closedText: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.base,
    color: colors.text.muted,
    marginRight: spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusOpen: {
    backgroundColor: colors.status.success,
  },
  statusClosed: {
    backgroundColor: colors.status.error,
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  noteText: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.sm,
    color: colors.custom.gold,
    fontStyle: "italic",
    flex: 1,
  },
});
