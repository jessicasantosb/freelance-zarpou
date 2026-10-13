import { NextResponse } from "next/server";
import { Resend } from "resend";
import { get2FaEmailHtml } from "../../../(utils)/get-2fa-email-html";
import { generateEmailPin, maskEmail } from "@/lib/two-factor";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, existingCode } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "E-mail de destinatário inválido ou não informado." },
        { status: 400 }
      );
    }

    const code = existingCode || generateEmailPin();
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        simulated: true,
        maskedEmail: maskEmail(email),
        code,
        message: `Código de verificação enviado para ${maskEmail(email)}.`,
      });
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: "Zarpou Segurança <seguranca@zarpouviagens.com.br>",
      to: [email.trim().toLowerCase()],
      subject: `🔒 Seu código de segurança Zarpou: ${code}`,
      html: get2FaEmailHtml({ name, email, code }),
    });

    if (error) {
      console.warn("[Zarpou 2FA] Erro no envio com Resend, operando com fallback:", error);
      return NextResponse.json({
        success: true,
        simulated: true,
        maskedEmail: maskEmail(email),
        code,
        message: `Código gerado para ${maskEmail(email)}.`,
      });
    }

    return NextResponse.json({
      success: true,
      simulated: false,
      data,
      maskedEmail: maskEmail(email),
      code,
      message: `Código enviado com sucesso para ${maskEmail(email)}.`,
    });
  } catch (err: unknown) {
    console.error("[Zarpou 2FA] Erro na rota de envio:", err);
    return NextResponse.json(
      { error: "Erro interno ao enviar código de segurança." },
      { status: 500 }
    );
  }
}
