import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

import {
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_UPLOAD_URL,
} from '@/constants/cloudinary';

export type PickedUploadFile = {
  uri: string;
  name: string;
  mimeType: string;
};

export type CloudinaryUploadResult = {
  secureUrl: string;
  publicId: string;
  resourceType: string;
  format: string;
  bytes: number;
};

type CloudinaryResponse = {
  secure_url?: string;
  public_id?: string;
  resource_type?: string;
  format?: string;
  bytes?: number;
  error?: { message?: string };
};

function parseCloudinaryResponse(body: string): CloudinaryResponse {
  try {
    return JSON.parse(body) as CloudinaryResponse;
  } catch {
    throw new Error('Cloudinary returned an invalid response.');
  }
}

function mapUploadResult(payload: CloudinaryResponse): CloudinaryUploadResult {
  if (!payload.secure_url || !payload.public_id) {
    throw new Error(
      payload.error?.message ?? 'Cloudinary returned an incomplete upload response.'
    );
  }

  return {
    secureUrl: payload.secure_url,
    publicId: payload.public_id,
    resourceType: payload.resource_type ?? 'auto',
    format: payload.format ?? 'unknown',
    bytes: payload.bytes ?? 0,
  };
}

async function uploadViaFormData(file: PickedUploadFile): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(file.uri);
  const blob = await response.blob();
  formData.append('file', blob, file.name);

  const uploadResponse = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  const payload = (await uploadResponse.json()) as CloudinaryResponse;

  if (!uploadResponse.ok) {
    throw new Error(payload.error?.message ?? 'Cloudinary upload failed.');
  }

  return mapUploadResult(payload);
}

async function uploadViaFileSystem(
  file: PickedUploadFile
): Promise<CloudinaryUploadResult> {
  const uploadResponse = await FileSystem.uploadAsync(
    CLOUDINARY_UPLOAD_URL,
    file.uri,
    {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'file',
      mimeType: file.mimeType,
      parameters: {
        upload_preset: CLOUDINARY_UPLOAD_PRESET,
      },
    }
  );

  const payload = parseCloudinaryResponse(uploadResponse.body);

  if (uploadResponse.status < 200 || uploadResponse.status >= 300) {
    throw new Error(payload.error?.message ?? 'Cloudinary upload failed.');
  }

  return mapUploadResult(payload);
}

export async function uploadToCloudinary(
  file: PickedUploadFile
): Promise<CloudinaryUploadResult> {
  if (Platform.OS === 'web') {
    return uploadViaFormData(file);
  }

  return uploadViaFileSystem(file);
}
