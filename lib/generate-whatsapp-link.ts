import { States } from "@/stores/info-store";
import { generateMessage } from "./generate-message";
import { whatsappLink } from "./whatsapp-link";

type GenerateMessageProps = States;

export const generateDataLink = ({
  client,
  destinationInfo,
  travelInfo,
}: GenerateMessageProps) => {
  const message = generateMessage({ client, destinationInfo, travelInfo });
  return `${whatsappLink}?text=${encodeURIComponent(message)}`;
};
