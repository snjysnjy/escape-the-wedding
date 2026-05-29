import { Platform, TextStyle } from "react-native";

/** Tailored dark palette with warm signal accents. */
export const PremiumColors = {
  background: "#020202",
  backgroundElevated: "#070707",
  surface: "#121212",
  surfaceGlass: "rgba(20, 20, 20, 0.82)",
  surfacePressed: "rgba(255, 255, 255, 0.04)",
  border: "rgba(244, 201, 93, 0.16)",
  borderStrong: "rgba(244, 201, 93, 0.28)",
  textPrimary: "#F8F3E8",
  textSecondary: "rgba(244, 233, 200, 0.88)",
  textTertiary: "rgba(244, 201, 93, 0.72)",
  textMuted: "rgba(244, 201, 93, 0.4)",
  gold: "#F4C95D",
  goldLight: "#FFE8A3",
  goldDark: "#B58B2B",
  goldSoft: "rgba(244, 201, 93, 0.14)",
  goldGlow: "rgba(244, 201, 93, 0.18)",
  teal: "#B89447",
  tealSoft: "rgba(184, 148, 71, 0.16)",
  cyan: "#D4B35D",
  cyanSoft: "rgba(212, 179, 93, 0.12)",
  red: "#EE6F74",
  redLight: "#F6A8AB",
  redSoft: "rgba(238, 111, 116, 0.14)",
  redGlow: "rgba(238, 111, 116, 0.24)",
  probability: "#F4C95D",
  probabilityTrack: "rgba(244, 201, 93, 0.18)",
  gradientTop: "#050503",
  gradientMiddle: "#110d0a",
  gradientBottom: "#020202",
} as const;

export const PremiumSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 40,
} as const;

export const PremiumRadius = {
  card: 8,
  button: 8,
  pill: 999,
} as const;

export const PremiumTypography = {
  nav: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0,
    textTransform: "uppercase",
    color: PremiumColors.textTertiary,
  } satisfies TextStyle,
  navActive: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0,
    textTransform: "uppercase",
    color: PremiumColors.goldLight,
  } satisfies TextStyle,
  overline: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0,
    textTransform: "uppercase",
    color: PremiumColors.goldLight,
  } satisfies TextStyle,
  hero: {
    fontSize: Platform.select({ android: 68, default: 80 }),
    fontWeight: "200",
    letterSpacing: 0,
    color: PremiumColors.goldLight,
  } satisfies TextStyle,
  heroUnit: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0,
    textTransform: "uppercase",
    color: PremiumColors.goldLight,
  } satisfies TextStyle,
  countdownRow: {
    fontSize: Platform.select({ android: 28, default: 32 }),
    fontWeight: "300",
    letterSpacing: 0,
    color: PremiumColors.textPrimary,
    fontVariant: ["tabular-nums"],
  } satisfies TextStyle,
  title: {
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: 0,
    color: PremiumColors.textPrimary,
  } satisfies TextStyle,
  display: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0,
    textTransform: "uppercase",
    color: PremiumColors.gold,
  } satisfies TextStyle,
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 23,
    color: PremiumColors.textSecondary,
  } satisfies TextStyle,
  metricValue: {
    fontSize: 42,
    fontWeight: "200",
    letterSpacing: 0,
    color: PremiumColors.goldLight,
  } satisfies TextStyle,
  body: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 21,
    color: PremiumColors.textSecondary,
  } satisfies TextStyle,
  status: {
    fontSize: 20,
    fontWeight: "500",
    letterSpacing: 0,
    lineHeight: 28,
    color: PremiumColors.textPrimary,
  } satisfies TextStyle,
  caption: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0,
    textTransform: "uppercase",
    color: PremiumColors.textTertiary,
  } satisfies TextStyle,
};
