// Format CPF: 000.000.000-00
export const formatCpf = (value: string | null | undefined): string => {
  const numbers = (value || "").replace(/\D/g, "").slice(0, 11);
  if (numbers.length === 0) return "";
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

export const formatCPF = formatCpf;

/**
 * Remove qualquer formatação deixando apenas os dígitos numéricos.
 */
export const cleanCpf = (value: string | null | undefined): string => {
  return (value || "").replace(/\D/g, "").slice(0, 11);
};

export const cleanCPF = cleanCpf;

/**
 * Validação algorítmica completa de CPF (Cálculo dos dois dígitos verificadores - Módulo 11).
 *
 * @param value CPF formatado ou contendo apenas dígitos numéricos
 * @returns boolean true se o CPF for válido
 */
export const isValidCPF = (value: string | null | undefined): boolean => {
  if (!value) return false;

  const clean = value.replace(/\D/g, "");

  // Deve ter exatamente 11 dígitos
  if (clean.length !== 11) return false;

  // Rejeita sequências de dígitos repetidos conhecidas (000.000.000-00, 111.111.111-11, etc.)
  if (/^(\d)\1{10}$/.test(clean)) return false;

  // Validação do 1º dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean.charAt(i), 10) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(9), 10)) return false;

  // Validação do 2º dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean.charAt(i), 10) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(10), 10)) return false;

  return true;
};

export const isValidCpf = isValidCPF;
export const validateCPF = isValidCPF;
export const validateCpf = isValidCPF;

/**
 * Retorna mensagem de erro detalhada para o CPF informado, ou null se estiver válido/vazio.
 */
export const getCpfErrorMessage = (value: string | null | undefined): string | null => {
  if (!value || !value.trim()) return null;
  const clean = value.replace(/\D/g, "");
  if (clean.length < 11) {
    return "O CPF deve conter 11 dígitos.";
  }
  if (!isValidCPF(clean)) {
    return "Número de CPF inválido. Verifique os dígitos.";
  }
  return null;
};
