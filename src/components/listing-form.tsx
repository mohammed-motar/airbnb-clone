'use client';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { ImageUp } from 'lucide-react';
import { SafeImage } from '@/components/safe-image';

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
  const [galleryImages, setGalleryImages] = useState<String[]>(
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

  return (
    <form className='mt-4 grid gap-3 md:grid-cols-2'>
      <FieldInput
        name='title'
        label='Title'
        placeholder='Stylish loft near downtown'
        defaultValue={initialValues?.title}
      />
      <FieldInput
        name='category'
        label='Category'
        placeholder='Apartment, villa, cabin...'
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
            // void
          }}
        >
          <input
            type='file'
            accept='image/*'
            multiple
            className='hidden'
            onChange={(event) => {
              // void
              event.currentTarget.value = '';
            }}
          />
          <ImageUp className='h-6 w-6 text-brand-500' />
          <p className='text-sm font-semibold text-ink-800'>
            Drag and drop images, or click to upload
          </p>
          <p className='text-xs text-ink-500'>
            Up to 10 images, each max 4MB
            {/* {isUploading ? 'Uploading...' : ''} */}
          </p>
        </label>

        <input
          name='imageSrc'
          value={galleryImages[0] ?? ''}
          readOnly
          required
          hidden
        />
        <input
          name='imageSrc'
          value={JSON.stringify(galleryImages)}
          readOnly
          hidden
        />

        {/* Drop zone images here */}
      </div>

      <FieldTextarea
        name='description'
        label='Description'
        placeholder='Describe what guests can expect from this stay.'
        className='md:col-span-2'
        defaultValue={initialValues?.description}
      />
      <FieldInput
        name='locationValue'
        label='Location'
        placeholder='e.g. Miami, United States'
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
  defaultValue?: string | number;
};
const FieldInput = ({
  name,
  label,
  placeholder,
  type,
  min,
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
  defaultValue?: string;
};
function FieldTextarea({
  name,
  label,
  placeholder,
  className,
  defaultValue,
}: FieldTextareaProps) {
  return (
    <label className={`grid gap-1.5 ${className ?? ''}`}>
      <span className='text-xs font-medium text-ink-600'>{label}</span>
      <textarea
        name={name}
        required
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
