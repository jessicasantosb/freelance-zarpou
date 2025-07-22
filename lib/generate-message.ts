import { States } from "@/stores/info-store";

type GenerateMessageProps = States;

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
