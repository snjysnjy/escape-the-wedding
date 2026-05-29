import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { GlassCard } from '@/components/home/glass-card';
import { PremiumButton } from '@/components/home/premium-button';
import { FilePickerField } from '@/components/ui/file-picker-field';
import { PremiumInput } from '@/components/ui/premium-input';
import { PremiumScreen } from '@/components/ui/premium-screen';
import { useApplications } from '@/contexts/applications-context';
import { PickedUploadFile, uploadToCloudinary } from '@/lib/cloudinary';
import {
  PremiumColors,
  PremiumSpacing,
  PremiumTypography,
} from '@/constants/premium-theme';

export default function UploadScreen() {
  const { firebaseReady, submitApplication } = useApplications();
  const [companyName, setCompanyName] = useState('');
  const [roleAppliedFor, setRoleAppliedFor] = useState('');
  const [file, setFile] = useState<PickedUploadFile | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!firebaseReady) {
      Alert.alert(
        'Firebase not configured',
        'Add your Firebase keys to .env before submitting job submissions.'
      );
      return;
    }

    const trimmedCompany = companyName.trim();
    const trimmedRole = roleAppliedFor.trim();

    if (!trimmedCompany || !trimmedRole) {
      setError('Company name and role are required.');
      return;
    }

    if (!file) {
      setError('Upload a screenshot, image, or PDF as proof.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const upload = await uploadToCloudinary(file);

      await submitApplication({
        companyName: trimmedCompany,
        roleAppliedFor: trimmedRole,
        fileUrl: upload.secureUrl,
        fileName: file.name,
        fileMimeType: file.mimeType,
        resourceType: upload.resourceType,
        cloudinaryPublicId: upload.publicId,
      });

      Alert.alert(
        'Application submitted',
        'Your upload is pending admin review. Approved job submissions extend the countdown by 14 days.',
        [{ text: 'Done', onPress: () => router.back() }]
      );
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : 'Unable to submit job submission.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PremiumScreen>
      <Text style={styles.overline}>Submit proof</Text>
      <Text style={styles.title}>Upload job submission</Text>
      <Text style={styles.subtitle}>
        Attach evidence of a real job submission. Once approved, your wedding
        countdown receives a 14-day extension.
      </Text>

      <GlassCard enteringDelay={0}>
        <PremiumInput
          label="Company name"
          value={companyName}
          onChangeText={setCompanyName}
          placeholder="Acme Corp"
          autoCapitalize="words"
        />
        <PremiumInput
          label="Role applied for"
          value={roleAppliedFor}
          onChangeText={setRoleAppliedFor}
          placeholder="Software Engineer"
          autoCapitalize="words"
        />
        <FilePickerField file={file} onChange={setFile} />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.submitRow}>
          {submitting ? (
            <ActivityIndicator color={PremiumColors.textPrimary} />
          ) : (
            <PremiumButton
              label="Submit for review"
              variant="primary"
              onPress={handleSubmit}
            />
          )}
        </View>
      </GlassCard>

      <Text style={styles.footer}>
        Files upload directly to Cloudinary using the unsigned preset
        escapeWeddingUploads, then metadata is stored in Firestore.
      </Text>
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
    marginBottom: PremiumSpacing.xl,
    maxWidth: 360,
  },
  error: {
    ...PremiumTypography.body,
    color: PremiumColors.redLight,
    marginBottom: 12,
  },
  submitRow: {
    minHeight: 48,
    justifyContent: 'center',
  },
  footer: {
    ...PremiumTypography.body,
    fontSize: 12,
    color: PremiumColors.textTertiary,
    marginTop: PremiumSpacing.md,
  },
});
