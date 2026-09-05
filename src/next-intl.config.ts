import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const locales = ['en', 'hi'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locale || defaultLocale;
  return {
    locale: resolvedLocale as Locale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
  };
});
