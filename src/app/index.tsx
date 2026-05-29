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
          <SectionNav active={activeSection} onSelect={scrollToSection} />

          {/* Morphing Avatar Section */}
          <Animated.View entering={FadeIn.duration(800)} style={styles.avatarSection}>
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
              {isCorporate ? '✨ Corporate Baddie Mode ✨' : '💍 Incoming Shaadi Mode 💍'}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeIn.duration(800)} style={styles.intro}>
            <Text style={styles.kicker}>The Ultimatum Status</Text>
            <View style={styles.briefBlock}>
              <Text style={styles.briefHeading}>Objective</Text>
              <Text style={styles.subtitle}>Secure employment before the deadline.</Text>

              <Text style={styles.briefHeading}>Ways To Extend Time</Text>
              <View style={styles.briefRules}>
                <View style={styles.briefRule}>
                  <Text style={styles.briefRuleTitle}>10 Approved Job Submissions</Text>
                  <Text style={styles.briefRuleValue}>+14 days</Text>
                </View>
                <View style={styles.briefRule}>
                  <Text style={styles.briefRuleTitle}>2 Approved Offer Letters</Text>
                  <Text style={styles.briefRuleValue}>+30 days</Text>
                </View>
              </View>

              <Text style={styles.briefHeading}>Verification</Text>
              <Text style={styles.subtitle}>All evidence is subject to administrative review.</Text>

              <Text style={styles.briefHeading}>Consequence</Text>
              <Text style={styles.subtitle}>Grandmothers may initiate groom discovery operations.</Text>
            </View>
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
                  <Text style={styles.heroStatValue}>{applications.filter(a => a.status === 'pending').length}</Text>
                  <Text style={styles.heroStatLabel}>Pending Admin</Text>
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
              <Text style={styles.sectionLabel}>Grandma Monitoring Status</Text>
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

          <View style={styles.actions}>
            <PremiumButton
              label="Upload Proof of Hustle"
              variant="primary"
              onPress={() => router.push('/upload')}
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
  avatarSection: {
    alignItems: 'center',
    marginVertical: PremiumSpacing.lg,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: PremiumColors.cyan,
    position: 'relative',
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
    marginTop: 12,
    fontWeight: 'bold',
    fontSize: 14,
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
  briefBlock: {
    gap: 10,
  },
  briefHeading: {
    ...PremiumTypography.overline,
    color: PremiumColors.gold,
    marginTop: 6,
  },
  briefRules: {
    gap: 8,
  },
  briefRule: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PremiumColors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: PremiumColors.surfacePressed,
  },
  briefRuleTitle: {
    ...PremiumTypography.body,
    color: PremiumColors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  briefRuleValue: {
    ...PremiumTypography.status,
    color: PremiumColors.cyan,
    fontSize: 18,
    lineHeight: 24,
    marginTop: 2,
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
