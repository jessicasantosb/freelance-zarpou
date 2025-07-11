import { States } from "@/stores/info-store";

type GenerateMessageProps = States;

export const generateMessage = ({ name, info }: GenerateMessageProps) => {
  const { date, count, destiny, description } = info;

  return `*Dados do Cliente:*

*Nome:* ${name}
*Destino:* ${destiny}
*Data da viagem:* ${date}
*Quantidate de pessoas:* ${count}
*Motivo de contato:* ${description}
`;
};
