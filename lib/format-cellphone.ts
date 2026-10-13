// Cellphone / Phone: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
export const formatCellphone = (value: string): string => {
  const numbers = (value || "").replace(/\D/g, "").slice(0, 11);
  if (numbers.length === 0) return "";
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};