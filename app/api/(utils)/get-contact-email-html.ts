export const getContactEmailHtml = (data: any) => {
  const logoUrl = "https://www.zarpouviagens.com.br/logo/logo.png";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: sans-serif; color: #333; line-height: 1.6; }
          .container { width: 100%; max-width: 600px; margin: 0 auto; border: 1px solid #eee; }
          .header { background-color: #003366; padding: 20px; text-align: center; }
          .header img { max-width: 150px; }
          .content { padding: 20px; }
          .section { margin-bottom: 20px; border-bottom: 2px solid #f4f4f4; padding-bottom: 10px; }
          .section-title { color: #003366; font-size: 18px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; }
          .field { margin-bottom: 8px; }
          .label { font-weight: bold; color: #555; }
          .footer { background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #777; }
        </style>
      </head>

      <body>
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="Zarpou Viagens">
          </div>

          <div class="content">
            <h2 style="text-align: center; color: #003366;">Nova Solicitação de Viagem</h2>
            <p>Olá Equipe Zarpou, você recebeu um novo lead pelo site. Confira os detalhes abaixo:</p>

            <div class="section">
              <div class="section-title">👤 Dados do Cliente</div>
              <div class="field"><span class="label">Nome:</span> ${data.name}</div>
              <div class="field"><span class="label">Email:</span> ${data.email}</div>
              <div class="field"><span class="label">Telefone:</span> ${data.phone}</div>
            </div>

            <div class="section">
              <div class="section-title">✈️ Destino e Período</div>
              <div class="field"><span class="label">Destino:</span> ${data.destination}</div>
              <div class="field"><span class="label">Check-in:</span> ${data.startDate}</div>
              <div class="field"><span class="label">Check-out:</span> ${data.endDate}</div>
              <div class="field"><span class="label">Adultos:</span> ${data.numberOfAdults}</div>
              <div class="field"><span class="label">Crianças:</span> ${data.numberOfChildren || "0"}</div>
              <div class="field"><span class="label">Tipo de Viagem:</span> ${data.travelType}</div>
            </div>

            <div class="section">
              <div class="section-title">🏨 Preferências de Viagem</div>
              <div class="field"><span class="label">Acomodação:</span> ${data.accommodationPreference}</div>
              <div class="field"><span class="label">Tipo de Quarto:</span> ${data.roomType}</div>
              <div class="field"><span class="label">Regime:</span> ${data.mealPlan}</div>
              <div class="field"><span class="label">Transporte Principal:</span> ${data.transportation}</div>
              <div class="field"><span class="label">Transporte Interno:</span> ${data.internalTransportation}</div>
              <div class="field"><span class="label">Orçamento Estimado:</span> ${data.estimatedBudget}</div>
            </div>

            <div class="section">
              <div class="section-title">📝 Observações Adicionais</div>
              <div class="field"><span class="label">Restrições Alimentares:</span> ${data.dietaryRestrictions || "Nenhuma"}</div>
              <div class="field"><span class="label">Necessidades Especiais:</span> ${data.otherSpecialNeeds || "Nenhuma"}</div>
              <div class="field"><span class="label">Mensagem Extra:</span> ${data.additionalInfo || "Sem observações."}</div>
            </div>
          </div>

          <div class="footer">
            Este é um e-mail automático gerado pelo formulário do site Zarpou Viagens.
          </div>
        </div>
      </body>
    </html>
  `;
};
