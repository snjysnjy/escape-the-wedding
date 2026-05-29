import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, useColorScheme, View, StyleSheet } from 'react-native';

import { ExternalLink } from './external-link';
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

        <ExternalLink href="https://docs.expo.dev" asChild>
          <Pressable style={styles.externalPressable}>
            <ThemedText type="link">Docs</ThemedText>
            <SymbolView
              tintColor={PremiumColors.textSecondary}
              name={{ ios: 'arrow.up.right.square', web: 'link' }}
              size={12}
            />
          </Pressable>
        </ExternalLink>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: 8,
    maxWidth: MaxContentWidth,
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
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
    minHeight: 34,
    paddingVertical: 8,
    paddingHorizontal: 12,
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
  externalPressable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginLeft: 8,
  },
});
