import { NextResponse } from "next/server";
import { Resend } from "resend";

import { getContactEmailHtml } from "../(utils)/get-contact-email-html";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = body;

    const { data, error } = await resend.emails.send({
      from: "Zarpou Viagens <lazer@zarpouviagens.com.br>",
      to: ["lazer@zarpouviagens.com.br"],
      subject: `Solicitação de Viagem: ${validatedData.name} - ${validatedData.destination}`,
      html: getContactEmailHtml(validatedData),
    });

    if (error) return NextResponse.json({ error }, { status: 400 });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
