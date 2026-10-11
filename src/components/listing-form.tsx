'use client';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { ImageUp } from 'lucide-react';
import { SafeImage } from '@/components/safe-image';
import { useUploadThing } from '@/lib/uploadthing';

type ListingFormProps = {
  action: (formData: FormData) => Promise<void>;
  submitLabel?: string;
  submittingLabel?: string;
  initialValues?: {
    title: string;
    category: string;
    description: string;
    locationValue: string;
    pricePerNight: number;
    guestCount: number;
    roomCount: number;
    bathroomCount: number;
    imageSrc: string;
    imageGallery: string[];
  };
};

export function ListingForm({
  action,
  submitLabel = 'Publish listing',
  submittingLabel = 'Publishing...',
  initialValues,
}: ListingFormProps) {
  const [galleryImages, setGalleryImages] = useState<string[]>(
    initialValues
      ? Array.from(
          new Set(
            [
              ...(initialValues.imageGallery ?? []),
              ...(initialValues.imageSrc ? [initialValues.imageSrc] : []),
            ].filter(Boolean),
          ),
        ).slice(0, 10)
      : [],
  );

  const [uploadError, setUploadError] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);

  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: (res) => {
      const urls = (res ?? [])
        .map((item) => item?.ufsUrl || item?.url || '')
        .filter(Boolean);

      setGalleryImages((prev) =>
        Array.from(new Set([...prev, ...urls])).slice(0, 10),
      );

      setUploadError('');
    },
    onUploadError: (error) => {
      setUploadError(error.message);
    },
  });

  async function handleFileUpload(files: FileList | File[] | null) {
    const list = files ? Array.from(files) : [];
    if (list.length === 0) return;
    if (galleryImages.length + list.length > 10) {
      setUploadError('You can upload up to 10 images per listing.');
      return;
    }
    if (list.some((file) => !file.type.startsWith('image/'))) {
      setUploadError('Please upload an image file');
      return;
    }
    if (list.some((file) => file.size > 4 * 1024 * 1024)) {
      setUploadError('Image must be 4MB or smaller');
      return;
    }

    // If no errors
    setUploadError('');
    await startUpload(list.slice(0, 10 - galleryImages.length));
  }

  function removeImage(imageUrl: string) {
    setGalleryImages((prev) => prev.filter((image) => image !== imageUrl));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (galleryImages.length === 0) {
      event.preventDefault();
      setUploadError(
        'Upload at least one image. The first image is used as the cover photo.',
      );
    }
  }

  return (
    <form
      className='mt-4 grid gap-3 md:grid-cols-2'
      action={action}
      onSubmit={handleSubmit}
    >
      <FieldInput
        name='title'
        label='Title'
        placeholder='Stylish loft near downtown'
        minLength={5}
        defaultValue={initialValues?.title}
      />
      <FieldInput
        name='category'
        label='Category'
        placeholder='Apartment, villa, cabin...'
        minLength={2}
        defaultValue={initialValues?.category}
      />

      <div className='rounded-2xl border border-ink-200 bg-surface-muted/40 p-3 md:col-span-2 md:p-4'>
        <p className='mb-2 text-sm font-medium text-ink-800'>Listing gallery</p>

        <label
          className={`flex h-36 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 text-center transition ${
            isDragActive
              ? 'border-brand-400 bg-brand-50/40'
              : 'border-ink-300 bg-surface hover:border-brand-300'
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragActive(true);
          }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragActive(false);
            void handleFileUpload(event.dataTransfer.files);
          }}
        >
          <input
            type='file'
            accept='image/*'
            multiple
            className='hidden'
            onChange={(event) => {
              void handleFileUpload(event.target.files);
              event.currentTarget.value = '';
            }}
          />
          <ImageUp className='h-6 w-6 text-brand-500' />
          <p className='text-sm font-semibold text-ink-800'>
            Drag and drop images, or click to upload
          </p>
          <p className='text-xs text-ink-500'>
            Up to 10 images, each max 4MB {isUploading ? 'Uploading...' : ''}
          </p>
        </label>

        <input
          name='imageSrc'
          key={`imageSrc-${galleryImages[0] ?? 'none'}`}
          required
          type='hidden'
          defaultValue={galleryImages[0] ?? ''}
        />
        <input
          name='imageGallery'
          defaultValue={JSON.stringify(galleryImages)}
          key={`imageGallery-${JSON.stringify(galleryImages)}`}
          type='hidden'
        />

        {galleryImages.length > 0 ? (
          <div className='mt-3 space-y-2'>
            <p className='text-sm text-emerald-700'>
              {galleryImages.length} image{galleryImages.length > 1 ? 's' : ''}{' '}
              ready.
            </p>
            <div className='hide-scrollbar flex gap-2 overflow-x-auto pb-1'>
              {galleryImages.map((image, index) => (
                <div key={`${image}-${index}`} className='relative'>
                  <SafeImage
                    src={image}
                    alt={`Uploaded listing image ${index + 1}`}
                    width={240}
                    height={160}
                    className='h-16 w-24 rounded-lg border border-ink-200 object-cover'
                  />
                  <button
                    type='button'
                    className='absolute -right-1.5 -top-1.5 rounded-full border border-ink-200 bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-ink-700 hover:bg-ink-100'
                    aria-label={`Remove image ${index + 1}`}
                    onClick={() => removeImage(image)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className='mt-2 text-sm text-ink-600'>
            Upload at least one image. The first image is used as the cover
            photo.
          </p>
        )}

        {uploadError && (
          <p className='mt-2 text-sm text-red-600'>{uploadError}</p>
        )}
      </div>

      <FieldTextarea
        name='description'
        label='Description'
        placeholder='Describe what guests can expect from this stay.'
        className='md:col-span-2'
        minLength={10}
        defaultValue={initialValues?.description}
      />
      <FieldInput
        name='locationValue'
        label='Location'
        placeholder='e.g. Miami, United States'
        minLength={2}
        defaultValue={initialValues?.locationValue}
      />
      <FieldInput
        name='pricePerNight'
        label='Price per night'
        type='number'
        min={10}
        placeholder='250'
        defaultValue={initialValues?.pricePerNight}
      />
      <FieldInput
        name='guestCount'
        label='Guests'
        type='number'
        min={1}
        placeholder='4'
        defaultValue={initialValues?.guestCount}
      />
      <FieldInput
        name='roomCount'
        label='Rooms'
        type='number'
        min={1}
        placeholder='2'
        defaultValue={initialValues?.roomCount}
      />
      <FieldInput
        name='bathroomCount'
        label='Bathrooms'
        type='number'
        min={1}
        placeholder='1'
        defaultValue={initialValues?.bathroomCount}
      />
      <SubmitButton
        submitLabel={submitLabel}
        submittingLabel={submittingLabel}
      />
    </form>
  );
}

type FieldInputProps = {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  min?: number;
  minLength?: number;
  defaultValue?: string | number;
};
const FieldInput = ({
  name,
  label,
  placeholder,
  type,
  min,
  minLength,
  defaultValue,
}: FieldInputProps) => {
  return (
    <label className='grid gap-1.5'>
      <span className='text-xs font-medium text-ink-600'>{label}</span>
      <input
        name={name}
        required
        type={type}
        min={min}
        minLength={minLength}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className='rounded-xl border border-ink-300 px-3 py-2 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100'
      />
    </label>
  );
};

type FieldTextareaProps = {
  name: string;
  label: string;
  placeholder: string;
  className?: string;
  minLength?: number;
  defaultValue?: string;
};
function FieldTextarea({
  name,
  label,
  placeholder,
  className,
  minLength,
  defaultValue,
}: FieldTextareaProps) {
  return (
    <label className={`grid gap-1.5 ${className ?? ''}`}>
      <span className='text-xs font-medium text-ink-600'>{label}</span>
      <textarea
        name={name}
        required
        minLength={minLength}
        placeholder={placeholder}
        defaultValue={defaultValue}
        rows={4}
        className='rounded-xl border border-ink-300 px-3 py-2 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100'
      />
    </label>
  );
}

function SubmitButton({
  submitLabel,
  submittingLabel,
}: {
  submitLabel: string;
  submittingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type='submit'
      disabled={pending}
      className='rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2'
    >
      {pending ? submittingLabel : submitLabel}
    </button>
  );
}
