import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { PickedUploadFile } from '@/lib/cloudinary';
import { PremiumColors, PremiumTypography } from '@/constants/premium-theme';

type FilePickerFieldProps = {
  file: PickedUploadFile | null;
  onChange: (file: PickedUploadFile | null) => void;
};

function guessMimeType(name: string, fallback?: string) {
  if (fallback) return fallback;
  const lower = name.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.heic')) return 'image/heic';
  return 'application/octet-stream';
}

export function FilePickerField({ file, onChange }: FilePickerFieldProps) {
  const [loading, setLoading] = useState(false);

  const pickDocument = async () => {
    setLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
        type: ['image/*', 'application/pdf'],
      });

      if (result.canceled || !result.assets?.[0]) return;

      const asset = result.assets[0];
      onChange({
        uri: asset.uri,
        name: asset.name ?? 'upload',
        mimeType: guessMimeType(asset.name ?? 'upload', asset.mimeType ?? undefined),
      });
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    setLoading(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.9,
      });

      if (result.canceled || !result.assets?.[0]) return;

      const asset = result.assets[0];
      const name = asset.fileName ?? `screenshot-${Date.now()}.jpg`;
      onChange({
        uri: asset.uri,
        name,
        mimeType: guessMimeType(name, asset.mimeType ?? 'image/jpeg'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Proof of job submission</Text>
      <Text style={styles.hint}>Screenshot, image, or PDF</Text>

      <View style={styles.actions}>
        <Pressable style={styles.button} onPress={pickImage} disabled={loading}>
          <Text style={styles.buttonText}>Choose image</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={pickDocument} disabled={loading}>
          <Text style={styles.buttonText}>Choose file</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator color={PremiumColors.textPrimary} style={styles.loader} />
      ) : null}

      {file ? (
        <View style={styles.preview}>
          <Text style={styles.fileName}>{file.name}</Text>
          <Pressable onPress={() => onChange(null)}>
            <Text style={styles.remove}>Remove</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 20,
  },
  label: {
    ...PremiumTypography.overline,
    marginBottom: 6,
  },
  hint: {
    ...PremiumTypography.body,
    fontSize: 12,
    color: PremiumColors.textTertiary,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PremiumColors.borderStrong,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: PremiumColors.surfacePressed,
  },
  buttonText: {
    ...PremiumTypography.nav,
    color: PremiumColors.textPrimary,
    fontSize: 10,
  },
  loader: {
    marginTop: 12,
  },
  preview: {
    marginTop: 14,
    padding: 14,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PremiumColors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  fileName: {
    ...PremiumTypography.body,
    color: PremiumColors.textPrimary,
    flex: 1,
  },
  remove: {
    ...PremiumTypography.body,
    color: PremiumColors.cyan,
    fontSize: 12,
  },
});
