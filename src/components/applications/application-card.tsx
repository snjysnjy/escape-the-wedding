import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '@/components/applications/status-badge';
import { PremiumColors, PremiumTypography } from '@/constants/premium-theme';
import { ApplicationRecord } from '@/types/application';

type ApplicationCardProps = {
  application: ApplicationRecord;
  showReviewActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  reviewingId?: string | null;
};

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ApplicationCard({
  application,
  showReviewActions = false,
  onApprove,
  onReject,
  reviewingId,
}: ApplicationCardProps) {
  const isReviewing = reviewingId === application.id;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titles}>
          <Text style={styles.company}>{application.companyName}</Text>
          <Text style={styles.role}>{application.roleAppliedFor}</Text>
        </View>
        <StatusBadge status={application.status} />
      </View>

      <Text style={styles.meta}>
        Submitted {formatDate(application.createdAt)} · {application.fileName}
      </Text>

      <Pressable onPress={() => Linking.openURL(application.fileUrl)}>
        <Text style={styles.link}>View uploaded file</Text>
      </Pressable>

      {showReviewActions && application.status === 'pending' ? (
        <View style={styles.actions}>
          <Pressable
            disabled={isReviewing}
            style={[styles.actionButton, styles.approve]}
            onPress={() => onApprove?.(application.id)}
          >
            <Text style={styles.actionLabel}>Approve</Text>
          </Pressable>
          <Pressable
            disabled={isReviewing}
            style={[styles.actionButton, styles.reject]}
            onPress={() => onReject?.(application.id)}
          >
            <Text style={[styles.actionLabel, styles.rejectLabel]}>Reject</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PremiumColors.border,
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  titles: {
    flex: 1,
  },
  company: {
    ...PremiumTypography.status,
    fontSize: 18,
    marginBottom: 4,
  },
  role: {
    ...PremiumTypography.body,
    color: PremiumColors.textSecondary,
  },
  meta: {
    ...PremiumTypography.body,
    fontSize: 12,
    color: PremiumColors.textTertiary,
    marginBottom: 8,
  },
  link: {
    ...PremiumTypography.body,
    color: PremiumColors.cyan,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  approve: {
    backgroundColor: PremiumColors.cyan,
  },
  reject: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PremiumColors.redGlow,
    backgroundColor: PremiumColors.redSoft,
  },
  actionLabel: {
    ...PremiumTypography.nav,
    fontSize: 11,
    color: '#061018',
  },
  rejectLabel: {
    color: PremiumColors.redLight,
  },
});
