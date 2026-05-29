import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

import {
    PremiumColors,
    PremiumRadius,
    PremiumTypography,
} from "@/constants/premium-theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PremiumButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
};

export function PremiumButton({
  label,
  onPress,
  variant = "primary",
  style,
}: PremiumButtonProps) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - pressed.value * 0.15,
    transform: [{ scale: 1 - pressed.value * 0.02 }],
  }));

  const isPrimary = variant === "primary";

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        pressed.value = withSpring(1, { damping: 16 });
      }}
      onPressOut={() => {
        pressed.value = withSpring(0, { damping: 16 });
      }}
      style={[
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        animatedStyle,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          isPrimary ? styles.primaryLabel : styles.secondaryLabel,
        ]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    minHeight: 50,
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderRadius: PremiumRadius.button,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  primary: {
    backgroundColor: PremiumColors.gold,
    shadowColor: PremiumColors.gold,
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  secondary: {
    backgroundColor: PremiumColors.surfacePressed,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PremiumColors.gold,
  },
  label: {
    ...PremiumTypography.nav,
    fontSize: 11,
    letterSpacing: 0,
  },
  primaryLabel: {
    color: "#061018",
  },
  secondaryLabel: {
    color: PremiumColors.textPrimary,
  },
});
