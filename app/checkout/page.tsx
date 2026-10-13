"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  FileText,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Hotel,
  Plane,
} from "lucide-react";
import { useBookingStore } from "@/stores/booking-store";
import { Container } from "@/components/shared/container";
import { PaymentMethod, TravelerInfo } from "@/types/checkout";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { formatCellphone } from "@/lib/format-cellphone";
import { formatCpf, isValidCPF } from "@/lib/format-cpf";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    currentBooking,
    calculatePricing,
    setTravelers,
    toggleAddon,
    fetchAddons,
    setPaymentMethod,
    confirmBooking,
  } = useBookingStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dados do passageiro / titular
  const [traveler, setLocalTraveler] = useState<TravelerInfo>(
    currentBooking.travelers[0] || {
      id: "trav-1",
      fullName: "",
      documentType: "CPF",
      documentNumber: "",
      birthDate: "",
      gender: "M",
      email: "",
      phone: "",
      isPrimary: true,
    }
  );

  // Dados do Cartão de Crédito
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [installments, setInstallments] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("credit_card");

  useEffect(() => {
    if (currentBooking.addons.length === 0) {
      fetchAddons();
    }
  }, [currentBooking.addons.length, fetchAddons]);

  const pricing = calculatePricing();

  // Cálculo das 12 parcelas
  const installmentOptions = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    const amount = (pricing.baseAmount + pricing.taxesAndFees + pricing.addonsAmount) / num;
    return {
      num,
      amount: amount.toFixed(2),
    };
  });

  // Validação do Passo 1
  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!traveler.fullName?.trim() || !traveler.documentNumber?.trim() || !traveler.email?.trim() || !traveler.phone?.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios do titular da reserva.");
      return;
    }

    if (traveler.documentType === "CPF") {
      const cleanDoc = traveler.documentNumber.replace(/\D/g, "");
      if (!isValidCPF(cleanDoc)) {
        toast.error("O CPF informado é inválido. Por favor, confira os números digitados.");
        return;
      }
    }

    const cleanTraveler = {
      ...traveler,
      phone: traveler.phone ? traveler.phone.replace(/\D/g, "") : "",
      documentNumber: traveler.documentType === "CPF"
        ? traveler.documentNumber.replace(/\D/g, "")
        : traveler.documentNumber.trim().toUpperCase(),
    };
    setTravelers([cleanTraveler]);
    setCurrentStep(2);
  };

  // Finalização do Pedido
  const handleFinalizeBooking = async () => {
    if (selectedMethod === "credit_card") {
      if (!cardNumber || !cardHolder || !cardExpiry || !cardCvv) {
        toast.error("Por favor, preencha todos os dados do cartão de crédito.");
        return;
      }
    }

    setIsSubmitting(true);
    setPaymentMethod(selectedMethod, installments, {
      cardNumber: cardNumber.replace(/\D/g, ""),
      holderName: cardHolder,
      expirationDate: cardExpiry,
      cvv: cardCvv,
      installments,
    });

    try {
      const booked = await confirmBooking();
      router.push(`/reserva/confirmada/${booked.id}`);
    } catch {
      alert("Houve um erro ao processar sua reserva. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  const isHotel = currentBooking.productType === "hotel";
  const title = isHotel
    ? currentBooking.hotel?.name || "Hotel Zarpou"
    : currentBooking.flight?.outbound.originCity + " → " + currentBooking.flight?.outbound.destinationCity;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 relative">
      {/* OVERLAY DE PROCESSAMENTO DE PAGAMENTO */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <LoadingScreen
              title="Processando Pagamento Seguro..."
              subtitle="Por favor, aguarde alguns instantes enquanto validamos sua transação e emitimos seus vouchers..."
              theme="dark"
              type="payment"
              fullScreen={false}
            />
          </div>
        </div>
      )}

      <Container>
        {/* BARRA DE PROGRESSO MULTI-STEP */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-300 -z-0"
              style={{
                width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
              }}
            />

            {[
              { step: 1, label: "Viajantes" },
              { step: 2, label: "Opcionais & Proteção" },
              { step: 3, label: "Pagamento Seguro" },
            ].map((s) => (
              <div
                key={s.step}
                className="flex flex-col items-center relative z-10"
              >
                <div
                  className={`size-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm ${
                    currentStep >= s.step
                      ? "bg-primary text-white ring-4 ring-primary/20"
                      : "bg-white text-slate-400 border border-slate-300"
                  }`}
                >
                  {currentStep > s.step ? <CheckCircle2 className="size-5" /> : s.step}
                </div>
                <span
                  className={`text-xs font-semibold mt-2 ${
                    currentStep >= s.step ? "text-primary" : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CONTEÚDO PRINCIPAL (ETAPAS) */}
          <div className="lg:col-span-8 space-y-6">
            {/* ETAPA 1: DADOS DOS VIAJANTES */}
            {currentStep === 1 && (
              <form
                onSubmit={handleNextFromStep1}
                className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      1. Dados do Hóspede Titular / Passageiro
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Estes dados serão utilizados para emissão formal do voucher e bilhete.
                    </p>
                  </div>
                  <Lock className="size-5 text-emerald-600" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Nome Completo (como no documento) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Eduardo de Oliveira"
                      value={traveler.fullName}
                      onChange={(e) =>
                        setLocalTraveler({ ...traveler, fullName: e.target.value })
                      }
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Tipo de Documento *
                    </label>
                    <select
                      value={traveler.documentType}
                      onChange={(e) =>
                        setLocalTraveler({
                          ...traveler,
                          documentType: e.target.value as "CPF" | "Passaporte",
                        })
                      }
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 text-sm font-medium bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden"
                    >
                      <option value="CPF">CPF (Viagens Nacionais e Mercosul)</option>
                      <option value="Passaporte">Passaporte (Viagens Internacionais)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Número do Documento *
                      </label>
                      {traveler.documentType === "CPF" && traveler.documentNumber.replace(/\D/g, "").length === 11 && (
                        isValidCPF(traveler.documentNumber) ? (
                          <span className="text-[10px] font-bold text-emerald-600">✓ CPF Válido</span>
                        ) : (
                          <span className="text-[10px] font-bold text-red-600">✕ CPF Inválido</span>
                        )
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      placeholder={traveler.documentType === "CPF" ? "000.000.000-00" : "Ex: PA123456"}
                      maxLength={traveler.documentType === "CPF" ? 14 : 20}
                      value={traveler.documentNumber}
                      onChange={(e) => {
                        const val = traveler.documentType === "CPF"
                          ? formatCpf(e.target.value)
                          : e.target.value.toUpperCase();
                        setLocalTraveler({ ...traveler, documentNumber: val });
                      }}
                      className={`w-full h-12 px-4 rounded-xl border text-sm font-medium focus:ring-2 outline-hidden transition ${
                        traveler.documentType === "CPF" &&
                        traveler.documentNumber.replace(/\D/g, "").length === 11 &&
                        !isValidCPF(traveler.documentNumber)
                          ? "border-red-400 focus:ring-red-200 text-red-900 bg-red-50/20"
                          : "border-slate-300 focus:ring-primary/20 focus:border-primary"
                      }`}
                    />
                    {traveler.documentType === "CPF" &&
                      traveler.documentNumber.replace(/\D/g, "").length === 11 &&
                      !isValidCPF(traveler.documentNumber) && (
                        <p className="text-[10px] text-red-600 font-medium">
                          Dígitos verificadores do CPF não conferem.
                        </p>
                      )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Data de Nascimento *
                    </label>
                    <input
                      type="date"
                      required
                      value={traveler.birthDate}
                      onChange={(e) =>
                        setLocalTraveler({ ...traveler, birthDate: e.target.value })
                      }
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Gênero
                    </label>
                    <select
                      value={traveler.gender}
                      onChange={(e) =>
                        setLocalTraveler({
                          ...traveler,
                          gender: e.target.value as "M" | "F" | "Outro",
                        })
                      }
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 text-sm font-medium bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden"
                    >
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      E-mail para envio do Voucher *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="seuemail@exemplo.com"
                      value={traveler.email}
                      onChange={(e) =>
                        setLocalTraveler({ ...traveler, email: e.target.value })
                      }
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Celular / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(31) 99999-9999"
                      value={traveler.phone}
                      maxLength={15}
                      onChange={(e) =>
                        setLocalTraveler({
                          ...traveler,
                          phone: formatCellphone(e.target.value),
                        })
                      }
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-secondary hover:bg-secondary/90 text-primary font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-secondary/20 transition cursor-pointer"
                  >
                    Continuar para Opcionais
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </form>
            )}

            {/* ETAPA 2: OPCIONAIS E SEGURO */}
            {currentStep === 2 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      2. Personalize sua Viagem (Opcionais)
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Adicione coberturas extras e comodidades com tarifas exclusivas de parceiro.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {currentBooking.addons.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                      <p className="text-sm font-semibold text-slate-700">
                        Nenhum serviço opcional adicional para esta viagem no momento.
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Você pode avançar diretamente para a etapa de pagamento.
                      </p>
                    </div>
                  ) : (
                    currentBooking.addons.map((addon) => (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          addon.selected
                            ? "border-primary bg-primary/5 shadow-xs"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`size-6 rounded-lg border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                              addon.selected
                                ? "bg-primary border-primary text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {addon.selected && <CheckCircle2 className="size-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {addon.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {addon.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-base font-extrabold text-primary">
                            + R$ {addon.price.toFixed(2)}
                          </span>
                          <p className="text-[10px] text-slate-400">único por reserva</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-3 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5"
                  >
                    <ArrowLeft className="size-4" />
                    Voltar
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-8 py-3.5 bg-secondary hover:bg-secondary/90 text-primary font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-secondary/20 transition cursor-pointer"
                  >
                    Ir para Pagamento
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 3: PAGAMENTO SEGURO INTEGRADO */}
            {currentStep === 3 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      3. Escolha a Forma de Pagamento
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Transação 100% segura com criptografia SSL 256-bit e checkout transparente.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <ShieldCheck className="size-4" />
                    Ambiente Protegido
                  </div>
                </div>

                {/* Abas dos Meios de Pagamento */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod("credit_card");
                      setPaymentMethod("credit_card", installments);
                    }}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition cursor-pointer ${
                      selectedMethod === "credit_card"
                        ? "border-primary bg-primary/5 text-primary font-bold shadow-xs"
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    <CreditCard className="size-6 mb-1 text-primary" />
                    <span className="text-xs font-bold">Cartão de Crédito</span>
                    <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                      Até 12x s/ juros
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod("pix");
                      setPaymentMethod("pix");
                    }}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition cursor-pointer relative overflow-hidden ${
                      selectedMethod === "pix"
                        ? "border-primary bg-primary/5 text-primary font-bold shadow-xs"
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg uppercase">
                      5% OFF
                    </div>
                    <QrCode className="size-6 mb-1 text-emerald-600" />
                    <span className="text-xs font-bold">Pix Instantâneo</span>
                    <span className="text-[10px] text-slate-500 font-semibold mt-0.5">
                      Liberação na hora
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod("boleto");
                      setPaymentMethod("boleto");
                    }}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition cursor-pointer ${
                      selectedMethod === "boleto"
                        ? "border-primary bg-primary/5 text-primary font-bold shadow-xs"
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    <FileText className="size-6 mb-1 text-slate-700" />
                    <span className="text-xs font-bold">Boleto Bancário</span>
                    <span className="text-[10px] text-slate-500 font-semibold mt-0.5">
                      À vista
                    </span>
                  </button>
                </div>

                {/* FORMULÁRIO DO CARTÃO DE CRÉDITO */}
                {selectedMethod === "credit_card" && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Número do Cartão *
                      </label>
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Nome impresso no Cartão *
                      </label>
                      <input
                        type="text"
                        placeholder="NOME COMO NO CARTÃO"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        className="w-full h-12 px-4 rounded-xl border border-slate-300 text-sm font-medium uppercase focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Validade (MM/AA) *
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="12/29"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full h-12 px-4 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Código CVV *
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full h-12 px-4 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Número de Parcelas *
                      </label>
                      <select
                        value={installments}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setInstallments(val);
                          setPaymentMethod("credit_card", val);
                        }}
                        className="w-full h-12 px-4 rounded-xl border border-slate-300 text-sm font-medium bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden"
                      >
                        {installmentOptions.map((opt) => (
                          <option key={opt.num} value={opt.num}>
                            {opt.num}x de R$ {opt.amount} sem juros (Total: R$ {pricing.finalAmount.toFixed(2)})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* VISUALIZAÇÃO DO PIX */}
                {selectedMethod === "pix" && (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                    <div className="size-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <QrCode className="size-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Pague com Pix e Ganhe 5% de Desconto
                    </h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                      Ao clicar em finalizar reserva, geraremos o QR Code dinâmico e o código copia-e-cola. O pagamento é confirmado instantaneamente e seu voucher é liberado na hora.
                    </p>
                    <div className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-200">
                      Economia no Pix: R$ {pricing.discountAmount.toFixed(2)}
                    </div>
                  </div>
                )}

                {/* VISUALIZAÇÃO DO BOLETO */}
                {selectedMethod === "boleto" && (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                    <div className="size-12 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center mx-auto">
                      <FileText className="size-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Pagamento por Boleto Bancário
                    </h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                      O boleto será gerado com vencimento para 2 dias úteis. A confirmação da reserva ocorre após a compensação bancária (1 a 2 dias úteis).
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-3 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5"
                  >
                    <ArrowLeft className="size-4" />
                    Voltar
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleFinalizeBooking}
                    className="px-8 py-4 bg-secondary hover:bg-secondary/90 text-primary font-black text-base rounded-xl flex items-center gap-2 shadow-xl shadow-secondary/30 transition transform hover:scale-102 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      "Processando Reserva..."
                    ) : (
                      <>
                        Confirmar e Pagar R$ {pricing.finalAmount.toFixed(2)}
                        <CheckCircle2 className="size-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR DE RESUMO DO PEDIDO */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs sticky top-24 space-y-5">
              <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
                Resumo da Sua Compra
              </h3>

              <div className="flex items-start gap-3">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {isHotel ? <Hotel className="size-6" /> : <Plane className="size-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                    {title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isHotel
                      ? currentBooking.selectedRoom?.name || "Acomodação Standard"
                      : "Trecho Aéreo Ida e Volta"}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span>Datas:</span>
                  <span className="font-semibold text-slate-800">
                    {currentBooking.checkInDate} até {currentBooking.checkOutDate}
                  </span>
                </div>
                {isHotel && (
                  <div className="flex justify-between">
                    <span>Diárias:</span>
                    <span className="font-semibold text-slate-800">
                      {currentBooking.nights} noites
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Hóspedes/Passageiros:</span>
                  <span className="font-semibold text-slate-800">
                    {currentBooking.adults} adultos
                    {currentBooking.children > 0 && `, ${currentBooking.children} crianças`}
                  </span>
                </div>
              </div>

              {/* Discriminação de Preços */}
              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal da tarifa:</span>
                  <span>R$ {pricing.baseAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxas de serviço e turismo:</span>
                  <span>R$ {pricing.taxesAndFees.toFixed(2)}</span>
                </div>
                {pricing.addonsAmount > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Opcionais selecionados:</span>
                    <span>+ R$ {pricing.addonsAmount.toFixed(2)}</span>
                  </div>
                )}
                {pricing.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Desconto Pix (5%):</span>
                    <span>- R$ {pricing.discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
                  <span className="text-sm font-bold text-slate-900">Total a pagar:</span>
                  <span className="text-2xl font-black text-primary">
                    R$ {pricing.finalAmount.toFixed(2)}
                  </span>
                </div>

                {selectedMethod === "credit_card" && (
                  <p className="text-right text-[11px] font-bold text-emerald-600">
                    Em até {installments}x de R$ {(pricing.finalAmount / installments).toFixed(2)} sem juros
                  </p>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-[11px] text-slate-500">
                <p className="font-bold text-slate-700 flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-emerald-600" />
                  Compra Segura Zarpou
                </p>
                <p>Voucher emitido instantaneamente após a confirmação do pagamento.</p>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
