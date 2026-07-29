import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ar from "./locales/ar.json";
import { AppLangs } from "./model/app/types/AppLangs.enum";

const storedLang = localStorage.getItem("lang") || AppLangs.EN;

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    ar: {
      translation: ar,
    },
  },
  lng: storedLang,
  fallbackLng: AppLangs.EN,
  interpolation: {
    escapeValue: false,
  },
});

const applyLanguage = (lang: AppLangs) => {
  document.documentElement.lang = lang;
  document.documentElement.dir = i18n.dir(lang);
};

const initializeLanguage = async () => {
  let storedLang = localStorage.getItem("lang") as AppLangs;

  storedLang = Object.values(AppLangs).includes(storedLang as AppLangs)
    ? storedLang
    : AppLangs.EN;

  if (i18n.language !== storedLang) {
    await i18n.changeLanguage(storedLang);
  }

  applyLanguage(storedLang);
};

const changeLanguage = async (lang: AppLangs) => {
  if (i18n.language !== lang) {
    await i18n.changeLanguage(lang);
  }

  applyLanguage(lang);
  localStorage.setItem("lang", lang);
};

export default i18n;

export { initializeLanguage, changeLanguage };
