import { defaultLang, languages, ui } from './ui';

export { languages, ui };

export type Locale = keyof typeof languages;

export const localeStaticPaths = () => Object.keys(languages).map((lang) => ({
  params: { lang },
}));

export const getLocale = (value: string | undefined): Locale => (
  value && value in languages ? value as Locale : defaultLang
);

export const getUi = (value: string | undefined) => ui[getLocale(value)];
