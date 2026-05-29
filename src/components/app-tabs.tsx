import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { PremiumColors } from '@/constants/premium-theme';

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={PremiumColors.background}
      indicatorColor={PremiumColors.gold}
      labelStyle={{
        selected: { color: PremiumColors.goldLight },
        default: { color: PremiumColors.textTertiary },
      }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="upload">
        <NativeTabs.Trigger.Label>Upload</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="admin">
        <NativeTabs.Trigger.Label>Admin</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
