import { States } from "@/stores/info-store";

type GenerateMessageProps = States;
type GenerateJumpedMessageProps = {
  client: {
    name: string;
    email: string;
    phone: string;
  };
};

export const generateMessage = ({
  client,
  destinationInfo,
  travelInfo,
}: GenerateMessageProps) => {
  const {
    destination,
    endDate,
    startDate,
    travelType,
    numberOfAdults,
    numberOfChildren,
  } = destinationInfo;
  const {
    accommodationPreference,
    estimatedBudget,
    transportation,
    additionalInfo,
    dietaryRestrictions,
    internalTransportation,
    mealPlan,
    otherSpecialNeeds,
    roomType,
  } = travelInfo;

  return `
🟦 *DADOS DO CLIENTE* 🟦  
👤 *Nome:* _${client.name}_  
📧 *Email:* ${client.email}  
📞 *Telefone:* ${client.phone}  

━━━━━━━━━━━━━━━━━━━━━━

🟧 *DESTINO DA VIAGEM* 🟧  
🌍 *Destino:* _${destination}_  
📅 *Período:* de ${startDate} até ${endDate}  
👨‍👩‍👧 *Pessoas:* ${numberOfAdults} adulto(s) ${
    numberOfChildren ? `e ${numberOfChildren} criança(s)` : ""
  }  
🎯 *Tipo de viagem:* ${travelType}  

━━━━━━━━━━━━━━━━━━━━━━

🟨 *DETALHES DA VIAGEM* 🟨  
🏨 *Acomodação:* ${accommodationPreference}  
🛏️ *Tipo de quarto:* ${roomType}  
🍽️ *Alimentação:* ${mealPlan}  
🚌 *Transporte principal:* ${transportation}  
🚗 *Transporte interno:* ${internalTransportation}  
💰 *Orçamento estimado (por pessoa):* ${estimatedBudget}  
🥗 *Restrições alimentares:* ${dietaryRestrictions}  
♿ *Necessidades especiais:* ${otherSpecialNeeds}  

📝 *Informações adicionais:* ${additionalInfo || "Nenhuma"}
`;
};

export const generateJumpedMessage = ({
  client,
}: GenerateJumpedMessageProps) => {
  return `
🟦 *DADOS DO CLIENTE* 🟦  
👤 *Nome:* _${client.name}_  
📧 *Email:* ${client.email}  
📞 *Telefone:* ${client.phone}

Gostaria de saber mais informações!
`;
};
