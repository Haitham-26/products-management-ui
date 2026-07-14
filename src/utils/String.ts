import currencyCodes, { type CurrencyCodeRecord } from "currency-codes";
import { AppLangs } from "../model/app/types/AppLangs.enum";

export const REGEXES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

const displayNames = new Intl.DisplayNames(
  localStorage.getItem("lang") || AppLangs.EN,
  {
    type: "currency",
  },
);

const EXCLUDED_CODES = new Set([
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

export const CURRENCY_OPTIONS = currencyCodes.data
  .filter((currency) => !EXCLUDED_CODES.has(currency.code))
  .map((currency) => ({
    label: `${currency.code} - ${displayNames.of(currency.code) ?? currency.currency}`,
    value: currency.code,
  }));

export const stringWithCurrencyCode = (
  code: CurrencyCodeRecord["code"],
  value: number = 0,
) => {
  const defaultCurrency = "USD";

  const currencyCode = code || defaultCurrency;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currencyCode}`;
  }
};
