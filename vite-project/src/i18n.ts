import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to Rainwater Harvesting System",
      "getStarted": "Get Started",
      "selectLocation": "Select Location",
      "calculateSavings": "Calculate Savings",
      "viewResults": "View Results"
    }
  },
  es: {
    translation: {
      "welcome": "Bienvenido al Sistema de Recolección de Agua de Lluvia",
      "getStarted": "Comenzar",
      "selectLocation": "Seleccionar Ubicación",
      "calculateSavings": "Calcular Ahorros",
      "viewResults": "Ver Resultados"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
