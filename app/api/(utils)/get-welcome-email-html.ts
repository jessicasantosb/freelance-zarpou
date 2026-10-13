export interface WelcomeEmailData {
  name: string;
  email: string;
}

export const getWelcomeEmailHtml = ({ name, email }: WelcomeEmailData): string => {
  const firstName = (name || "Viajante").split(" ")[0];
  const logoUrl = "https://www.zarpouviagens.com.br/logo/logo.png";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.zarpouviagens.com.br";

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bem-vindo(a) à Zarpou Viagens</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
          }
          .wrapper {
            width: 100%;
            background-color: #f8fafc;
            padding: 30px 15px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 51, 102, 0.08);
            border: 1px solid #e2e8f0;
          }
          .header {
            background: linear-gradient(135deg, #003366 0%, #002244 100%);
            padding: 35px 25px;
            text-align: center;
          }
          .header img {
            max-width: 160px;
            height: auto;
            display: inline-block;
          }
          .badge {
            display: inline-block;
            background-color: #f59e0b;
            color: #003366;
            font-weight: 800;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 4px 12px;
            border-radius: 9999px;
            margin-top: 15px;
          }
          .content {
            padding: 35px 30px;
          }
          h1 {
            color: #003366;
            font-size: 22px;
            font-weight: 800;
            margin: 0 0 12px 0;
            line-height: 1.3;
          }
          p {
            font-size: 14px;
            color: #475569;
            margin: 0 0 18px 0;
          }
          .card-box {
            background-color: #f8fafc;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            padding: 20px;
            margin: 25px 0;
          }
          .card-title {
            font-size: 13px;
            font-weight: 700;
            color: #003366;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
          }
          .feature-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
            font-size: 13px;
            color: #334155;
          }
          .feature-icon {
            font-size: 16px;
            margin-right: 10px;
            line-height: 1.4;
          }
          .cta-container {
            text-align: center;
            margin: 30px 0 20px 0;
          }
          .btn-primary {
            display: inline-block;
            background-color: #003366;
            color: #ffffff !important;
            font-size: 14px;
            font-weight: 700;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 14px;
            box-shadow: 0 4px 12px rgba(0, 51, 102, 0.25);
          }
          .security-note {
            font-size: 12px;
            color: #64748b;
            background-color: #eff6ff;
            border-left: 3px solid #3b82f6;
            padding: 10px 14px;
            border-radius: 8px;
            margin-top: 20px;
          }
          .footer {
            background-color: #f1f5f9;
            padding: 24px;
            text-align: center;
            font-size: 11px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
          }
          .footer a {
            color: #003366;
            text-decoration: none;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <img src="${logoUrl}" alt="Zarpou Viagens e Turismo" />
              <br />
              <span class="badge">Conta Criada com Sucesso</span>
            </div>

            <div class="content">
              <h1>Olá, ${firstName}! 👋</h1>
              <p>
                Seja muito bem-vindo(a) à <strong>Zarpou Viagens e Turismo</strong>!
                Sua conta de viajante associada ao e-mail <strong>${email}</strong> já está ativa e pronta para você explorar os melhores destinos do Brasil e do mundo.
              </p>

              <div class="card-box">
                <div class="card-title">✨ O que você encontra na sua conta:</div>
                
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="30" valign="top" style="font-size: 16px; padding-bottom: 10px;">🎫</td>
                    <td style="font-size: 13px; color: #334155; padding-bottom: 10px;">
                      <strong>Minhas Viagens:</strong> Acesse seus bilhetes aéreos, vouchers de hotel e localizadores PNR a qualquer hora.
                    </td>
                  </tr>
                  <tr>
                    <td width="30" valign="top" style="font-size: 16px; padding-bottom: 10px;">🏷️</td>
                    <td style="font-size: 13px; color: #334155; padding-bottom: 10px;">
                      <strong>Tarifas Exclusivas:</strong> Condições especiais em hospedagens com até 12x sem juros e cancelamento grátis.
                    </td>
                  </tr>
                  <tr>
                    <td width="30" valign="top" style="font-size: 16px; padding-bottom: 10px;">💬</td>
                    <td style="font-size: 13px; color: #334155; padding-bottom: 10px;">
                      <strong>Consultoria Personalizada:</strong> Roteiros sob medida com o Concierge Zarpou e consultores especialistas.
                    </td>
                  </tr>
                </table>
              </div>

              <div class="cta-container">
                <a href="${siteUrl}/minhas-viagens" class="btn-primary" target="_blank">
                  Acessar Minha Conta Zarpou →
                </a>
              </div>

              <div class="security-note">
                🔒 <strong>Dica de Segurança:</strong> A Zarpou nunca solicita sua senha por e-mail ou telefone. Guarde suas credenciais em local seguro.
              </div>
            </div>

            <div class="footer">
              <p style="margin: 0 0 6px 0;">
                <strong>Zarpou Viagens e Turismo Ltda</strong> • Cadastur: 34.120.948/0001-90
              </p>
              <p style="margin: 0 0 6px 0;">
                Belo Horizonte - MG, Brasil
              </p>
              <p style="margin: 0;">
                Dúvidas? Fale conosco pelo WhatsApp ou acesse nosso site em <a href="${siteUrl}" target="_blank">zarpouviagens.com.br</a>.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};
