export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export type ApplicationRecord = {
  id: string;
  companyName: string;
  roleAppliedFor: string;
  fileUrl: string;
  fileName: string;
  fileMimeType: string;
  resourceType: string;
  cloudinaryPublicId: string;
  status: ApplicationStatus;
  createdAt: number;
  reviewedAt?: number;
};

export type CreateApplicationInput = {
  companyName: string;
  roleAppliedFor: string;
  fileUrl: string;
  fileName: string;
  fileMimeType: string;
  resourceType: string;
  cloudinaryPublicId: string;
};
