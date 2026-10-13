interface Get2FaEmailHtmlProps {
  name?: string;
  email: string;
  code: string;
  expiresInMinutes?: number;
}

export function get2FaEmailHtml({
  name,
  code,
  expiresInMinutes = 10,
}: Get2FaEmailHtmlProps): string {
  const firstName = (name || "Usuário").split(" ")[0];
  const digits = code.split("");

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Código de Verificação - Zarpou Viagens</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      color: #334155;
    }
    .wrapper {
      max-width: 580px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #05345b 0%, #03213a 100%);
      padding: 36px 30px;
      text-align: center;
    }
    .logo-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 6px 16px;
      border-radius: 50px;
      color: #ebb343;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 36px 32px;
      line-height: 1.6;
    }
    .greeting {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 8px;
    }
    .subtitle {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 28px;
    }
    .code-container {
      background-color: #f1f5f9;
      border: 2px dashed #cbd5e1;
      border-radius: 18px;
      padding: 24px 16px;
      text-align: center;
      margin: 24px 0;
    }
    .code-box {
      display: inline-flex;
      gap: 10px;
      justify-content: center;
      align-items: center;
    }
    .digit {
      display: inline-block;
      width: 44px;
      height: 52px;
      line-height: 52px;
      font-size: 28px;
      font-weight: 900;
      color: #05345b;
      background: #ffffff;
      border: 1px solid #94a3b8;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      margin: 0 3px;
    }
    .expiration {
      margin-top: 14px;
      font-size: 12px;
      font-weight: 600;
      color: #b45309;
    }
    .alert-box {
      background-color: #fffbeb;
      border-left: 4px solid #ebb343;
      padding: 14px 18px;
      border-radius: 8px;
      font-size: 12px;
      color: #92400e;
      margin-top: 24px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
      font-size: 11px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo-badge">Zarpou Viagens &amp; Turismo</div>
      <h1>Verificação de Segurança (2FA)</h1>
    </div>

    <div class="content">
      <div class="greeting">Olá, ${firstName}!</div>
      <div class="subtitle">
        Foi solicitada uma autenticação em duas etapas para acesso à sua conta. Utilize o código de 6 dígitos abaixo:
      </div>

      <div class="code-container">
        <div class="code-box">
          ${digits.map((d) => `<span class="digit">${d}</span>`).join("")}
        </div>
        <div class="expiration">
          ⏱️ Este código expira em <strong>${expiresInMinutes} minutos</strong>.
        </div>
      </div>

      <div class="alert-box">
        🔒 <strong>Dica de Segurança:</strong> Nunca compartilhe este código com ninguém. A equipe da Zarpou Viagens nunca solicita códigos de verificação por telefone ou mensagens diretas.
      </div>

      <p style="font-size: 12px; color: #64748b; margin-top: 24px;">
        Se você não tentou acessar sua conta, recomendamos alterar sua senha imediatamente por precaução.
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px 0;"><strong>Zarpou Viagens e Turismo Ltda.</strong></p>
      <p style="margin: 0;">Belo Horizonte - MG • Cadastur Certificado</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
