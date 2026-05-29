import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ApplicationCard } from '@/components/applications/application-card';
import { GlassCard } from '@/components/home/glass-card';
import { PremiumInput } from '@/components/ui/premium-input';
import { PremiumScreen } from '@/components/ui/premium-screen';
import { DAYS_EXTENDED_PER_APPROVAL } from '@/constants/uploads';
import { useApplications } from '@/contexts/applications-context';
import {
  PremiumColors,
  PremiumSpacing,
  PremiumTypography,
} from '@/constants/premium-theme';
import { ApplicationStatus } from '@/types/application';

const ADMIN_PIN = process.env.EXPO_PUBLIC_ADMIN_PIN ?? 'escape2026';

type FilterStatus = 'all' | ApplicationStatus;

export default function AdminScreen() {
  const {
    applications,
    loading,
    error,
    firebaseReady,
    approvedCount,
    reviewApplication,
  } = useApplications();

  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const filteredApplications = useMemo(() => {
    if (filter === 'all') return applications;
    return applications.filter((item) => item.status === filter);
  }, [applications, filter]);

  const pendingCount = applications.filter((item) => item.status === 'pending').length;

  const handleUnlock = () => {
    if (pin.trim() === ADMIN_PIN) {
      setUnlocked(true);
      return;
    }
    Alert.alert('Access denied', 'Invalid admin PIN.');
  };

  const handleReview = async (
    id: string,
    status: Exclude<ApplicationStatus, 'pending'>
  ) => {
    setReviewingId(id);
    try {
      await reviewApplication(id, status);
    } catch (reviewError) {
      const message =
        reviewError instanceof Error
          ? reviewError.message
          : 'Unable to update application status.';
      Alert.alert('Review failed', message);
    } finally {
      setReviewingId(null);
    }
  };

  if (!unlocked) {
    return (
      <PremiumScreen>
        <Text style={styles.overline}>Admin access</Text>
        <Text style={styles.title}>Review dashboard</Text>
        <Text style={styles.subtitle}>
          Enter the admin PIN to approve or reject uploaded job submissions.
        </Text>

        <GlassCard enteringDelay={0}>
          <PremiumInput
            label="Admin PIN"
            value={pin}
            onChangeText={setPin}
            placeholder="Enter PIN"
            secureTextEntry
            autoCapitalize="none"
          />
          <Pressable style={styles.unlockButton} onPress={handleUnlock}>
            <Text style={styles.unlockLabel}>Unlock dashboard</Text>
          </Pressable>
        </GlassCard>
      </PremiumScreen>
    );
  }

  return (
    <PremiumScreen>
      <Text style={styles.overline}>Operations</Text>
      <Text style={styles.title}>Admin review</Text>
      <Text style={styles.subtitle}>
        {approvedCount} approved · +{approvedCount * DAYS_EXTENDED_PER_APPROVAL} days
        added to countdown · {pendingCount} pending
      </Text>

      {!firebaseReady ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      <View style={styles.filters}>
        {(['all', 'pending', 'approved', 'rejected'] as FilterStatus[]).map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            style={[styles.filterChip, filter === item && styles.filterChipActive]}
          >
            <Text
              style={[
                styles.filterLabel,
                filter === item && styles.filterLabelActive,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={PremiumColors.textPrimary} style={styles.loader} />
      ) : null}

      {filteredApplications.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          showReviewActions
          reviewingId={reviewingId}
          onApprove={(id) => handleReview(id, 'approved')}
          onReject={(id) => handleReview(id, 'rejected')}
        />
      ))}

      {!loading && filteredApplications.length === 0 ? (
        <Text style={styles.empty}>No job submissions in this view.</Text>
      ) : null}
    </PremiumScreen>
  );
}

const styles = StyleSheet.create({
  overline: {
    ...PremiumTypography.overline,
    marginBottom: PremiumSpacing.sm,
  },
  title: {
    ...PremiumTypography.title,
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: 0,
    marginBottom: PremiumSpacing.sm,
  },
  subtitle: {
    ...PremiumTypography.subtitle,
    marginBottom: PremiumSpacing.lg,
  },
  error: {
    ...PremiumTypography.body,
    color: PremiumColors.redLight,
    marginBottom: 16,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  filterChip: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PremiumColors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: PremiumColors.cyanSoft,
    borderColor: PremiumColors.cyan,
  },
  filterLabel: {
    ...PremiumTypography.caption,
    color: PremiumColors.textTertiary,
  },
  filterLabelActive: {
    color: PremiumColors.cyan,
  },
  loader: {
    marginVertical: 24,
  },
  empty: {
    ...PremiumTypography.body,
    color: PremiumColors.textTertiary,
  },
  unlockButton: {
    backgroundColor: PremiumColors.cyan,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  unlockLabel: {
    ...PremiumTypography.nav,
    color: '#061018',
    fontSize: 11,
  },
});
