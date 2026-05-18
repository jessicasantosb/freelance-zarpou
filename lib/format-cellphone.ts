// Cellphone: (XX) XXXXX-XXXX
export const formatCellphone = (value: string): string => {
  const numbers = (value || "").replace(/\D/g, "");
  if (numbers.length === 0) return "";
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 7)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
    7,
    11,
  )}`;
};

export const formatWhatsappNumber = (num?: string) => {
  if (!num) return "";
  return (num?.replace(/\D/g, "").slice(-9) ?? "").padStart(9, "55");
};
