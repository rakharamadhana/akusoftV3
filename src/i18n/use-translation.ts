'use client';

import { DEFAULT_LOCALE, getDictionary, type Locale } from './config';

/**
 * Access the active dictionary. Today it always resolves Bahasa Indonesia;
 * when English is added, this is where locale selection (store/route) plugs in.
 * Usage: const t = useTranslation(); t.dashboard.title
 */
export function useTranslation(locale: Locale = DEFAULT_LOCALE) {
  return getDictionary(locale);
}
