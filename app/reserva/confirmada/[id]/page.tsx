"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Printer,
  Share2,
  QrCode,
  Copy,
  Calendar,
  MapPin,
  Users,
  ShieldCheck,
  ArrowRight,
  Plane,
  Hotel,
  Clock,
} from "lucide-react";
import { useBookingStore } from "@/stores/booking-store";
import { useConfigStore } from "@/stores/config-store";
import { Container } from "@/components/shared/container";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookingConfirmedPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const bookingId = resolvedParams.id;

  const { bookings } = useBookingStore();
  const { config } = useConfigStore();

  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const booking = bookings.find((b) => b.id === bookingId) || bookings[0];

  if (!mounted) return null;

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-16 flex items-center justify-center">
        <Container>
          <div className="max-w-md mx-auto bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm space-y-4">
            <h1 className="text-xl font-bold text-slate-800">
              Reserva não encontrada
            </h1>
            <p className="text-xs text-slate-500">
              Não localizamos nenhuma reserva com este identificador.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl"
            >
              Voltar para o Início
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const isPix = booking.paymentMethod === "pix";
  const primaryTraveler = booking.travelers[0] || {
    fullName: "Viajante Zarpou",
    documentNumber: "000.000.000-00",
    email: "cliente@zarpouviagens.com.br",
    phone: "(31) 98421-0000",
  };

  const handleCopyPix = () => {
    if (booking.pixCode) {
      navigator.clipboard.writeText(booking.pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 print:bg-white print:p-0">
      <Container>
        {/* BANNER PRINCIPAL DE SUCESSO */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm text-center relative overflow-hidden print:border-none print:shadow-none">
            <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="size-10" />
            </div>

            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              {isPix ? "Reserva Registrada • Aguardando Pix" : "Pagamento Aprovado • Reserva Confirmada"}
            </span>

            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-3">
              {isPix ? "Quase tudo pronto para sua viagem!" : "Parabéns! Sua viagem está confirmada!"}
            </h1>

            <p className="text-sm text-slate-500 max-w-lg mx-auto mt-2 leading-relaxed">
              Enviamos os detalhes da reserva e seu voucher para o e-mail{" "}
              <strong className="text-slate-800">{primaryTraveler.email}</strong>.
            </p>

            {/* Código Localizador (PNR) */}
            <div className="mt-6 inline-block bg-slate-50 border-2 border-dashed border-primary/40 rounded-2xl px-8 py-3">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Código Localizador Zarpou (PNR)
              </p>
              <p className="text-2xl font-black text-primary font-mono tracking-widest mt-0.5">
                {booking.locatorCode}
              </p>
            </div>

            {/* Ações Rápidas (Impressão / WhatsApp) */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer"
              >
                <Printer className="size-4" />
                Imprimir Voucher / Salvar PDF
              </button>

              <Link
                href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(
                  `Olá! Acabei de fazer a reserva com o localizador ${booking.locatorCode} e gostaria de confirmar.`
                )}`}
                target="_blank"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-sm"
              >
                <Share2 className="size-4" />
                Falar com a Zarpou no WhatsApp
              </Link>
            </div>
          </div>

          {/* ÁREA DO PIX SE FOR O CASO */}
          {isPix && (
            <div className="bg-amber-50/60 rounded-3xl p-6 md:p-8 border border-amber-200 shadow-sm print:hidden">
              <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
                <div className="space-y-2 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-amber-800 font-bold text-sm">
                    <Clock className="size-4" />
                    Pague agora para garantir sua reserva
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    Chave Pix Copia e Cola
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md">
                    Abra o aplicativo do seu banco, escolha <strong>Pix Copia e Cola</strong> e cole o código abaixo. A aprovação é imediata!
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    Valor com 5% de desconto: <strong>R$ {booking.pricing.finalAmount.toFixed(2)}</strong>
                  </p>
                </div>

                <div className="flex flex-col items-center gap-3 shrink-0">
                  <div className="size-36 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center">
                    <QrCode className="size-28 text-slate-900" />
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <Copy className="size-3.5" />
                    {copied ? "Código Pix Copiado!" : "Copiar Código Pix"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VOUCHER DE VIAGEM OFICIAL (PRINTABLE) */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="relative size-10">
                  <Image
                    src="/logo/logo.svg"
                    alt="Zarpou"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Voucher de Viagem Zarpou
                  </h2>
                  <p className="text-xs text-slate-500">
                    {config.companyName} • CNPJ: {config.cnpj} • Cadastur: {config.cadastur}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-slate-400">Emissão</span>
                <p className="text-xs font-bold text-slate-800">
                  {new Date(booking.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>

            {/* Informações do Produto Reservado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  {booking.productType === "hotel" ? <Hotel className="size-4 text-primary" /> : <Plane className="size-4 text-primary" />}
                  Detalhes do Serviço
                </h3>
                {booking.hotel && (
                  <div className="space-y-1">
                    <p className="text-base font-bold text-slate-900">{booking.hotel.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="size-3.5 text-primary" />
                      {booking.hotel.address}, {booking.hotel.city} - {booking.hotel.state}
                    </p>
                    <p className="text-xs font-semibold text-primary mt-1">
                      Quarto: {booking.selectedRoom?.name || "Standard Confort"}
                    </p>
                  </div>
                )}
                {booking.flight && (
                  <div className="space-y-1">
                    <p className="text-base font-bold text-slate-900">
                      {booking.flight.outbound.airline} ({booking.flight.outbound.flightNumber})
                    </p>
                    <p className="text-xs text-slate-500">
                      {booking.flight.outbound.originCity} ({booking.flight.outbound.originIata}) → {booking.flight.outbound.destinationCity} ({booking.flight.outbound.destinationIata})
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="size-4 text-primary" />
                  Datas e Ocupação
                </h3>
                <div className="space-y-1 text-xs text-slate-700">
                  <p>
                    <strong>Check-in / Embarque:</strong> {booking.checkInDate}
                  </p>
                  <p>
                    <strong>Check-out / Retorno:</strong> {booking.checkOutDate}
                  </p>
                  {booking.nights && booking.nights > 0 && (
                    <p>
                      <strong>Duração:</strong> {booking.nights} noites
                    </p>
                  )}
                  <p>
                    <strong>Viajantes:</strong> {booking.travelers.length} passageiro(s)
                  </p>
                </div>
              </div>
            </div>

            {/* Dados do Titular e Pagamento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="size-4 text-primary" />
                  Titular da Reserva
                </h3>
                <div className="space-y-0.5 text-xs text-slate-700">
                  <p className="font-bold text-slate-900">{primaryTraveler.fullName}</p>
                  <p>Documento: {primaryTraveler.documentNumber} ({primaryTraveler.documentType})</p>
                  <p>E-mail: {primaryTraveler.email}</p>
                  <p>Telefone: {primaryTraveler.phone}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  Resumo Financeiro
                </h3>
                <div className="space-y-1 text-xs text-slate-700">
                  <p>
                    Forma de Pagamento:{" "}
                    <strong>
                      {booking.paymentMethod === "credit_card"
                        ? `Cartão de Crédito em ${booking.installments || 1}x`
                        : booking.paymentMethod === "pix"
                        ? "Pix Instantâneo"
                        : "Boleto Bancário"}
                    </strong>
                  </p>
                  <p className="text-base font-black text-primary mt-1">
                    Valor Total: R$ {booking.pricing.finalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Opcionais Inclusos */}
            {booking.addons.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Opcionais e Seguros Inclusos
                </h3>
                <div className="flex flex-wrap gap-2">
                  {booking.addons.map((a) => (
                    <span
                      key={a.id}
                      className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-medium"
                    >
                      ✓ {a.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 text-[11px] text-slate-400 text-center leading-relaxed">
              Apresente este voucher no momento do check-in juntamente com documento original com foto.
              Para suporte, entre em contato pelo telefone {config.phone} ou e-mail {config.email}.
            </div>
          </div>

          {/* BOTÕES DE VOLTAR E MINHAS VIAGENS */}
          <div className="flex items-center justify-between print:hidden">
            <Link
              href="/"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              Voltar à página inicial
            </Link>

            <Link
              href="/minhas-viagens"
              className="px-6 py-3 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary/90 transition shadow-sm flex items-center gap-2"
            >
              Acessar Minhas Viagens
              <ArrowRight className="size-4 text-secondary" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
