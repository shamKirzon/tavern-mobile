export const formatCurrency = (amount: number | string): string => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  return numericAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
