import { StyleSheet, Text, View } from "react-native";

import { PremiumColors, PremiumTypography } from "@/constants/premium-theme";
import { ApplicationStatus } from "@/types/application";

const STATUS_STYLES: Record<
  ApplicationStatus,
  { label: string; color: string; background: string; border: string }
> = {
  pending: {
    label: "Pending",
    color: PremiumColors.goldLight,
    background: PremiumColors.goldSoft,
    border: PremiumColors.border,
  },
  approved: {
    label: "Approved",
    color: PremiumColors.goldLight,
    background: PremiumColors.goldSoft,
    border: PremiumColors.borderStrong,
  },
  rejected: {
    label: "Rejected",
    color: PremiumColors.redLight,
    background: PremiumColors.redSoft,
    border: PremiumColors.redGlow,
  },
};

type StatusBadgeProps = {
  status: ApplicationStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const palette = STATUS_STYLES[status];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
        },
      ]}
    >
      <Text style={[styles.label, { color: palette.color }]}>
        {palette.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: "flex-start",
  },
  label: {
    ...PremiumTypography.caption,
    fontSize: 10,
    letterSpacing: 0,
  },
});
