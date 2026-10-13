"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  IdCard,
  Loader2,
} from "lucide-react";
import { z } from "zod";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import { Container } from "@/components/shared/container";
import { formatCellphone } from "@/lib/format-cellphone";
import { formatCpf, isValidCPF } from "@/lib/format-cpf";
import { TwoFactorChallenge } from "@/components/auth/two-factor-challenge";

// Schema de validação Zod para os requisitos de senha e cadastro
const passwordValidationSchema = z
  .string()
  .min(8, "A senha deve conter no mínimo 8 caracteres.")
  .regex(/[A-Z]/, "A senha deve conter ao menos 1 letra maiúscula.")
  .regex(/[0-9]/, "A senha deve conter ao menos 1 número.")
  .regex(
    /[^A-Za-z0-9]/,
    "A senha deve conter ao menos 1 caractere especial (ex: !@#$%&*)."
  );

const userRegistrationSchema = z.object({
  name: z.string().trim().min(3, "Nome completo deve ter ao menos 3 caracteres."),
  email: z.string().trim().email("Informe um e-mail válido."),
  phone: z
    .string()
    .trim()
    .refine((val) => {
      if (!val) return true;
      const digits = val.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 11;
    }, "Informe um número de celular válido com DDD (ex: (31) 99999-9999).")
    .optional()
    .or(z.literal("")),
  cpf: z
    .string()
    .trim()
    .refine((val) => {
      if (!val) return true;
      return isValidCPF(val);
    }, "O CPF informado é inválido. Verifique os dígitos.")
    .optional()
    .or(z.literal("")),
  password: passwordValidationSchema,
});

function CustomerLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/minhas-viagens";

  const {
    login,
    register,
    pendingTwoFactor,
    verifyTwoFactor,
    cancelTwoFactor,
    sendTwoFactorEmailCode,
    switchTwoFactorMethod,
  } = useCustomerAuthStore();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Validação em tempo real dos requisitos para auxílio visual no cadastro
  const passwordCriteria = useMemo(() => {
    return {
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const fulfilledCount = Object.values(passwordCriteria).filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        // Validação completa usando Zod
        const validation = userRegistrationSchema.safeParse({
          name,
          email,
          phone,
          cpf,
          password,
        });

        if (!validation.success) {
          const firstIssue = validation.error.issues[0];
          setError(
            firstIssue?.message || "Por favor, preencha os campos corretamente."
          );
          setLoading(false);
          return;
        }

        const cleanPhone = phone ? phone.replace(/\D/g, "") : "";
        const cleanCpf = cpf ? cpf.replace(/\D/g, "") : "";
        await register({ name, email, phone: cleanPhone, cpf: cleanCpf, password });
        setSuccessMessage(
          "Conta criada com sucesso! Enviamos um e-mail de confirmação para você."
        );
        setTimeout(() => {
          router.push(redirectTo);
        }, 1200);
      } else {
        if (!email || !password) {
          setError("Informe seu e-mail e senha para entrar.");
          setLoading(false);
          return;
        }

        const res = await login(email, password);
        setLoading(false);
        if (res.success) {
          if (!res.requiresTwoFactor) {
            router.push(redirectTo);
          }
        } else {
          setError(res.message || "E-mail ou senha inválidos.");
        }
      }
    } catch {
      setError("Erro ao autenticar. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          {isVerifyingOtp ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-in fade-in">
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Loader2 className="size-8 animate-spin text-primary" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-extrabold text-slate-800 text-lg">Acesso autorizado!</h3>
                <p className="text-xs text-slate-500 font-medium">Carregando sua conta e entrando...</p>
              </div>
            </div>
          ) : pendingTwoFactor ? (
            <TwoFactorChallenge
              email={pendingTwoFactor.email}
              maskedEmail={pendingTwoFactor.maskedEmail}
              availableMethods={pendingTwoFactor.availableMethods}
              currentMethod={pendingTwoFactor.currentMethod}
              onSwitchMethod={switchTwoFactorMethod}
              onVerify={async (code) => {
                const res = await verifyTwoFactor(code);
                if (res.success) {
                  setIsVerifyingOtp(true);
                  router.push(redirectTo);
                }
                return res;
              }}
              onResendEmailCode={sendTwoFactorEmailCode}
              onCancel={() => {
                setIsVerifyingOtp(false);
                cancelTwoFactor();
              }}
            />
          ) : (
            <>
              <div className="text-center space-y-2">
                <div className="relative size-16 mx-auto mb-1">
                  <Image
                    src="/logo/logo.svg"
                    alt="Zarpou"
                    fill
                    className="object-contain"
                  />
                </div>
                <h1 className="text-2xl font-black text-slate-900">
                  {isRegister ? "Criar sua Conta Zarpou" : "Acesse suas Viagens"}
                </h1>
                <p className="text-xs text-slate-500">
                  {isRegister
                    ? "Cadastre-se para gerenciar reservas e vouchers exclusivos"
                    : "Entre com seu e-mail para visualizar seus bilhetes e estadias"}
                </p>
              </div>

              {/* ABAS: ENTRAR / CRIAR CONTA */}
              <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setError("");
                    setSuccessMessage("");
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                    !isRegister
                      ? "bg-white text-primary shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setError("");
                    setSuccessMessage("");
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                    isRegister
                      ? "bg-white text-primary shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Criar Conta
                </button>
              </div>

              {successMessage && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl text-center flex items-center justify-center gap-2">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    WhatsApp / Celular
                  </label>
                  <div className="relative">
                    <Phone className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="(31) 99999-9999"
                      value={phone}
                      maxLength={15}
                      onChange={(e) =>
                        setPhone(formatCellphone(e.target.value))
                      }
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      CPF (opcional)
                    </label>
                    {cpf.replace(/\D/g, "").length === 11 && (
                      isValidCPF(cpf) ? (
                        <span className="text-[10px] font-bold text-emerald-600">✓ Válido</span>
                      ) : (
                        <span className="text-[10px] font-bold text-red-600">✕ CPF Inválido</span>
                      )
                    )}
                  </div>
                  <div className="relative">
                    <IdCard className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      maxLength={14}
                      value={cpf}
                      onChange={(e) => setCpf(formatCpf(e.target.value))}
                      className={`w-full h-11 pl-10 pr-4 rounded-xl border text-sm font-medium outline-hidden transition ${
                        cpf.replace(/\D/g, "").length === 11 && !isValidCPF(cpf)
                          ? "border-red-400 focus:border-red-500 text-red-900 bg-red-50/20"
                          : "border-slate-300 focus:border-primary"
                      }`}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                E-mail *
              </label>
              <div className="relative">
                <Mail className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Senha *
                </label>
                {!isRegister && (
                  <span className="text-[11px] text-slate-400">
                    Mínimo 8 caracteres
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={isRegister ? "Crie uma senha forte" : "••••••••"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition"
                  title={showPassword ? "Ocultar senha" : "Ver senha"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Checklist visual de requisitos da senha ao cadastrar */}
            {isRegister && (
              <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2.5 transition">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-600">Requisitos da Senha:</span>
                  <span
                    className={
                      fulfilledCount === 4
                        ? "text-emerald-600 font-extrabold"
                        : fulfilledCount >= 2
                        ? "text-amber-600 font-semibold"
                        : "text-slate-400 font-medium"
                    }
                  >
                    {fulfilledCount === 4
                      ? "✓ Senha Forte e Válida"
                      : fulfilledCount >= 2
                      ? "Senha Média"
                      : "Senha Fraca"}
                  </span>
                </div>

                {/* Barra de progresso dos 4 requisitos */}
                <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      fulfilledCount >= 1
                        ? fulfilledCount === 4
                          ? "bg-emerald-500"
                          : "bg-amber-400"
                        : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      fulfilledCount >= 2
                        ? fulfilledCount === 4
                          ? "bg-emerald-500"
                          : "bg-amber-400"
                        : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      fulfilledCount >= 3
                        ? fulfilledCount === 4
                          ? "bg-emerald-500"
                          : "bg-amber-400"
                        : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      fulfilledCount === 4 ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                </div>

                {/* Checklist dos 4 itens obrigatórios */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 pt-1 text-xs">
                  <div
                    className={`flex items-center gap-1.5 transition-colors ${
                      passwordCriteria.hasMinLength
                        ? "text-emerald-700 font-semibold"
                        : "text-slate-400"
                    }`}
                  >
                    {passwordCriteria.hasMinLength ? (
                      <Check className="size-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="size-1.5 rounded-full bg-slate-300 ml-1 mr-1 shrink-0" />
                    )}
                    <span>Mínimo 8 caracteres</span>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 transition-colors ${
                      passwordCriteria.hasUpperCase
                        ? "text-emerald-700 font-semibold"
                        : "text-slate-400"
                    }`}
                  >
                    {passwordCriteria.hasUpperCase ? (
                      <Check className="size-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="size-1.5 rounded-full bg-slate-300 ml-1 mr-1 shrink-0" />
                    )}
                    <span>1 letra maiúscula (A-Z)</span>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 transition-colors ${
                      passwordCriteria.hasNumber
                        ? "text-emerald-700 font-semibold"
                        : "text-slate-400"
                    }`}
                  >
                    {passwordCriteria.hasNumber ? (
                      <Check className="size-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="size-1.5 rounded-full bg-slate-300 ml-1 mr-1 shrink-0" />
                    )}
                    <span>1 número (0-9)</span>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 transition-colors ${
                      passwordCriteria.hasSpecialChar
                        ? "text-emerald-700 font-semibold"
                        : "text-slate-400"
                    }`}
                  >
                    {passwordCriteria.hasSpecialChar ? (
                      <Check className="size-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="size-1.5 rounded-full bg-slate-300 ml-1 mr-1 shrink-0" />
                    )}
                    <span>1 especial (!@#$...)</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                "Acessando..."
              ) : isRegister ? (
                <>
                  Cadastrar e Acessar
                  <ArrowRight className="size-4 text-secondary" />
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="size-4 text-secondary" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/minhas-viagens?mode=pnr"
              className="text-xs text-primary font-bold hover:underline"
            >
              Quer apenas consultar uma reserva com o código (PNR)?
            </Link>
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-slate-600 transition"
            >
              ← Voltar para o início
            </Link>
          </div>
        </>
      )}
    </div>
      </Container>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 pb-16 text-center">Carregando acesso...</div>
      }
    >
      <CustomerLoginContent />
    </Suspense>
  );
}
