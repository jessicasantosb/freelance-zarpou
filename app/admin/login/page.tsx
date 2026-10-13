"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { TwoFactorChallenge } from "@/components/auth/two-factor-challenge";

export default function AdminLoginPage() {
  const router = useRouter();
  const {
    login,
    pendingTwoFactor,
    verifyTwoFactor,
    cancelTwoFactor,
    sendTwoFactorEmailCode,
    switchTwoFactorMethod,
  } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        if (!result.requiresTwoFactor) {
          const loggedUser = useAuthStore.getState().user;
          const screens = loggedUser?.allowedScreens || loggedUser?.allowed_screens;
          const isGeneral = (loggedUser?.role || "").toLowerCase() === "admin";
          let target = "/admin/dashboard";
          if (!isGeneral && Array.isArray(screens) && screens.length > 0) {
            target = `/admin/${screens[0]}`;
          }
          router.push(target);
          return;
        }
        setLoading(false);
      } else {
        setLoading(false);
        setError(result.message || "Credenciais inválidas.");
      }
    } catch {
      setLoading(false);
      setError("Erro ao autenticar. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-800 space-y-6">
        {isVerifyingOtp ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-in fade-in">
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-800 text-lg">Acesso autorizado!</h3>
              <p className="text-xs text-slate-500 font-medium">Carregando painel administrativo...</p>
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
                const loggedUser = useAuthStore.getState().user;
                const screens = loggedUser?.allowedScreens || loggedUser?.allowed_screens;
                const isGeneral = (loggedUser?.role || "").toLowerCase() === "admin";
                let target = "/admin/dashboard";
                if (!isGeneral && Array.isArray(screens) && screens.length > 0) {
                  target = `/admin/${screens[0]}`;
                }
                router.push(target);
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
              <div className="relative size-16 mx-auto mb-2">
                <Image
                  src="/logo/logo.svg"
                  alt="Zarpou"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-black text-slate-900">
                Painel da Agência
              </h1>
              <p className="text-xs text-slate-500">
                Acesso administrativo e gestão da Zarpou Viagens
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  E-mail de Acesso
                </label>
                <div className="relative">
                  <Mail className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="admin@zarpou.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin text-secondary" />
                    <span>Acessando painel...</span>
                  </>
                ) : (
                  <>
                    <span>Acessar Painel</span>
                    <ArrowRight className="size-4 text-secondary" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-100">
              <Link
                href="/"
                className="text-xs font-semibold text-slate-500 hover:text-primary transition"
              >
                ← Voltar para o site público
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
