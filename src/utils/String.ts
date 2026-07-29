import currencyCodes, { type CurrencyCodeRecord } from "currency-codes";
import { AppLangs } from "../model/app/types/AppLangs.enum";
import i18n from "../i18n";

export const REGEXES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

const EXCLUDED_CURRENCY_CODES = new Set([
  "XAU",
  "XAG",
  "XPD",
  "XPT",
  "XXX",
  "XTS",
  "XBA",
  "XBB",
  "XBC",
  "XBD",
  "XDR",
  "BOV",
  "CHE",
  "CHW",
  "CLF",
  "COU",
  "MXV",
  "USN",
  "UYI",
  "UYW",
  "XSU",
  "XUA",
  "VED",
]);

const getValidLang = () => {
  const lang = i18n.language || localStorage.getItem("lang") || AppLangs.EN;

  if (Object.values(AppLangs).includes(lang as AppLangs)) {
    return lang as AppLangs;
  }

  return AppLangs.EN;
};

export const getCurrencyOptions = () => {
  const lang = getValidLang();
  const displayNames = new Intl.DisplayNames(lang, { type: "currency" });

  return currencyCodes.data
    .filter((currency) => !EXCLUDED_CURRENCY_CODES.has(currency.code))
    .map((currency) => ({
      label: `${currency.code} - ${displayNames.of(currency.code) ?? currency.currency}`,
      value: currency.code,
    }));
};

export const stringWithCurrencyCode = (
  code: CurrencyCodeRecord["code"],
  value: number = 0,
) => {
  const defaultCurrency = "USD";
  const currencyCode = code || defaultCurrency;
  const lang = getValidLang();

  try {
    return new Intl.NumberFormat(lang, {
      style: "currency",
      currency: currencyCode,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currencyCode}`;
  }
};
