import { generateJumpedMessage } from "./generate-message";
import { whatsappLink } from "./whatsapp-link";

type GenerateJumpedLinkProps = {
  client: {
    name: string;
    email: string;
    phone: string;
  };
};

export const generateJumpedDataLink = ({ client }: GenerateJumpedLinkProps) => {
  const message = generateJumpedMessage({ client });
  return `${whatsappLink}?text=${encodeURIComponent(message)}`;
};
