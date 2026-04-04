import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
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
import { SectionHeader, Button } from "../components";
import { newsletterApi } from "../services/api";

export function NewsletterScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const insets = useSafeAreaInsets();

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubscribe = useCallback(async () => {
    if (!isValidEmail) return;
    try {
      setLoading(true);
      await newsletterApi.subscribe(email.trim());
      setSubscribed(true);
      setEmail("");
    } catch (e: any) {
      Alert.alert(
        "Oops",
        e.message || "Failed to subscribe. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [email, isValidEmail]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing["3xl"] },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header illustration */}
        <View style={styles.illustration}>
          <View style={styles.iconCircle}>
            <Ionicons
              name={subscribed ? "checkmark-circle" : "mail"}
              size={48}
              color={subscribed ? colors.status.success : colors.primary.main}
            />
          </View>
        </View>

        {subscribed ? (
          <View style={styles.successSection}>
            <SectionHeader
              subtitle="Thank You!"
              title="You're Subscribed"
              description="Welcome to the Corrado's family! You'll receive our latest news, events, and special offers directly in your inbox."
              align="center"
            />
            <Button
              title="Subscribe Another Email"
              onPress={() => setSubscribed(false)}
              variant="outlined"
              color="primary"
              style={styles.anotherButton}
            />
          </View>
        ) : (
          <>
            <SectionHeader
              subtitle="Stay Connected"
              title="Join Our Newsletter"
              description="Be the first to know about exclusive specials, upcoming events, and new menu items at Corrado's."
              align="center"
            />

            {/* Features list */}
            <View style={styles.featuresList}>
              {[
                {
                  icon: "restaurant-outline",
                  text: "New menu items & seasonal dishes",
                },
                {
                  icon: "pricetag-outline",
                  text: "Exclusive specials & offers",
                },
                {
                  icon: "calendar-outline",
                  text: "Upcoming events & live music",
                },
                { icon: "gift-outline", text: "Birthday & holiday surprises" },
              ].map((item, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureIconBg}>
                    <Ionicons
                      name={item.icon as any}
                      size={18}
                      color={colors.primary.main}
                    />
                  </View>
                  <Text style={styles.featureText}>{item.text}</Text>
                </View>
              ))}
            </View>

            {/* Email input */}
            <View style={[styles.inputCard, shadows.md]}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputRow}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.text.muted}
                />
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor={colors.text.muted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleSubscribe}
                />
              </View>

              <Button
                title="Subscribe"
                onPress={handleSubscribe}
                loading={loading}
                disabled={!isValidEmail}
                variant="contained"
                color="primary"
                size="lg"
                fullWidth
                icon="paper-plane-outline"
                style={styles.subscribeButton}
              />

              <Text style={styles.disclaimer}>
                We respect your privacy. Unsubscribe anytime.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: spacing["2xl"],
  },
  illustration: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary.main + "12",
    justifyContent: "center",
    alignItems: "center",
  },
  successSection: {
    alignItems: "center",
  },
  anotherButton: {
    marginTop: spacing.xl,
  },
  featuresList: {
    marginTop: spacing.xl,
    marginBottom: spacing["2xl"],
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  featureIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary.main + "12",
    justifyContent: "center",
    alignItems: "center",
  },
  featureText: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.base,
    color: colors.text.secondary,
    flex: 1,
  },
  inputCard: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  inputLabel: {
    fontFamily: fonts.body.familyBold,
    fontSize: fontSizes.sm,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.default,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.base,
  },
  input: {
    flex: 1,
    fontFamily: fonts.body.family,
    fontSize: fontSizes.base,
    color: colors.text.primary,
    paddingVertical: spacing.md,
    marginLeft: spacing.sm,
  },
  subscribeButton: {
    marginTop: spacing.xs,
  },
  disclaimer: {
    fontFamily: fonts.body.family,
    fontSize: fontSizes.xs,
    color: colors.text.muted,
    textAlign: "center",
    marginTop: spacing.md,
  },
});
