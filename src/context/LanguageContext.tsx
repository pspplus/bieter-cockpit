
import React, { createContext, useContext, useEffect } from 'react';
import i18next from 'i18next';

interface LanguageContextType {
  language: 'de';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Fest auf Deutsch setzen
  useEffect(() => {
    i18next.changeLanguage('de');
  }, []);

  return (
    <LanguageContext.Provider value={{ language: 'de' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
