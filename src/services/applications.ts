import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';

import { APPLICATIONS_COLLECTION } from '@/constants/uploads';
import { getFirestoreDb, isFirebaseConfigured } from '@/lib/firebase';
import {
  ApplicationRecord,
  ApplicationStatus,
  CreateApplicationInput,
} from '@/types/application';

function mapDoc(id: string, data: Record<string, unknown>): ApplicationRecord {
  const createdAt = data.createdAt;
  const reviewedAt = data.reviewedAt;

  return {
    id,
    type: data.type === 'offer' ? 'offer' : 'application',
    companyName: String(data.companyName ?? ''),
    roleAppliedFor: String(data.roleAppliedFor ?? ''),
    fileUrl: String(data.fileUrl ?? ''),
    fileName: String(data.fileName ?? ''),
    fileMimeType: String(data.fileMimeType ?? ''),
    resourceType: String(data.resourceType ?? ''),
    cloudinaryPublicId: String(data.cloudinaryPublicId ?? ''),
    status: (data.status as ApplicationStatus) ?? 'pending',
    createdAt:
      createdAt instanceof Timestamp ? createdAt.toMillis() : Date.now(),
    reviewedAt:
      reviewedAt instanceof Timestamp ? reviewedAt.toMillis() : undefined,
  };
}

export function subscribeToApplications(
  onData: (applications: ApplicationRecord[]) => void,
  onError: (message: string) => void
) {
  if (!isFirebaseConfigured()) {
    onError('Firebase is not configured.');
    return () => undefined;
  }

  const applicationsRef = collection(getFirestoreDb(), APPLICATIONS_COLLECTION);
  const applicationsQuery = query(applicationsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    applicationsQuery,
    (snapshot) => {
      const records = snapshot.docs.map((document) =>
        mapDoc(document.id, document.data())
      );
      onData(records);
    },
    (error) => onError(error.message)
  );
}

export async function createApplication(input: CreateApplicationInput) {
  const applicationsRef = collection(getFirestoreDb(), APPLICATIONS_COLLECTION);

  await addDoc(applicationsRef, {
    ...input,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

export async function updateApplicationStatus(
  id: string,
  status: Exclude<ApplicationStatus, 'pending'>
) {
  const applicationRef = doc(getFirestoreDb(), APPLICATIONS_COLLECTION, id);
  await updateDoc(applicationRef, {
    status,
    reviewedAt: serverTimestamp(),
  });
}
