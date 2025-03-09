
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enGeneral from './locales/en/general.json';
import deGeneral from './locales/de/general.json';
import enAuth from './locales/en/auth.json';
import deAuth from './locales/de/auth.json';
import enLanding from './locales/en/landing.json';
import deLanding from './locales/de/landing.json';

// Import legacy translation files for backward compatibility
import enTranslation from './locales/en.json';
import deTranslation from './locales/de.json';

const resources = {
  en: {
    general: enGeneral,
    auth: enAuth,
    landing: enLanding,
    translation: enTranslation // Legacy support
  },
  de: {
    general: deGeneral,
    auth: deAuth,
    landing: deLanding,
    translation: deTranslation // Legacy support
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    defaultNS: 'general',
  });

export default i18n;
