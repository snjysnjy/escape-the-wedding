import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { PremiumColors, PremiumTypography } from '@/constants/premium-theme';

type PremiumInputProps = TextInputProps & {
  label: string;
};

export function PremiumInput({ label, style, ...props }: PremiumInputProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={PremiumColors.textMuted}
        style={[styles.input, style]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 18,
  },
  label: {
    ...PremiumTypography.overline,
    marginBottom: 10,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PremiumColors.borderStrong,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'android' ? 14 : 16,
    color: PremiumColors.textPrimary,
    fontSize: 16,
    backgroundColor: PremiumColors.surfacePressed,
  },
});
