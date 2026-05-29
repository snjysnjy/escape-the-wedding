import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { DAYS_EXTENDED_PER_APPROVAL } from '@/constants/uploads';
import { isFirebaseConfigured } from '@/lib/firebase';
import {
  createApplication,
  subscribeToApplications,
  updateApplicationStatus,
} from '@/services/applications';
import {
  ApplicationRecord,
  ApplicationStatus,
  CreateApplicationInput,
} from '@/types/application';

type ApplicationsContextValue = {
  applications: ApplicationRecord[];
  loading: boolean;
  error: string | null;
  firebaseReady: boolean;
  approvedCount: number;
  extensionDays: number;
  submitApplication: (input: CreateApplicationInput) => Promise<void>;
  reviewApplication: (
    id: string,
    status: Exclude<ApplicationStatus, 'pending'>
  ) => Promise<void>;
  refresh: () => void;
};

const ApplicationsContext = createContext<ApplicationsContextValue | null>(null);

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const firebaseReady = isFirebaseConfigured();

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false);
      setError(
        'Add EXPO_PUBLIC_FIREBASE_* keys to .env to enable uploads and admin review.'
      );
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToApplications(
      (records) => {
        setApplications(records);
        setLoading(false);
        setError(null);
      },
      (message) => {
        setError(message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [firebaseReady, refreshKey]);

  const approvedCount = useMemo(
    () => applications.filter((item) => item.status === 'approved').length,
    [applications]
  );

  const extensionDays = approvedCount * DAYS_EXTENDED_PER_APPROVAL;

  const submitApplication = useCallback(async (input: CreateApplicationInput) => {
    await createApplication(input);
  }, []);

  const reviewApplication = useCallback(
    async (id: string, status: Exclude<ApplicationStatus, 'pending'>) => {
      await updateApplicationStatus(id, status);
    },
    []
  );

  const refresh = useCallback(() => {
    setRefreshKey((value) => value + 1);
  }, []);

  const value = useMemo(
    () => ({
      applications,
      loading,
      error,
      firebaseReady,
      approvedCount,
      extensionDays,
      submitApplication,
      reviewApplication,
      refresh,
    }),
    [
      applications,
      loading,
      error,
      firebaseReady,
      approvedCount,
      extensionDays,
      submitApplication,
      reviewApplication,
      refresh,
    ]
  );

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationsContext);
  if (!context) {
    throw new Error('useApplications must be used within ApplicationsProvider');
  }
  return context;
}
