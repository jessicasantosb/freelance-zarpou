"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Send,
  X,
  RotateCcw,
  Bot,
  User,
  ExternalLink,
} from "lucide-react";
import { useConfigStore } from "@/stores/config-store";
import { api } from "@/lib/api";

interface SuggestedAction {
  label: string;
  url: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  suggestedActions?: SuggestedAction[];
}

const QUICK_SUGGESTIONS = [
  "✈️ Passagens para o exterior",
  "🏨 Resorts e hotéis com spa",
  "🌴 Pacotes promocionais",
  "💬 Falar com atendente humano",
];

export function AiConciergeChat() {
  const pathname = usePathname();
  const { config, fetchConfig } = useConfigStore();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    fetchConfig();
  }, [fetchConfig]);

  // Initialize initial welcome message
  useEffect(() => {
    if (mounted && messages.length === 0) {
      const welcome =
        config.aiChat?.welcomeMessage ||
        "Olá! 👋 Sou o Concierge Virtual da Zarpou Viagens. Como posso ajudar você a planejar sua próxima viagem hoje?";
      setMessages([
        {
          id: "welcome-1",
          role: "assistant",
          content: welcome,
          timestamp: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  }, [mounted, config.aiChat?.welcomeMessage, messages.length]);

  // Scroll to bottom when messages or typing changes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  // Não exibir chatbot nas telas do painel administrativo
  if (pathname.startsWith("/admin")) {
    return null;
  }

  // If disabled in admin config, do not render
  if (mounted && config.aiChat?.enabled === false) {
    return null;
  }

  const handleSend = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageContent,
      timestamp: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      let data: {
        reply?: string;
        response?: string;
        suggestedActions?: Array<{ label: string; url: string }>;
      } | null = null;
      try {
        // Chamada direta à API FastAPI do backend Python
        data = await api.post("/chat", {
          message: messageContent,
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          sessionId: "zarpou-web-session",
          config: {
            provider: config.aiChat?.provider,
            apiKey: config.aiChat?.apiKey,
            model: config.aiChat?.model,
            systemPrompt: config.aiChat?.systemPrompt,
          },
        });
      } catch {
        // Fallback para rota interna Next.js
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: messageContent,
            history: messages.slice(-6).map((m) => ({
              role: m.role,
              content: m.content,
            })),
            config: {
              provider: config.aiChat?.provider,
              apiKey: config.aiChat?.apiKey,
              model: config.aiChat?.model,
              systemPrompt: config.aiChat?.systemPrompt,
            },
          }),
        });
        data = await res.json();
      }

      const replyText =
        data?.reply ||
        "Desculpe, tive um imprevisto técnico momentâneo. Pode tentar novamente ou chamar um consultor no WhatsApp!";

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: replyText,
        timestamp: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        suggestedActions: data?.suggestedActions || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: "assistant",
          content:
            "Desculpe, não consegui processar sua mensagem agora. Nossos consultores no WhatsApp estão sempre à disposição para te atender!",
          timestamp: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    const welcome =
      config.aiChat?.welcomeMessage ||
      "Olá! 👋 Sou o Concierge Virtual da Zarpou Viagens. Como posso ajudar você a planejar sua próxima viagem hoje?";
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: welcome,
        timestamp: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  // Helper to render bold text, markdown links and linebreaks cleanly
  const renderMessageContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      // Parse markdown bold (**text**) and markdown links ([text](url))
      const parts = line.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
      return (
        <span key={idx} className="block leading-relaxed min-h-[1.2rem]">
          {parts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={pIdx} className="font-semibold text-slate-900">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
            if (linkMatch) {
              const [, linkText, linkHref] = linkMatch;
              const isExternal = linkHref.startsWith("http");
              return (
                <Link
                  key={pIdx}
                  href={linkHref}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="font-semibold text-[#0b548f] underline hover:text-[#ebb343] transition inline-flex items-center gap-0.5 mx-0.5"
                >
                  {linkText}
                  {isExternal && <ExternalLink className="size-2.5 opacity-60 inline" />}
                </Link>
              );
            }
            return <React.Fragment key={pIdx}>{part}</React.Fragment>;
          })}
        </span>
      );
    });
  };

  const whatsappNum = mounted
    ? config.whatsapp
    : process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5531984210000";

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 bg-gradient-to-r from-[#05345b] to-[#0b548f] text-white px-5 py-3.5 rounded-full shadow-2xl hover:shadow-[#05345b]/30 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
          aria-label="Abrir chat com a IA"
        >
          <div className="relative flex items-center justify-center size-9 rounded-full bg-white/15 backdrop-blur-sm text-[#ebb343] group-hover:rotate-12 transition-transform duration-300">
            <Sparkles className="size-5" />
            <span className="absolute -top-0.5 -right-0.5 size-2.5 bg-emerald-400 border-2 border-[#05345b] rounded-full animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold tracking-wide uppercase text-white/80">
                Concierge 24h
              </span>
              <span className="px-1.5 py-0.2 text-[9px] font-bold bg-[#ebb343] text-[#05345b] rounded-full">
                IA
              </span>
            </div>
            <p className="text-sm font-bold tracking-tight text-white leading-none">
              Fale com a IA
            </p>
          </div>
          <span className="sm:hidden text-sm font-bold tracking-tight text-white">
            Fale com a IA
          </span>
        </button>
      )}

      {/* Floating Chat Modal Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#05345b] via-[#084574] to-[#05345b] p-4 text-white flex items-center justify-between shadow-md relative">
            <div className="flex items-center gap-3">
              <div className="relative size-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-[#ebb343]">
                <Bot className="size-6" />
                <span className="absolute bottom-0 right-0 size-3 bg-emerald-400 border-2 border-[#05345b] rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold tracking-tight">
                    Concierge Zarpou IA
                  </h3>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#ebb343] text-[#05345b] rounded">
                    BETA
                  </span>
                </div>
                <p className="text-[11px] text-white/80 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
                  Online agora • Dicas & Cotações
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Reiniciar conversa"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Fechar chat"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc] text-sm">
            {messages.map((msg) => {
              const isBot = msg.role === "assistant";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${
                    isBot ? "justify-start" : "justify-end"
                  }`}
                >
                  {isBot && (
                    <div className="size-7 rounded-full bg-[#05345b] text-[#ebb343] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Sparkles className="size-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 text-[13px] shadow-xs ${
                      isBot
                        ? "bg-white text-slate-800 rounded-tl-xs border border-slate-200/80"
                        : "bg-[#05345b] text-white rounded-tr-xs"
                    }`}
                  >
                    <div className="space-y-1">
                      {renderMessageContent(msg.content)}
                    </div>
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {msg.suggestedActions.map((action, idx) => (
                          <Link
                            key={idx}
                            href={action.url}
                            target={action.url.startsWith("http") ? "_blank" : undefined}
                            rel={action.url.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full bg-slate-100 hover:bg-[#ebb343]/20 hover:text-[#05345b] text-slate-700 transition border border-slate-200"
                          >
                            <span>{action.label}</span>
                            <ExternalLink className="size-2.5 opacity-60" />
                          </Link>
                        ))}
                      </div>
                    )}
                    <div
                      className={`text-[10px] mt-1.5 text-right ${
                        isBot ? "text-slate-400" : "text-white/60"
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {!isBot && (
                    <div className="size-7 rounded-full bg-[#ebb343] text-[#05345b] flex items-center justify-center shrink-0 mt-0.5 shadow-sm font-bold text-xs">
                      <User className="size-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="size-7 rounded-full bg-[#05345b] text-[#ebb343] flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="size-3.5" />
                </div>
                <div className="bg-white text-slate-500 rounded-2xl rounded-tl-xs px-4 py-3 border border-slate-200/80 shadow-xs flex items-center gap-1.5">
                  <span className="size-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="size-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="size-2 bg-slate-400 rounded-full animate-bounce" />
                  <span className="text-xs ml-1 text-slate-400 font-medium">
                    Digitando...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_SUGGESTIONS.map((suggestion, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => handleSend(suggestion)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-[#05345b] hover:text-white transition duration-150 border border-slate-200/60"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Human Handoff Banner */}
          <div className="px-4 py-1.5 bg-amber-50 border-t border-amber-100/80 flex items-center justify-between text-[11px] text-amber-900">
            <span>Prefere falar com nosso time de vendas?</span>
            <a
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(
                "Olá! Estava navegando no site da Zarpou e gostaria de falar com um especialista sobre uma viagem."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-emerald-700 hover:underline flex items-center gap-1"
            >
              WhatsApp
              <ExternalLink className="size-3" />
            </a>
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida ou destino dos sonhos..."
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#05345b] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none transition"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="size-10 rounded-xl bg-[#05345b] hover:bg-[#084574] disabled:opacity-40 disabled:hover:bg-[#05345b] text-white flex items-center justify-center shrink-0 transition shadow-sm active:scale-95"
              aria-label="Enviar mensagem"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
