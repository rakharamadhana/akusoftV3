// Lightweight, static-export-safe i18n. Default namespace is Bahasa Indonesia.
// English is a PLANNED second locale — its dictionary is intentionally not authored
// yet (CLAUDE.md §3). To add it later: create locales/en.ts, register it below.
// No component should hardcode UI strings — route everything through t().

import { id } from './locales/id';

export const DEFAULT_LOCALE = 'id' as const;
export const LOCALES = ['id'] as const; // add 'en' when its dictionary lands
export type Locale = (typeof LOCALES)[number];

export type Dictionary = typeof id;

const dictionaries: Record<Locale, Dictionary> = { id };

export function getDictionary(locale: Locale = DEFAULT_LOCALE): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}
