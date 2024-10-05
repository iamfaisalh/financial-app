export function isEmailValid(email: string) {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(regex);
}

export function formatMoney(
  amount: number | bigint,
  currency?: string,
  locale?: string | string[]
) {
  const formatter = new Intl.NumberFormat(locale ? locale : "en-US", {
    style: "currency",
    currency: currency ? currency : "USD",
  });
  return formatter.format(amount);
}
