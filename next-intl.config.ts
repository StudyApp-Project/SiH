import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'hi'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locale || defaultLocale;
  const messages = await import(`./src/messages/${resolvedLocale}.json`);
  return {
    locale: resolvedLocale as Locale,
    messages: messages.default,
  };
});
