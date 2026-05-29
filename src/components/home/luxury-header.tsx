import { Pressable, StyleSheet, Text, View } from "react-native";

import { PremiumColors, PremiumTypography } from "@/constants/premium-theme";

export function LuxuryHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.emblem}>
          <Text style={styles.emblemMark}>EW</Text>
        </View>
        <View style={styles.brandStack}>
          <Text style={styles.brand}>Escape The Wedding</Text>
          <Text style={styles.brandMeta}>Application-led delay operations</Text>
        </View>
      </View>
    </View>
  );
}

type SectionNavProps = {
  active: "countdown" | "probability" | "monitoring" | "applications";
  onSelect: (
    section: "countdown" | "probability" | "monitoring" | "applications",
  ) => void;
};

const SECTIONS = [
  { id: "countdown" as const, label: "Countdown" },
  { id: "probability" as const, label: "Probability" },
  { id: "monitoring" as const, label: "Monitoring" },
  { id: "applications" as const, label: "Uploads" },
];

export function SectionNav({ active, onSelect }: SectionNavProps) {
  return (
    <View style={styles.nav}>
      {SECTIONS.map((section) => {
        const isActive = active === section.id;
        return (
          <Pressable
            key={section.id}
            onPress={() => onSelect(section.id)}
            style={[styles.navItem, isActive && styles.navItemActive]}
          >
            <Text style={isActive ? styles.navActive : styles.navLabel}>
              {section.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 18,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  emblem: {
    width: 42,
    height: 42,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PremiumColors.goldLight,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PremiumColors.goldSoft,
  },
  emblemMark: {
    ...PremiumTypography.navActive,
    color: PremiumColors.goldDark,
    fontSize: 12,
  },
  brandStack: {
    flex: 1,
  },
  brand: {
    ...PremiumTypography.display,
    fontSize: 13,
    color: PremiumColors.textPrimary,
    marginBottom: 3,
    flex: 1,
  },
  brandMeta: {
    ...PremiumTypography.body,
    color: PremiumColors.goldLight,
    fontSize: 12,
    lineHeight: 16,
  },
  nav: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 24,
    padding: 4,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PremiumColors.border,
    backgroundColor: "rgba(17, 24, 39, 0.72)",
  },
  navItem: {
    flex: 1,
    minHeight: 36,
    paddingHorizontal: 8,
    paddingVertical: 9,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  navItemActive: {
    backgroundColor: PremiumColors.cyanSoft,
  },
  navLabel: {
    ...PremiumTypography.nav,
    fontSize: 9,
  },
  navActive: {
    ...PremiumTypography.navActive,
    color: PremiumColors.cyan,
    fontSize: 9,
  },
});
