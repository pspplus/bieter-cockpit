
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import nur deutsche Übersetzungsdateien
import deGeneral from './locales/de/general.json';
import deAuth from './locales/de/auth.json';
import deLanding from './locales/de/landing.json';

// Import legacy translation file für Rückwärtskompatibilität
import deTranslation from './locales/de.json';

const resources = {
  de: {
    general: deGeneral,
    auth: deAuth,
    landing: deLanding,
    translation: deTranslation // Legacy support
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'de', // Fest auf Deutsch gesetzt
    fallbackLng: 'de',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React escapes already by default
    },
    defaultNS: 'general',
  });

export default i18n;
