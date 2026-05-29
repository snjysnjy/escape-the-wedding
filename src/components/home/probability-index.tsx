import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

import { PremiumColors, PremiumTypography } from "@/constants/premium-theme";

type ProbabilityIndexProps = {
  percent: number;
  descriptor: string;
};

export function ProbabilityIndex({
  percent,
  descriptor,
}: ProbabilityIndexProps) {
  const fill = useSharedValue(0);

  useEffect(() => {
    fill.value = withTiming(percent / 100, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [fill, percent]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${fill.value * 100}%`,
  }));

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.overline}>Marriage Probability Index</Text>
        <Text style={styles.value}>{percent}%</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyle]} />
      </View>
      <Text style={styles.descriptor}>{descriptor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  overline: {
    ...PremiumTypography.overline,
    flex: 1,
    paddingRight: 12,
  },
  value: {
    ...PremiumTypography.metricValue,
    fontSize: 36,
    color: PremiumColors.goldLight,
  },
  track: {
    height: 3,
    borderRadius: 999,
    backgroundColor: PremiumColors.probabilityTrack,
    overflow: "hidden",
    marginBottom: 14,
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: PremiumColors.probability,
    shadowColor: PremiumColors.gold,
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  descriptor: {
    ...PremiumTypography.body,
    color: PremiumColors.goldDark,
    fontSize: 13,
  },
});
