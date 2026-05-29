import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApplicationCard } from '@/components/applications/application-card';
import { AnimatedGradientBackground } from '@/components/home/animated-gradient-background';
import { GlassCard } from '@/components/home/glass-card';
import { LuxuryHeader, SectionNav } from '@/components/home/luxury-header';
import { PremiumButton } from '@/components/home/premium-button';
import { ProbabilityIndex } from '@/components/home/probability-index';
import { DAYS_EXTENDED_PER_APPROVAL } from '@/constants/uploads';
import {
  PremiumColors,
  PremiumSpacing,
  PremiumTypography,
} from '@/constants/premium-theme';
import { useApplications } from '@/contexts/applications-context';
import { useCountdown } from '@/hooks/use-countdown';
import {
  getMarriageProbability,
  getProbabilityDescriptor,
} from '@/lib/marriage-probability';

const FAMILY_STATUSES = [
  'Relative network activated',
  'Biodata pipeline in progress',
  'Professional profile surveillance',
  'Ceremony logistics under review',
  'Compensation inquiry pending',
  'Extended family sync in progress',
  'Marital candidate shortlist updated',
] as const;

type SectionId = 'countdown' | 'probability' | 'monitoring' | 'applications';

function padTime(value: number) {
  return String(Math.max(0, value)).padStart(2, '0');
}

export default function HomeScreen() {
  const {
    applications,
    extensionDays,
    approvedCount,
    loading: applicationsLoading,
    error: applicationsError,
  } = useApplications();
  const { timeLeft, targetDate } = useCountdown(extensionDays);
  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<SectionId, number>>({
    countdown: 0,
    probability: 0,
    monitoring: 0,
    applications: 0,
  });

  const [activeSection, setActiveSection] = useState<SectionId>('countdown');
  const [monitorIndex, setMonitorIndex] = useState(0);
  const [delayCount, setDelayCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMonitorIndex((prev) => (prev + 1) % FAMILY_STATUSES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const mitigation = Math.min(35, approvedCount * 4 + delayCount * 5);
  const probability = getMarriageProbability(timeLeft.days, mitigation);
  const probabilityLabel = useMemo(
    () => getProbabilityDescriptor(probability),
    [probability]
  );

  const handleSectionLayout = useCallback(
    (section: SectionId) => (event: LayoutChangeEvent) => {
      sectionOffsets.current[section] = event.nativeEvent.layout.y;
    },
    []
  );

  const scrollToSection = useCallback((section: SectionId) => {
    setActiveSection(section);
    scrollRef.current?.scrollTo({
      y: Math.max(sectionOffsets.current[section] - 24, 0),
      animated: true,
    });
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollY = event.nativeEvent.contentOffset.y + 120;
      const offsets = sectionOffsets.current;

      if (scrollY >= offsets.applications) {
        setActiveSection('applications');
      } else if (scrollY >= offsets.monitoring) {
        setActiveSection('monitoring');
      } else if (scrollY >= offsets.probability) {
        setActiveSection('probability');
      } else {
        setActiveSection('countdown');
      }
    },
    []
  );

  const targetLabel = targetDate.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={styles.root}>
      <AnimatedGradientBackground />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView
          ref={scrollRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <LuxuryHeader />
          <SectionNav active={activeSection} onSelect={scrollToSection} />

          <Animated.View entering={FadeIn.duration(800)} style={styles.intro}>
            <Text style={styles.kicker}>Live escape status</Text>
            <Text style={styles.subtitle}>
              Track the countdown, submit proof, and turn every approved
              application into another clean delay.
            </Text>
          </Animated.View>

          <View onLayout={handleSectionLayout('countdown')}>
            <GlassCard enteringDelay={100} variant="hero">
              <Text style={styles.sectionLabel}>Time remaining</Text>
              <View style={styles.heroBlock}>
                <Text style={styles.heroDays}>{timeLeft.days}</Text>
                <Text style={styles.heroUnit}>days</Text>
              </View>
              <View style={styles.countdownRow}>
                <Text style={styles.countdownDigits}>
                  {padTime(timeLeft.hours)}
                </Text>
                <Text style={styles.countdownSep}>:</Text>
                <Text style={styles.countdownDigits}>
                  {padTime(timeLeft.minutes)}
                </Text>
                <Text style={styles.countdownSep}>:</Text>
                <Text style={styles.countdownDigits}>
                  {padTime(timeLeft.seconds)}
                </Text>
              </View>
              <Text style={styles.targetDate}>Target · {targetLabel}</Text>
              {extensionDays > 0 ? (
                <Text style={styles.extensionNote}>
                  +{extensionDays} days secured · {approvedCount} approved
                </Text>
              ) : null}
              <View style={styles.heroStats}>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatValue}>{approvedCount}</Text>
                  <Text style={styles.heroStatLabel}>Approved</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatValue}>{applications.length}</Text>
                  <Text style={styles.heroStatLabel}>Submitted</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatValue}>{delayCount}</Text>
                  <Text style={styles.heroStatLabel}>Manual delays</Text>
                </View>
              </View>
            </GlassCard>
          </View>

          <View onLayout={handleSectionLayout('probability')}>
            <GlassCard enteringDelay={180}>
              <ProbabilityIndex
                percent={probability}
                descriptor={probabilityLabel}
              />
            </GlassCard>
          </View>

          <View onLayout={handleSectionLayout('monitoring')}>
            <GlassCard enteringDelay={240}>
              <Text style={styles.sectionLabel}>Family monitoring</Text>
              <Animated.Text
                key={monitorIndex}
                entering={FadeInUp.duration(450)}
                style={styles.monitorStatus}
              >
                {FAMILY_STATUSES[monitorIndex]}
              </Animated.Text>
              <Text style={styles.monitorMeta}>Signal active · under surveillance</Text>
            </GlassCard>
          </View>

          <View onLayout={handleSectionLayout('applications')}>
            <GlassCard enteringDelay={300}>
              <Text style={styles.sectionLabel}>Your applications</Text>
              {applicationsError ? (
                <Text style={styles.errorText}>{applicationsError}</Text>
              ) : null}
              {applicationsLoading ? (
                <Text style={styles.monitorMeta}>Loading submissions…</Text>
              ) : null}
              {!applicationsLoading && applications.length === 0 ? (
                <Text style={styles.monitorMeta}>
                  No uploads yet. Each approved application extends the countdown
                  by {DAYS_EXTENDED_PER_APPROVAL} days.
                </Text>
              ) : null}
              {applications.slice(0, 5).map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </GlassCard>
          </View>

          <View style={styles.actions}>
            <PremiumButton
              label="Upload Applications"
              variant="primary"
              onPress={() => router.push('/upload')}
            />
            <PremiumButton
              label="Delay Wedding"
              variant="secondary"
              onPress={() => setDelayCount((c) => c + 1)}
            />
          </View>

          <Text style={styles.footer}>
            {applications.length > 0
              ? `${applications.length} submission${applications.length === 1 ? '' : 's'} · Pending / Approved / Rejected`
              : 'Submit proof on the Upload tab. Admin review controls extensions.'}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PremiumColors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: PremiumSpacing.lg,
    paddingTop: Platform.OS === 'android' ? PremiumSpacing.md : PremiumSpacing.sm,
    paddingBottom: Platform.OS === 'android' ? 48 : PremiumSpacing.xxl,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  intro: {
    marginBottom: PremiumSpacing.md,
  },
  kicker: {
    ...PremiumTypography.overline,
    marginBottom: PremiumSpacing.sm,
  },
  subtitle: {
    ...PremiumTypography.subtitle,
    maxWidth: 380,
  },
  sectionLabel: {
    ...PremiumTypography.overline,
    marginBottom: PremiumSpacing.lg,
  },
  heroBlock: {
    alignItems: 'center',
    marginBottom: PremiumSpacing.md,
  },
  heroDays: {
    ...PremiumTypography.hero,
    lineHeight: Platform.select({ android: 72, default: 84 }),
    textAlign: 'center',
  },
  heroUnit: {
    ...PremiumTypography.heroUnit,
    marginTop: 4,
  },
  countdownRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: PremiumSpacing.md,
  },
  countdownDigits: {
    ...PremiumTypography.countdownRow,
  },
  countdownSep: {
    ...PremiumTypography.countdownRow,
    color: PremiumColors.cyan,
    paddingHorizontal: 8,
  },
  targetDate: {
    ...PremiumTypography.caption,
    textAlign: 'center',
    color: PremiumColors.textTertiary,
  },
  extensionNote: {
    ...PremiumTypography.body,
    fontSize: 13,
    color: PremiumColors.gold,
    textAlign: 'center',
    marginTop: 10,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: PremiumColors.border,
    marginTop: PremiumSpacing.lg,
    paddingTop: PremiumSpacing.md,
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  heroStatDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: PremiumColors.border,
  },
  heroStatValue: {
    ...PremiumTypography.status,
    color: PremiumColors.textPrimary,
    fontSize: 18,
    lineHeight: 22,
  },
  heroStatLabel: {
    ...PremiumTypography.caption,
    color: PremiumColors.textTertiary,
    fontSize: 10,
    textAlign: 'center',
  },
  errorText: {
    ...PremiumTypography.body,
    color: PremiumColors.redLight,
    marginBottom: 10,
  },
  monitorStatus: {
    ...PremiumTypography.status,
    color: PremiumColors.textPrimary,
    marginBottom: PremiumSpacing.sm,
  },
  monitorMeta: {
    ...PremiumTypography.body,
    fontSize: 13,
    color: PremiumColors.textTertiary,
  },
  actions: {
    marginTop: PremiumSpacing.sm,
    marginBottom: PremiumSpacing.md,
  },
  footer: {
    ...PremiumTypography.body,
    fontSize: 13,
    color: PremiumColors.textTertiary,
    marginBottom: PremiumSpacing.xl,
  },
});
