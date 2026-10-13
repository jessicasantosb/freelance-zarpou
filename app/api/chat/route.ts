import { NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface SuggestedAction {
  label: string;
  url: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history = [], config } = body as {
      message: string;
      history: ChatMessage[];
      config?: {
        provider?: string;
        apiKey?: string;
        model?: string;
        systemPrompt?: string;
      };
    };

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Mensagem inválida." },
        { status: 400 }
      );
    }

    const apiKey = config?.apiKey || process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
    const provider = config?.provider || "gemini";
    const model = config?.model || (provider === "gemini" ? "gemini-1.5-flash" : "gpt-4o-mini");
    const systemPrompt =
      config?.systemPrompt ||
      "Você é o Concierge Virtual da Zarpou Viagens e Turismo. Atenda com calor humano, sofisticação e objetividade. " +
      "Recomende os melhores destinos, hospedagens e passagens aéreas da Zarpou, sempre destacando parcelamento em até 12x sem juros e atendimento humanizado.\n" +
      "REGRAS DE NAVEGAÇÃO: Ao citar links internos no site, utilize EXCLUSIVAMENTE as seguintes rotas reais da Zarpou:\n" +
      "- Hospedagens / Hotéis: /hospedagens (nunca utilize /hoteis)\n" +
      "- Passagens Aéreas / Voos: /passagens (nunca utilize /voos)\n" +
      "- Pacotes Turísticos: /pacotes\n" +
      "- Destinos em Alta: /#destinos\n" +
      "- Minhas Reservas e Vouchers: /minhas-viagens\n" +
      "- Falar com Consultor Humano: /contato\n" +
      "Nunca invente URLs inexistentes como /hoteis ou /voos.";

    // Se tiver chave configurada, chamamos a API externa (Gemini, OpenAI ou Groq)
    if (apiKey) {
      try {
        if (provider === "gemini") {
          const geminiModel =
            model && model.toLowerCase().includes("gemini")
              ? model.replace(/^models\//, "")
              : "gemini-1.5-flash";

          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

          const rawContents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
          if (history && history.length > 0) {
            for (const h of history.slice(-8)) {
              const role = h.role === "assistant" ? "model" : "user";
              if (h.content) {
                rawContents.push({ role, parts: [{ text: h.content }] });
              }
            }
          }

          while (rawContents.length > 0 && rawContents[0].role !== "user") {
            rawContents.shift();
          }
          rawContents.push({ role: "user", parts: [{ text: message }] });

          const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
          for (const item of rawContents) {
            if (contents.length > 0 && contents[contents.length - 1].role === item.role) {
              contents[contents.length - 1].parts[0].text += `\n\n${item.parts[0].text}`;
            } else {
              contents.push(item);
            }
          }

          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: systemPrompt }],
              },
              contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600,
              },
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) {
              return NextResponse.json({
                reply,
                suggestedActions: [
                  { label: "Explorar Destinos", url: "/#destinos" },
                  { label: "Ver Hospedagens", url: "/hospedagens" },
                  { label: "Passagens Aéreas", url: "/passagens" },
                  { label: "Falar com Consultor", url: "/contato" },
                ],
              });
            }
          } else {
            console.warn(`Aviso Gemini API HTTP ${response.status}:`, await response.text());
          }
        } else if (provider === "openai" || provider === "groq") {
          const endpoint =
            provider === "groq"
              ? "https://api.groq.com/openai/v1/chat/completions"
              : "https://api.openai.com/v1/chat/completions";

          const messages = [
            { role: "system", content: systemPrompt },
            ...history.slice(-8),
            { role: "user", content: message },
          ];

          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: model || (provider === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o-mini"),
              messages,
              temperature: 0.7,
              max_tokens: 500,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content;
            if (reply) {
              return NextResponse.json({
                reply,
                suggestedActions: [
                  { label: "Explorar Destinos", url: "/#destinos" },
                  { label: "Ver Hospedagens", url: "/hospedagens" },
                  { label: "Passagens Aéreas", url: "/passagens" },
                  { label: "Falar com Consultor", url: "/contato" },
                ],
              });
            }
          }
        }
      } catch (apiErr) {
        console.warn("Erro ao conectar à API externa de IA:", apiErr);
      }
    }

    // RESPOSTA INTELIGENTE NATIVA DO CONCIERGE ZARPOU (Fallback de Alta Resiliência)
    const lower = message.toLowerCase();
    let reply = "";
    let suggestedActions: SuggestedAction[] = [];

    if (lower.includes("hotel") || lower.includes("hosped") || lower.includes("resort") || lower.includes("pousada")) {
      reply = `🏨 **Hospedagens em Destaque na Zarpou:**
      
Temos uma curadoria exclusiva com cancelamento grátis e café da manhã incluso:

1. **Copacabana Palace Grand Luxury (Rio de Janeiro)** — 5 estrelas em frente ao mar, a partir de **R$ 850/noite**.
2. **Búzios Beach & Spa Resort (Armação dos Búzios)** — Piscina aquecida e alta gastronomia por **R$ 520/noite**.
3. **The Royal Mirage (Dubai)** — Luxo árabe com praia privativa por **R$ 1.650/noite**.
4. **Santiago Andes View & Spa (Chile)** — Vista panorâmica para a Cordilheira por **R$ 720/noite**.

Todas as estadias podem ser parceladas em **até 12x sem juros**. Deseja consultar disponibilidade para uma data específica?`;
      suggestedActions = [
        { label: "Ver Hospedagens", url: "/hospedagens" },
        { label: "Resorts & Hotéis", url: "/hospedagens" },
        { label: "Chamar no WhatsApp", url: "/contato" },
      ];
    } else if (lower.includes("voo") || lower.includes("passag") || lower.includes("aéreo") || lower.includes("aerea")) {
      reply = `✈️ **Tarifas Aéreas Internacionais em Promoção:**

A Zarpou negociou tarifas especiais com taxas de embarque inclusas:

• **Belo Horizonte (CNF) ⇄ Miami (MIA)**: Ida e volta a partir de **R$ 3.450** (12x de R$ 287,50).
• **São Paulo (GRU) ⇄ Roma (FCO)**: Voo direto ITA Airways por **R$ 4.890** (12x de R$ 407,50).
• **Belo Horizonte (CNF) ⇄ Madri (MAD)**: Iberia com bagagem inclusa por **R$ 4.350**.
• **Curitiba (CWB) ⇄ Nova York (JFK)**: American Airlines por **R$ 4.190**.

Todas as passagens incluem suporte em português antes e durante o voo!`;
      suggestedActions = [
        { label: "Pesquisar Passagens", url: "/passagens" },
        { label: "Voos Promocionais", url: "/passagens" },
        { label: "Cotação Personalizada", url: "/contato" },
      ];
    } else if (lower.includes("pacote") || lower.includes("promoç") || lower.includes("oferta") || lower.includes("desconto")) {
      reply = `🌴 **Pacotes & Promoções Especiais Zarpou:**

Combinando voo + hospedagem você economiza até **25%** no valor final da viagem!

• **Semana Santa & Feriados**: Pacotes para o Nordeste e praias paradisíacas com pensão completa.
• **Destinos Andinos**: Roteiros para o Chile e Argentina com vinhedos inclusos.
• **Condições:** 5% de desconto imediato via Pix ou até **12x sem juros no cartão de crédito**.`;
      suggestedActions = [
        { label: "Ver Pacotes em Promoção", url: "/pacotes" },
        { label: "Explorar Destinos", url: "/#destinos" },
        { label: "Falar com Consultor", url: "/contato" },
      ];
    } else if (lower.includes("humano") || lower.includes("atendente") || lower.includes("whatsapp") || lower.includes("contato") || lower.includes("telefone")) {
      reply = `💬 **Atendimento Humanizado Zarpou:**

Nossos consultores especialistas estão prontos para atender você no WhatsApp oficial da agência!

Basta clicar no botão abaixo ou no ícone do WhatsApp no canto da tela para tirar dúvidas sobre vistos, personalização de roteiro ou emissão imediata de passagens.`;
      suggestedActions = [
        { label: "Enviar Mensagem", url: "/contato" },
        { label: "Conhecer a Zarpou", url: "/sobre" },
      ];
    } else if (lower.includes("cancel") || lower.includes("reembolso") || lower.includes("voucher") || lower.includes("reserva")) {
      reply = `🛡️ **Segurança e Flexibilidade Zarpou:**

• **Cancelamento:** Grande parte das nossas tarifas de hotéis contam com cancelamento 100% grátis até 48h antes do check-in.
• **Vouchers:** São gerados automaticamente após a aprovação do pagamento e disponibilizados na aba **Minhas Viagens** e enviados por e-mail e WhatsApp.
• **Segurança:** Todas as transações são protegidas por criptografia SSL 256-bit e em total conformidade com a LGPD.`;
      suggestedActions = [
        { label: "Consultar Minhas Viagens", url: "/minhas-viagens" },
        { label: "Falar com o Suporte", url: "/contato" },
      ];
    } else {
      reply = `Olá! ✈️ Que bom conversar com você!

Como seu **Concierge Virtual Zarpou**, posso te ajudar a planejar a viagem perfeita:

• 🏨 **Encontrar hotéis e resorts** com as melhores avaliações.
• ✈️ **Cotar passagens aéreas** nacionais e internacionais com taxas inclusas.
• 🌴 **Montar pacotes completos** com aéreo + hotel em até 12x sem juros.
• 📍 **Descobrir lugares imperdíveis** no Brasil e no mundo.

Qual destino você tem em mente para suas próximas férias?`;
      suggestedActions = [
        { label: "Ver Hospedagens", url: "/hospedagens" },
        { label: "Ver Passagens", url: "/passagens" },
        { label: "Ver Pacotes", url: "/pacotes" },
        { label: "Explorar Destinos", url: "/#destinos" },
      ];
    }

    return NextResponse.json({ reply, suggestedActions });
  } catch (error) {
    console.error("Erro no endpoint /api/chat:", error);
    return NextResponse.json(
      { error: "Falha ao processar solicitação da IA." },
      { status: 500 }
    );
  }
}
