import i18n from "../i18n";
import type { AppLangs } from "../model/app/types/AppLangs.enum";

const applyLanguage = (lang: AppLangs) => {
  document.documentElement.lang = lang;
  document.documentElement.dir = i18n.dir(lang);
};

const initializeLanguage = async () => {
  const lang = (localStorage.getItem("lang") || i18n.language) as AppLangs;

  if (i18n.language !== lang) {
    await i18n.changeLanguage(lang);
  }

  applyLanguage(lang);
};

const changeLanguage = async (lang: AppLangs) => {
  if (i18n.language !== lang) {
    await i18n.changeLanguage(lang);
  }

  applyLanguage(lang);
  localStorage.setItem("lang", lang);
};

export { changeLanguage, initializeLanguage };
