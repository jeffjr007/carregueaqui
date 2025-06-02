
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importa as traduções
import enTranslation from './locales/en/translation.json';
import ptTranslation from './locales/pt/translation.json';
import esTranslation from './locales/es/translation.json';

// Configuração do i18next
i18n
  // Detector de idioma do navegador
  .use(LanguageDetector)
  // Passa o i18n para a biblioteca react-i18next
  .use(initReactI18next)
  // Inicializa i18next
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false, // não é necessário para React pois ele já escapa por padrão
    },
    resources: {
      en: {
        translation: enTranslation
      },
      pt: {
        translation: ptTranslation
      },
      es: {
        translation: esTranslation
      }
    }
  });

export default i18n;
