import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from '@uploadthing/react';
import type { OurFileRouter } from '@/app/api/auth/uploadthing/core';

export const UploadButton = generateUploadButton<OurFileRouter>();

export const UploadDropZone = generateUploadDropzone<OurFileRouter>();

export const { useUploadThing } = generateReactHelpers<OurFileRouter>();
