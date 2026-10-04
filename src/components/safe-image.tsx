'use client';

import Image from 'next/image';
import { useState } from 'react';

type SafeImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80';

export function SafeImage({
  src,
  alt,
  width,
  height,
  className,
  priority,
}: SafeImageProps) {
  const [failedSources, setFailedSources] = useState<Record<string, boolean>>(
    {},
  );
  const requestedSource = src || FALLBACK_IMAGE;
  const currentSrc = failedSources[requestedSource]
    ? FALLBACK_IMAGE
    : requestedSource;

  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      onError={() =>
        setFailedSources((prev) => ({
          ...prev,
          [requestedSource]: true,
        }))
      }
    />
  );
}
