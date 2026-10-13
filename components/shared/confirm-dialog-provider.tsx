"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, HelpCircle, Info, Lock } from "lucide-react";

export interface ConfirmDialogOptions {
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "warning" | "default" | "primary";
  icon?: "trash" | "warning" | "info" | "question" | "lock";
}

export interface PromptDialogOptions {
  title: string;
  description?: React.ReactNode;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: string;
  cancelText?: string;
  inputType?: "text" | "password" | "email" | "number";
  required?: boolean;
}

interface ConfirmContextType {
  confirm: (options: ConfirmDialogOptions | string) => Promise<boolean>;
  prompt: (options: PromptDialogOptions | string) => Promise<string | null>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  // Estado para Confirm Dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmOptions, setConfirmOptions] = useState<ConfirmDialogOptions>({});
  const confirmResolveRef = useRef<((value: boolean) => void) | null>(null);

  // Estado para Prompt Dialog
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptOptions, setPromptOptions] = useState<PromptDialogOptions>({ title: "" });
  const [promptValue, setPromptValue] = useState("");
  const promptResolveRef = useRef<((value: string | null) => void) | null>(null);

  const confirm = useCallback((options: ConfirmDialogOptions | string): Promise<boolean> => {
    return new Promise((resolve) => {
      confirmResolveRef.current = resolve;
      if (typeof options === "string") {
        setConfirmOptions({
          title: "Confirmação",
          description: options,
          confirmText: "Confirmar",
          cancelText: "Cancelar",
          variant: "default",
        });
      } else {
        setConfirmOptions({
          title: options.title || "Confirmação",
          description: options.description,
          confirmText: options.confirmText || "Confirmar",
          cancelText: options.cancelText || "Cancelar",
          variant: options.variant || "default",
          icon: options.icon,
        });
      }
      setConfirmOpen(true);
    });
  }, []);

  const handleConfirmClose = (result: boolean) => {
    setConfirmOpen(false);
    if (confirmResolveRef.current) {
      confirmResolveRef.current(result);
      confirmResolveRef.current = null;
    }
  };

  const prompt = useCallback((options: PromptDialogOptions | string): Promise<string | null> => {
    return new Promise((resolve) => {
      promptResolveRef.current = resolve;
      if (typeof options === "string") {
        setPromptOptions({
          title: options,
          confirmText: "Salvar",
          cancelText: "Cancelar",
        });
        setPromptValue("");
      } else {
        setPromptOptions(options);
        setPromptValue(options.defaultValue || "");
      }
      setPromptOpen(true);
    });
  }, []);

  const handlePromptClose = (submit: boolean) => {
    setPromptOpen(false);
    if (promptResolveRef.current) {
      promptResolveRef.current(submit ? promptValue : null);
      promptResolveRef.current = null;
    }
  };

  const renderIcon = () => {
    const variant = confirmOptions.variant;
    const icon = confirmOptions.icon;

    if (icon === "trash" || variant === "destructive") {
      return (
        <div className="size-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
          <Trash2 className="size-5" />
        </div>
      );
    }
    if (icon === "warning" || variant === "warning") {
      return (
        <div className="size-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
          <AlertTriangle className="size-5" />
        </div>
      );
    }
    if (icon === "lock") {
      return (
        <div className="size-11 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
          <Lock className="size-5" />
        </div>
      );
    }
    if (icon === "info") {
      return (
        <div className="size-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
          <Info className="size-5" />
        </div>
      );
    }
    return (
      <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <HelpCircle className="size-5" />
      </div>
    );
  };

  return (
    <ConfirmContext.Provider value={{ confirm, prompt }}>
      {children}

      {/* SHADCN DIALOG DE CONFIRMAÇÃO */}
      <Dialog open={confirmOpen} onOpenChange={(open) => !open && handleConfirmClose(false)}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-md bg-white border border-slate-200 shadow-2xl rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            {renderIcon()}
            <div className="flex-1 min-w-0">
              <DialogHeader className="text-left space-y-1.5 p-0">
                <DialogTitle className="text-base font-bold text-slate-900 leading-tight">
                  {confirmOptions.title}
                </DialogTitle>
                {confirmOptions.description && (
                  <DialogDescription className="text-xs text-slate-500 leading-relaxed">
                    {confirmOptions.description}
                  </DialogDescription>
                )}
              </DialogHeader>
            </div>
          </div>

          <DialogFooter className="mt-5 flex-row justify-end gap-2.5 sm:gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleConfirmClose(false)}
              className="text-xs font-semibold px-4 py-2 h-auto rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {confirmOptions.cancelText || "Cancelar"}
            </Button>
            <Button
              type="button"
              variant={confirmOptions.variant === "destructive" ? "destructive" : "default"}
              onClick={() => handleConfirmClose(true)}
              className={`text-xs font-bold px-4 py-2 h-auto rounded-xl shadow-xs cursor-pointer ${
                confirmOptions.variant === "warning"
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : confirmOptions.variant === "destructive"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-primary hover:bg-primary/90 text-white"
              }`}
            >
              {confirmOptions.confirmText || "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SHADCN DIALOG DE PROMPT */}
      <Dialog open={promptOpen} onOpenChange={(open) => !open && handlePromptClose(false)}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-md bg-white border border-slate-200 shadow-2xl rounded-2xl p-6"
        >
          <DialogHeader className="text-left space-y-1.5 p-0">
            <DialogTitle className="text-base font-bold text-slate-900 leading-tight">
              {promptOptions.title}
            </DialogTitle>
            {promptOptions.description && (
              <DialogDescription className="text-xs text-slate-500 leading-relaxed">
                {promptOptions.description}
              </DialogDescription>
            )}
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePromptClose(true);
            }}
            className="mt-3 space-y-4"
          >
            <input
              type={promptOptions.inputType || "text"}
              autoFocus
              required={promptOptions.required}
              placeholder={promptOptions.placeholder}
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-secondary focus:border-transparent transition"
            />

            <DialogFooter className="flex-row justify-end gap-2.5 sm:gap-2 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => handlePromptClose(false)}
                className="text-xs font-semibold px-4 py-2 h-auto rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {promptOptions.cancelText || "Cancelar"}
              </Button>
              <Button
                type="submit"
                className="text-xs font-bold px-4 py-2 h-auto rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xs cursor-pointer"
              >
                {promptOptions.confirmText || "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm deve ser usado dentro de um ConfirmDialogProvider");
  }
  return context;
}
