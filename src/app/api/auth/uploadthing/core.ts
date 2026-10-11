import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const OurFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 10,
    },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.url };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof OurFileRouter;
