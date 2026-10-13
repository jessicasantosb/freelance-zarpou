import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getWelcomeEmailHtml } from "../../(utils)/get-welcome-email-html";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, resendApiKey } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "E-mail de destinatário inválido ou não informado." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY || resendApiKey;

    if (!apiKey) {
      console.warn(
        `[Zarpou Email] RESEND_API_KEY não configurada. E-mail de boas-vindas simulado para: ${email}`
      );
      return NextResponse.json({
        success: true,
        simulated: true,
        message: "E-mail de boas-vindas simulado com sucesso (modo desenvolvimento/sem chave Resend).",
      });
    }

    const resend = new Resend(apiKey);
    const firstName = (name || "Viajante").split(" ")[0];

    const { data, error } = await resend.emails.send({
      from: "Zarpou Viagens <lazer@zarpouviagens.com.br>",
      to: [email.trim().toLowerCase()],
      subject: `🎉 Bem-vindo(a) à Zarpou Viagens, ${firstName}! Sua conta foi criada`,
      html: getWelcomeEmailHtml({ name, email }),
    });

    if (error) {
      console.warn("[Zarpou Email] Retorno com erro do Resend:", error);
      return NextResponse.json(
        { success: false, error: error.message, detail: error },
        { status: 200 } // Não bloqueia o front
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: "E-mail de boas-vindas enviado com sucesso!",
    });
  } catch (error: unknown) {
    console.error("[Zarpou Email] Erro inesperado ao disparar e-mail de boas-vindas:", error);
    return NextResponse.json(
      { error: "Erro interno no serviço de e-mail." },
      { status: 500 }
    );
  }
}
