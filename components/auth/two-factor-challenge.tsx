"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import {
  ShieldCheck,
  Mail,
  Smartphone,
  Key,
  ArrowRight,
  ArrowLeft,
  Loader2,
  RefreshCw,
  AlertCircle,
  Check,
} from "lucide-react";

interface TwoFactorChallengeProps {
  email: string;
  maskedEmail: string;
  availableMethods: ("email" | "authenticator")[];
  currentMethod: "email" | "authenticator";
  onSwitchMethod: (method: "email" | "authenticator") => void;
  onVerify: (code: string) => Promise<{ success: boolean; message?: string }>;
  onResendEmailCode: () => Promise<{ success: boolean; message?: string }>;
  onCancel: () => void;
  theme?: "light" | "dark";
}

export function TwoFactorChallenge({
  maskedEmail,
  availableMethods,
  currentMethod,
  onSwitchMethod,
  onVerify,
  onResendEmailCode,
  onCancel,
  theme = "light",
}: TwoFactorChallengeProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [backupCodeInput, setBackupCodeInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resendSuccessMessage, setResendSuccessMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPending, startTransition] = useTransition();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Contador regressivo para reenvio
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Foca no primeiro campo ao montar
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, [currentMethod, useBackupCode]);

  const handleDigitChange = (index: number, val: string) => {
    // Apenas números
    const cleanVal = val.replace(/\D/g, "");
    if (!cleanVal) {
      const newDigits = [...digits];
      newDigits[index] = "";
      setDigits(newDigits);
      return;
    }

    const lastChar = cleanVal.charAt(cleanVal.length - 1);
    const newDigits = [...digits];
    newDigits[index] = lastChar;
    setDigits(newDigits);
    setErrorMessage("");

    // Auto-avanço para o próximo campo
    if (index < 5 && lastChar) {
      inputRefs.current[index + 1]?.focus();
    }

    // Se todos preenchidos, submete automaticamente
    if (index === 5 && lastChar) {
      const fullCode = newDigits.join("");
      if (fullCode.length === 6) {
        submitVerification(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const newDigits = ["", "", "", "", "", ""];
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setDigits(newDigits);
    setErrorMessage("");

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();

    if (pastedData.length === 6) {
      submitVerification(pastedData);
    }
  };

  const submitVerification = (codeToVerify?: string) => {
    const finalCode = useBackupCode
      ? backupCodeInput.trim()
      : codeToVerify || digits.join("");

    if (!finalCode) {
      setErrorMessage("Por favor, informe o código de verificação.");
      return;
    }

    if (!useBackupCode && finalCode.length < 6) {
      setErrorMessage("Digite todos os 6 dígitos do código.");
      return;
    }

    setErrorMessage("");
    setIsVerifying(true);
    startTransition(async () => {
      try {
        const res = await onVerify(finalCode);
        if (!res.success) {
          setIsVerifying(false);
          setErrorMessage(res.message || "Código incorreto ou expirado. Tente novamente.");
          if (!useBackupCode) {
            setDigits(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
          }
        }
      } catch {
        setIsVerifying(false);
        setErrorMessage("Erro ao verificar código. Tente novamente.");
      }
    });
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setErrorMessage("");
    setResendSuccessMessage("");
    try {
      const res = await onResendEmailCode();
      if (res.success) {
        setResendCooldown(60);
        setResendSuccessMessage(res.message || "Novo código de 6 dígitos enviado com sucesso para o seu e-mail!");
        setTimeout(() => setResendSuccessMessage(""), 5000);
      } else {
        setErrorMessage(res.message || "Erro ao reenviar código.");
      }
    } finally {
      setIsResending(false);
    }
  };

  const isDark = theme === "dark";

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* CABEÇALHO COM ÍCONE DE SEGURANÇA */}
      <div className="text-center space-y-2">
        <div className="size-14 mx-auto rounded-2xl bg-secondary/15 text-[#ebb343] flex items-center justify-center shadow-inner">
          <ShieldCheck className="size-8" />
        </div>
        <h2 className={`text-xl sm:text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
          Verificação em Duas Etapas
        </h2>
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"} max-w-sm mx-auto`}>
          {useBackupCode
            ? "Digite um dos seus códigos de recuperação descartáveis de 8 caracteres."
            : currentMethod === "authenticator"
            ? "Abra seu aplicativo autenticador (Google Authenticator) e digite o código de 6 dígitos gerado."
            : `Enviamos um código de segurança de 6 dígitos para o e-mail ${maskedEmail}.`}
        </p>
      </div>

      {/* SELEÇÃO DE ABAS DE MÉTODOS */}
      {!useBackupCode && availableMethods.length > 1 && (
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
          {availableMethods.includes("email") && (
            <button
              type="button"
              onClick={() => onSwitchMethod("email")}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                currentMethod === "email" ? "bg-white text-primary shadow-xs" : "hover:text-slate-900"
              }`}
            >
              <Mail className="size-3.5" />
              <span>Por E-mail</span>
            </button>
          )}
          {availableMethods.includes("authenticator") && (
            <button
              type="button"
              onClick={() => onSwitchMethod("authenticator")}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                currentMethod === "authenticator" ? "bg-white text-primary shadow-xs" : "hover:text-slate-900"
              }`}
            >
              <Smartphone className="size-3.5" />
              <span>Autenticador</span>
            </button>
          )}
        </div>
      )}

      {/* MENSAGEM DE ERRO */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* FORMULÁRIO DE ENTRADA */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitVerification();
        }}
        className="space-y-5"
      >
        {useBackupCode ? (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Código de Recuperação (Backup)
            </label>
            <div className="relative">
              <Key className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={backupCodeInput}
                onChange={(e) => {
                  setBackupCodeInput(e.target.value.toUpperCase());
                  setErrorMessage("");
                }}
                placeholder="Ex: 9842-1104"
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-300 text-sm font-mono tracking-wider focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden uppercase"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block text-center">
              Código de 6 dígitos
            </label>
            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  disabled={isPending || isVerifying}
                  className="size-11 sm:size-12 text-center text-lg sm:text-xl font-black rounded-xl border-2 border-slate-200 bg-white text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-hidden transition shadow-xs disabled:opacity-50"
                />
              ))}
            </div>

            {/* REENVIO DE CÓDIGO POR E-MAIL COM TIMER DE 1 MINUTO */}
            {currentMethod === "email" && (
              <div className="pt-2 text-center space-y-2">
                {resendSuccessMessage && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-center gap-1.5 font-semibold animate-in fade-in">
                    <Check className="size-3.5 text-emerald-600 shrink-0" />
                    <span>{resendSuccessMessage}</span>
                  </div>
                )}

                <div className="flex flex-col items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || isResending || isVerifying}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-2xs ${
                      resendCooldown > 0
                        ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                        : "bg-white hover:bg-slate-50 text-primary border border-primary/30 hover:border-primary cursor-pointer"
                    }`}
                  >
                    <RefreshCw className={`size-3.5 ${isResending ? "animate-spin" : ""}`} />
                    <span>
                      {isResending
                        ? "Enviando novo código..."
                        : resendCooldown > 0
                        ? `Reenviar código por e-mail (${formatTime(resendCooldown)})`
                        : "Reenviar código por e-mail"}
                    </span>
                  </button>

                  {resendCooldown > 0 && (
                    <span className="text-[10px] text-slate-400">
                      Você poderá solicitar um novo código em {resendCooldown}s.
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* ATALHO PARA SOLICITAR CÓDIGO POR E-MAIL QUANDO NO AUTENTICADOR */}
            {currentMethod === "authenticator" && availableMethods.includes("email") && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    onSwitchMethod("email");
                    if (resendCooldown <= 0) {
                      await handleResend();
                    }
                  }}
                  className="text-xs text-slate-500 hover:text-primary transition font-medium inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="size-3.5 text-primary" />
                  <span>Não tem acesso ao app? <strong>Enviar código por e-mail</strong></span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* BOTÃO PRINCIPAL DE VERIFICAÇÃO */}
        <button
          type="submit"
          disabled={isPending || isVerifying}
          className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition cursor-pointer disabled:opacity-75"
        >
          {isPending || isVerifying ? (
            <>
              <Loader2 className="size-4 animate-spin text-secondary" />
              <span>Verificando e entrando...</span>
            </>
          ) : (
            <>
              <span>Confirmar e Entrar</span>
              <ArrowRight className="size-4 text-secondary" />
            </>
          )}
        </button>

        {/* OPÇÕES ADICIONAIS DE NAVEGAÇÃO */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => {
              setUseBackupCode(!useBackupCode);
              setErrorMessage("");
            }}
            className="text-slate-500 hover:text-primary font-semibold transition cursor-pointer flex items-center gap-1"
          >
            <Key className="size-3.5 text-secondary" />
            <span>{useBackupCode ? "Usar código de 6 dígitos" : "Usar código reserva"}</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 font-semibold transition cursor-pointer flex items-center gap-1"
          >
            <ArrowLeft className="size-3" />
            <span>Voltar</span>
          </button>
        </div>
      </form>
    </div>
  );
}
