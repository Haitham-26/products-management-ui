import currencyCodes, { type CurrencyCodeRecord } from "currency-codes";

export const CURRENCY_OPTIONS = currencyCodes.data.map((currency) => ({
  label: `${currency.code} - ${currency.currency}`,
  value: currency.code,
}));

export const stringWithCurrencyCode = (
  code: CurrencyCodeRecord["code"],
  value: number,
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
