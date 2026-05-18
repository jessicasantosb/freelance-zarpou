import { formatWhatsappNumber } from "./format-cellphone";

const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export const whatsappLink = `https://wa.me//${number}`;
export const phoneNumber = formatWhatsappNumber(number);
