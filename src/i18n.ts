import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import English translations
import enGeneral from './locales/en/general.json';
import enAuth from './locales/en/auth.json';

// Import German translations
import deGeneral from './locales/de/general.json';
import deAuth from './locales/de/auth.json';

// Import the original files for namespaces that haven't been migrated yet
import enLegacy from './locales/en.json';
import deLegacy from './locales/de.json';

// Remove the extracted keys from the legacy object to avoid duplicates
const extractKeysFromLegacy = (legacyTranslation: any, extractedKeys: string[]) => {
  const result = { ...legacyTranslation };
  
  // Remove auth related keys from general
  if (result.general) {
    for (const key of extractedKeys) {
      if (result.general[key] !== undefined) {
        delete result.general[key];
      }
    }
  }
  
  // Remove auth namespace entirely
  if (result.auth) {
    delete result.auth;
  }
  
  return result;
};

// Extract keys we've moved to auth namespace
const authKeys = ['logOut', 'logIn', 'signUp', 'or'];

// Clean legacy translations
const cleanedEnLegacy = extractKeysFromLegacy(enLegacy, authKeys);
const cleanedDeLegacy = extractKeysFromLegacy(deLegacy, authKeys);

const resources = {
  en: {
    // Keep general namespace for backward compatibility
    translation: cleanedEnLegacy,
    // Add new modular namespaces
    general: enGeneral,
    auth: enAuth
  },
  de: {
    // Keep general namespace for backward compatibility
    translation: cleanedDeLegacy,
    // Add new modular namespaces
    general: deGeneral,
    auth: deAuth
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'de',
    lng: 'de', // Set default language to German
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: {
      // Lower the priority of language detection from browser
      order: ['localStorage', 'cookie', 'navigator'],
      // Always load with German first
      caches: []
    },
    // Allow nested keys
    keySeparator: '.',
    // Enable accessing multiple namespaces at once
    defaultNS: 'translation',
    ns: ['translation', 'general', 'auth']
  });

export default i18n;
