import { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedGradientBackground } from '@/components/home/animated-gradient-background';
import { PremiumColors, PremiumSpacing } from '@/constants/premium-theme';

type PremiumScreenProps = {
  children: ReactNode;
  scrollable?: boolean;
  contentStyle?: ViewStyle;
};

export function PremiumScreen({
  children,
  scrollable = true,
  contentStyle,
}: PremiumScreenProps) {
  const body = scrollable ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.scrollContent, contentStyle]}>{children}</View>
  );

  return (
    <View style={styles.root}>
      <AnimatedGradientBackground />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {body}
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
    paddingBottom: Platform.OS === 'android' ? 40 : PremiumSpacing.xl,
  },
});
