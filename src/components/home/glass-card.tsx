import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { ReactNode } from "react";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { PremiumColors, PremiumRadius } from "@/constants/premium-theme";

type GlassCardProps = {
  children: ReactNode;
  style?: ViewStyle;
  enteringDelay?: number;
  variant?: "default" | "hero";
};

export function GlassCard({
  children,
  style,
  enteringDelay = 0,
  variant = "default",
}: GlassCardProps) {
  const useNativeGlass = Platform.OS === "ios" && isLiquidGlassAvailable();
  const isHero = variant === "hero";
  const cardStyle = isHero ? styles.heroCard : styles.card;

  const content = useNativeGlass ? (
    <GlassView
      glassEffectStyle="regular"
      colorScheme="dark"
      tintColor="rgba(17, 24, 39, 0.78)"
      style={[cardStyle, style]}
    >
      <View style={styles.topAccent} pointerEvents="none" />
      {children}
    </GlassView>
  ) : (
    <View style={[cardStyle, styles.fallback, style]}>
      <View style={styles.highlight} pointerEvents="none" />
      <View style={styles.topAccent} pointerEvents="none" />
      {children}
    </View>
  );

  return (
    <Animated.View
      style={styles.wrapper}
      entering={FadeInDown.delay(enteringDelay)
        .duration(600)
        .springify()
        .damping(18)}
    >
      {content}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  card: {
    borderRadius: PremiumRadius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PremiumColors.border,
    padding: 20,
    overflow: "hidden",
  },
  heroCard: {
    borderRadius: PremiumRadius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PremiumColors.borderStrong,
    paddingVertical: 28,
    paddingHorizontal: 24,
    overflow: "hidden",
  },
  fallback: {
    backgroundColor: PremiumColors.surfaceGlass,
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  highlight: {
    ...StyleSheet.absoluteFill,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  topAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: PremiumColors.gold,
    opacity: 0.92,
  },
});
