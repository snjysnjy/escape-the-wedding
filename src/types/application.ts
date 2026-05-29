export type ApplicationStatus = 'pending' | 'approved' | 'rejected';
export type ApplicationType = 'application' | 'offer';

export type ApplicationRecord = {
  id: string;
  type: ApplicationType;
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
  type?: ApplicationType;
  companyName: string;
  roleAppliedFor: string;
  fileUrl: string;
  fileName: string;
  fileMimeType: string;
  resourceType: string;
  cloudinaryPublicId: string;
};
