'use client';

import { useState } from 'react';
import { IonSpinner } from '@ionic/react';
import { ImagePlus, X } from 'lucide-react';
import { useTranslation } from '@/i18n/use-translation';
import {
  useUploadImage,
  useDeleteImage,
  publicImageUrl,
  type ImageBucket,
} from '@/lib/data/storage';

interface ImageUploadProps {
  bucket: ImageBucket;
  /** Stored object path (image_path / logo_path), or null when empty. */
  value: string | null;
  onChange: (path: string | null) => void;
  /** 'product' = large square dropzone; 'logo' = compact avatar tile. */
  variant?: 'product' | 'logo';
  disabled?: boolean;
}

export function ImageUpload({ bucket, value, onChange, variant = 'product', disabled }: ImageUploadProps) {
  const t = useTranslation();
  const upload = useUploadImage(bucket);
  const deleteImage = useDeleteImage(bucket);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = publicImageUrl(bucket, value);
  const isLogo = variant === 'logo';
  const busy = upload.isPending || disabled;

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;
    setError(null);
    const previous = value;
    try {
      const path = await upload.mutateAsync(file);
      onChange(path);
      if (previous) deleteImage.mutate(previous); // clean up the replaced object
    } catch (err) {
      const code = err instanceof Error ? err.message : '';
      if (code === 'imageTooLarge') setError(t.items.imageTooLarge);
      else if (code === 'imageInvalidType') setError(t.items.imageInvalidType);
      else setError(t.items.uploadFailed);
    }
  };

  const remove = () => {
    const previous = value;
    onChange(null);
    if (previous) deleteImage.mutate(previous);
  };

  const boxClass = isLogo
    ? 'flex h-20 w-20 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border-2 border-dashed border-border-light text-[10px] text-slate-body'
    : 'flex aspect-square w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-border-light text-label-md font-label-md text-slate-body';

  return (
    <div className={isLogo ? 'relative inline-block' : 'relative w-full'}>
      {/* Native <label> wrapping the file input: clicking opens the picker with
          no JS, so it works reliably in web and the Capacitor WebView. */}
      <label
        className={`${boxClass} ${busy ? 'cursor-default opacity-70' : 'cursor-pointer transition-colors hover:border-primary/60 hover:text-primary'}`}
      >
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={onFile}
          disabled={busy}
        />
        {upload.isPending ? (
          <>
            <IonSpinner name="crescent" />
            {!isLogo && <span>{t.items.uploading}</span>}
          </>
        ) : previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <>
            <ImagePlus className={isLogo ? 'h-6 w-6' : 'h-8 w-8'} />
            {!isLogo && <span>{t.items.uploadImage}</span>}
          </>
        )}
      </label>

      {previewUrl && !upload.isPending && !disabled && (
        <button
          type="button"
          aria-label={t.items.removeImage}
          onClick={remove}
          className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-alert-coral shadow-sm hover:bg-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}

      {error && <p className="mt-1.5 text-body-sm font-semibold text-alert-coral">{error}</p>}
    </div>
  );
}
