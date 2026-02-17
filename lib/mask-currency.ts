export const maskCurrency = (value: string) => {
  const onlyDigits = value.replace(/\D/g, "");

  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(onlyDigits) / 100);

  return formattedValue;
};
