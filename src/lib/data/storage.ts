'use client';

import { useMutation } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useCompanyId } from '@/store/auth';

/**
 * Image storage helpers (CLAUDE.md §5/§7). Uploads land in public buckets under
 * a `{company_id}/<uuid>.<ext>` path so Storage RLS can scope writes per tenant.
 * The stored `*_path` value is the object path *within* the bucket (no bucket
 * prefix); resolve it to a URL with `useImageUrl` / `publicImageUrl`.
 */
export type ImageBucket = 'logos' | 'items';

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB — matches bucket file_size_limit

function extensionFor(file: File): string {
  const fromName = file.name.split('.').pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  const fromType = file.type.split('/')[1]?.toLowerCase();
  return fromType && /^[a-z0-9]{2,5}$/.test(fromType) ? fromType : 'jpg';
}

/** Resolve a stored bucket path to its public CDN URL (buckets are public-read). */
export function publicImageUrl(bucket: ImageBucket, path?: string | null): string | null {
  if (!path) return null;
  const supabase = createClient();
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/**
 * Upload an image to the given bucket for the active company. Returns the object
 * path to persist in `items.image_path` / `companies.logo_path`.
 */
export function useUploadImage(bucket: ImageBucket) {
  const companyId = useCompanyId();
  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      if (!companyId) throw new Error('No active company');
      if (!file.type.startsWith('image/')) throw new Error('imageInvalidType');
      if (file.size > MAX_IMAGE_BYTES) throw new Error('imageTooLarge');

      const supabase = createClient();
      const path = `${companyId}/${crypto.randomUUID()}.${extensionFor(file)}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;
      return path;
    },
  });
}

/** Best-effort delete of a previously uploaded object (ignores missing files). */
export function useDeleteImage(bucket: ImageBucket) {
  return useMutation({
    mutationFn: async (path?: string | null) => {
      if (!path) return;
      const supabase = createClient();
      await supabase.storage.from(bucket).remove([path]);
    },
  });
}
