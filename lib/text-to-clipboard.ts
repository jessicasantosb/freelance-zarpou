import { toast } from "react-toastify";

export const textToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Email copiado com sucesso!')
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    toast.error('Erro ao copiar o email!')
  }
};
