import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, useColorScheme, View, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { PremiumColors } from '@/constants/premium-theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="index" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="upload" href="/upload" asChild>
            <TabButton>Upload</TabButton>
          </TabTrigger>
          <TabTrigger name="admin" href="/admin" asChild>
            <TabButton>Admin</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        style={[
          styles.tabButtonView,
          isFocused ? styles.tabButtonActive : styles.tabButtonIdle,
        ]}>
        <ThemedText
          type="small"
          style={isFocused ? styles.tabLabelActive : styles.tabLabel}
        >
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  useColorScheme();

  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView style={styles.innerContainer}>
        <ThemedText type="smallBold" style={styles.brandText}>
          Escape The Wedding
        </ThemedText>

        {props.children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: Spacing.two,
    paddingTop: 8,
    paddingBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(2, 2, 2, 0.72)',
  },
  innerContainer: {
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: 6,
    maxWidth: MaxContentWidth,
    backgroundColor: 'rgba(17, 13, 10, 0.96)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PremiumColors.border,
  },
  brandText: {
    marginRight: 'auto',
    color: PremiumColors.textPrimary,
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    minHeight: 40,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    justifyContent: 'center',
  },
  tabButtonIdle: {
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: PremiumColors.cyanSoft,
  },
  tabLabel: {
    color: PremiumColors.textSecondary,
  },
  tabLabelActive: {
    color: PremiumColors.cyan,
  },
});
