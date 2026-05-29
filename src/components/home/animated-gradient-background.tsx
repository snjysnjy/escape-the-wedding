import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

import { PremiumColors } from "@/constants/premium-theme";

export function AnimatedGradientBackground() {
  const breathe = useSharedValue(0);

  useEffect(() => {
    breathe.value = withRepeat(
      withTiming(1, { duration: 20000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [breathe]);

  const washStyle = useAnimatedStyle(() => ({
    opacity: interpolate(breathe.value, [0, 1], [0.54, 0.88]),
    transform: [
      {
        translateY: interpolate(breathe.value, [0, 1], [-18, 18]),
      },
    ],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.base} />
      <View style={styles.topBand} />
      <Animated.View style={[styles.signalBand, washStyle]} />
      <View style={styles.gridLines} />
      <View style={styles.vignette} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFill,
    backgroundColor: PremiumColors.background,
  },
  topBand: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 320,
    backgroundColor: PremiumColors.gradientTop,
  },
  signalBand: {
    position: "absolute",
    top: 96,
    left: -40,
    right: -40,
    height: 260,
    backgroundColor: PremiumColors.goldGlow,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: PremiumColors.goldGlow,
    transform: [{ rotate: "-7deg" }],
  },
  gridLines: {
    ...StyleSheet.absoluteFill,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: PremiumColors.goldGlow,
    backgroundColor: "rgba(0,0,0,0.04)",
  },
  vignette: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
});
