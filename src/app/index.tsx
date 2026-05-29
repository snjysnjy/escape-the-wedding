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
import Animated, { FadeIn, FadeInUp, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApplicationCard } from '@/components/applications/application-card';
import { AnimatedGradientBackground } from '@/components/home/animated-gradient-background';
import { GlassCard } from '@/components/home/glass-card';
import { LuxuryHeader, SectionNav } from '@/components/home/luxury-header';
import { PremiumButton } from '@/components/home/premium-button';
import { ProbabilityIndex } from '@/components/home/probability-index';
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
  'Kundali matching initiated',
] as const;

type SectionId = 'countdown' | 'probability' | 'monitoring' | 'applications';

const BRIDAL_AVATAR = require('@/assets/images/avatar-bridal.png');
const CORPORATE_AVATAR = require('@/assets/images/avatar-corporate.png');

function padTime(value: number) {
  return String(Math.max(0, value)).padStart(2, '0');
}

export default function HomeScreen() {
  const {
    applications,
    loading: applicationsLoading,
    error: applicationsError,
  } = useApplications();
  
  // Custom Logic for your specific rules
  const approvedSubmissions = applications.filter(a => a.status === 'approved' && a.type === 'application').length;
  const approvedOffers = applications.filter(a => a.status === 'approved' && a.type === 'offer').length;
  
  // Rule: 10 job submissions = 14 days, 2 offers = 30 days
  const extensionDays = (Math.floor(approvedSubmissions / 10) * 14) + (Math.floor(approvedOffers / 2) * 30);
  
  // Force target date to July 24, 2026 as requested
  const baseTargetDate = new Date('2026-07-24T00:00:00');
  const targetDateWithExtensions = new Date(baseTargetDate.getTime() + (extensionDays * 24 * 60 * 60 * 1000));
  
  const { timeLeft } = useCountdown(extensionDays);

  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<SectionId, number>>({
    countdown: 0,
    probability: 0,
    monitoring: 0,
    applications: 0,
  });

  const [activeSection, setActiveSection] = useState<SectionId>('countdown');
  const [monitorIndex, setMonitorIndex] = useState(0);
  const [isCorporate, setIsCorporate] = useState(true);

  // Toggle Persona Animation Logic
  useEffect(() => {
    const personaTimer = setInterval(() => {
      setIsCorporate((prev) => !prev);
    }, 3000);
    return () => clearInterval(personaTimer);
  }, []);

  const corporateStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isCorporate ? 1 : 0, { duration: 1000 }),
    transform: [{ scale: withTiming(isCorporate ? 1 : 1.1, { duration: 1000 }) }]
  }));

  const shaadiStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isCorporate ? 0 : 1, { duration: 1000 }),
    transform: [{ scale: withTiming(isCorporate ? 1.1 : 1, { duration: 1000 }) }]
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setMonitorIndex((prev) => (prev + 1) % FAMILY_STATUSES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const totalApproved = approvedSubmissions + approvedOffers;
  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const submissionsTowardExtension = approvedSubmissions % 10;
  const offersTowardExtension = approvedOffers % 2;
  const submissionsNeeded = 10 - submissionsTowardExtension;
  const offersNeeded = 2 - offersTowardExtension;
  const submissionProgress = Math.min(100, (submissionsTowardExtension / 10) * 100);
  const offerProgress = Math.min(100, (offersTowardExtension / 2) * 100);
  const mitigation = Math.min(35, totalApproved * 4);
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

  const targetLabel = targetDateWithExtensions.toLocaleDateString(undefined, {
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

          <View onLayout={handleSectionLayout('countdown')}>
            <Animated.View entering={FadeIn.duration(800)} style={styles.openingHero}>
              <View style={styles.avatarStage}>
                <View style={styles.avatarGlow} />
                <View style={styles.avatarContainer}>
                  <Animated.Image
                    source={BRIDAL_AVATAR}
                    style={[styles.avatarImg, shaadiStyle]}
                  />
                  <Animated.Image
                    source={CORPORATE_AVATAR}
                    style={[styles.avatarImg, corporateStyle]}
                  />
                </View>
                <Text style={[styles.personaLabel, { color: isCorporate ? PremiumColors.cyan : PremiumColors.gold }]}>
                  {isCorporate ? 'Corporate Mode' : 'Shaadi Risk Mode'}
                </Text>
              </View>

              <View style={styles.heroCopy}>
                <Text style={styles.kicker}>Wedding Deferral Command</Text>
                <Text style={styles.mobileHeroTitle}>
                  {timeLeft.days} days to secure employment
                </Text>
                <Text style={styles.mobileHeroSubtitle}>
                  Deadline: {targetLabel}
                </Text>
              </View>

              <View style={styles.miniCountdown}>
                <View style={styles.timeChip}>
                  <Text style={styles.timeChipValue}>{padTime(timeLeft.hours)}</Text>
                  <Text style={styles.timeChipLabel}>Hours</Text>
                </View>
                <View style={styles.timeChip}>
                  <Text style={styles.timeChipValue}>{padTime(timeLeft.minutes)}</Text>
                  <Text style={styles.timeChipLabel}>Minutes</Text>
                </View>
                <View style={styles.timeChip}>
                  <Text style={styles.timeChipValue}>{padTime(timeLeft.seconds)}</Text>
                  <Text style={styles.timeChipLabel}>Seconds</Text>
                </View>
              </View>

            </Animated.View>

            <SectionNav active={activeSection} onSelect={scrollToSection} />

            <View style={styles.extensionTiles}>
              <View style={styles.extensionTile}>
                <Text style={styles.tileLabel}>Job Submissions</Text>
                <Text style={styles.tileValue}>10 = +14 days</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${submissionProgress}%` }]} />
                </View>
                <Text style={styles.tileMeta}>
                  {submissionsNeeded} more for next extension
                </Text>
              </View>
              <View style={styles.extensionTile}>
                <Text style={styles.tileLabel}>Offer Letters</Text>
                <Text style={styles.tileValue}>2 = +30 days</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${offerProgress}%` }]} />
                </View>
                <Text style={styles.tileMeta}>
                  {offersNeeded} more for next extension
                </Text>
              </View>
            </View>

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
              <Text style={styles.targetDate}>Target Deadline · {targetLabel}</Text>
              
              <Text style={styles.extensionNote}>
                +{extensionDays} days secured · ({approvedSubmissions}/10 Job Submissions) · ({approvedOffers}/2 Offers)
              </Text>
              
              <View style={styles.heroStats}>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatValue}>{approvedSubmissions}</Text>
                  <Text style={styles.heroStatLabel}>Job Submissions Approved</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatValue}>{approvedOffers}</Text>
                  <Text style={styles.heroStatLabel}>Offers Approved</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatValue}>{pendingCount}</Text>
                  <Text style={styles.heroStatLabel}>Pending Admin</Text>
                </View>
              </View>
            </GlassCard>
          </View>

          <Animated.View entering={FadeIn.duration(800)} style={styles.intro}>
            <GlassCard enteringDelay={140} style={styles.missionCard}>
              <Text style={styles.kicker}>The Ultimatum Status</Text>
              <View style={styles.briefBlock}>
                <View>
                  <Text style={styles.briefHeading}>Objective</Text>
                  <Text style={styles.subtitle}>Secure employment before the deadline.</Text>
                </View>

                <View>
                  <Text style={styles.briefHeading}>Verification</Text>
                  <Text style={styles.subtitle}>All evidence is subject to administrative review.</Text>
                </View>

                <View>
                  <Text style={styles.briefHeading}>Consequence</Text>
                  <Text style={styles.subtitle}>Grandmothers may initiate groom discovery operations.</Text>
                </View>
              </View>
            </GlassCard>
          </Animated.View>

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
              <View style={styles.monitorHeader}>
                <Text style={[styles.sectionLabel, styles.monitorTitle]}>Grandma Monitoring Status</Text>
                <Text style={styles.threatPill}>Threat {probability}%</Text>
              </View>
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
              <Text style={styles.sectionLabel}>Your Submissions</Text>
              {applicationsError ? (
                <Text style={styles.errorText}>{applicationsError}</Text>
              ) : null}
              {applicationsLoading ? (
                <Text style={styles.monitorMeta}>Loading proof of hustle…</Text>
              ) : null}
              {!applicationsLoading && applications.length === 0 ? (
                <Text style={styles.monitorMeta}>
                  No uploads yet. The grandmas are preparing the biodata...
                </Text>
              ) : null}
              {applications.slice(0, 5).map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </GlassCard>
          </View>

          <Text style={styles.footer}>
            {applications.length > 0
              ? `${applications.length} submission${applications.length === 1 ? '' : 's'} · Pending / Approved / Rejected`
              : 'Submit proof on the Upload tab. Admin review controls extensions.'}
          </Text>
          <View style={styles.bottomSpacer} />
        </ScrollView>

        <View style={styles.floatingCta}>
          <PremiumButton
            label="Upload Proof"
            variant="primary"
            onPress={() => router.push('/upload')}
          />
        </View>
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
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: PremiumSpacing.lg,
    paddingTop: Platform.OS === 'android' ? PremiumSpacing.md : PremiumSpacing.sm,
    paddingBottom: Platform.OS === 'android' ? 140 : 148,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  openingHero: {
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: PremiumSpacing.lg,
  },
  avatarStage: {
    alignItems: 'center',
    marginTop: PremiumSpacing.sm,
    marginBottom: PremiumSpacing.md,
  },
  avatarGlow: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: PremiumColors.redSoft,
    opacity: 0.72,
    top: -16,
  },
  avatarContainer: {
    width: 156,
    height: 156,
    borderRadius: 78,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: PremiumColors.gold,
    position: 'relative',
    backgroundColor: PremiumColors.surface,
    shadowColor: PremiumColors.red,
    shadowOpacity: 0.24,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  personaLabel: {
    ...PremiumTypography.body,
    marginTop: 14,
    fontWeight: 'bold',
    fontSize: 13,
    textTransform: 'uppercase',
  },
  intro: {
    marginBottom: PremiumSpacing.md,
  },
  heroCopy: {
    alignItems: 'center',
    marginBottom: PremiumSpacing.md,
  },
  kicker: {
    ...PremiumTypography.overline,
    marginBottom: PremiumSpacing.sm,
    textAlign: 'center',
  },
  mobileHeroTitle: {
    ...PremiumTypography.title,
    fontSize: 32,
    lineHeight: 38,
    textAlign: 'center',
    color: PremiumColors.goldLight,
    maxWidth: 340,
  },
  mobileHeroSubtitle: {
    ...PremiumTypography.caption,
    marginTop: PremiumSpacing.sm,
    color: PremiumColors.textSecondary,
    textAlign: 'center',
  },
  miniCountdown: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginBottom: PremiumSpacing.md,
  },
  timeChip: {
    flex: 1,
    minHeight: 70,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PremiumColors.borderStrong,
    backgroundColor: 'rgba(18, 18, 18, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeChipValue: {
    ...PremiumTypography.status,
    color: PremiumColors.textPrimary,
    fontSize: 24,
    lineHeight: 30,
    fontVariant: ['tabular-nums'],
  },
  timeChipLabel: {
    ...PremiumTypography.caption,
    color: PremiumColors.textMuted,
    fontSize: 9,
  },
  subtitle: {
    ...PremiumTypography.subtitle,
    maxWidth: 380,
  },
  missionCard: {
    paddingVertical: 18,
  },
  briefBlock: {
    gap: 14,
  },
  briefHeading: {
    ...PremiumTypography.overline,
    color: PremiumColors.gold,
    marginBottom: 4,
  },
  extensionTiles: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: PremiumSpacing.md,
  },
  extensionTile: {
    flex: 1,
    minHeight: 128,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PremiumColors.borderStrong,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'rgba(18, 18, 18, 0.78)',
  },
  tileLabel: {
    ...PremiumTypography.caption,
    color: PremiumColors.textTertiary,
    fontSize: 9,
  },
  tileValue: {
    ...PremiumTypography.status,
    color: PremiumColors.textPrimary,
    fontSize: 20,
    lineHeight: 26,
    marginTop: 8,
  },
  tileMeta: {
    ...PremiumTypography.body,
    color: PremiumColors.textMuted,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 8,
  },
  progressTrack: {
    height: 5,
    borderRadius: 8,
    backgroundColor: PremiumColors.probabilityTrack,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: PremiumColors.gold,
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
    fontWeight: 'bold',
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
  monitorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: PremiumSpacing.md,
  },
  monitorTitle: {
    flex: 1,
    marginBottom: 0,
  },
  threatPill: {
    ...PremiumTypography.caption,
    color: PremiumColors.redLight,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PremiumColors.redGlow,
    backgroundColor: PremiumColors.redSoft,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: 'hidden',
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
  bottomSpacer: {
    height: 42,
  },
  floatingCta: {
    position: 'absolute',
    left: PremiumSpacing.lg,
    right: PremiumSpacing.lg,
    bottom: Platform.select({ web: 82, default: 14 }),
    alignSelf: 'center',
    maxWidth: 480,
  },
});
