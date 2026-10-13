"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Quando pathname ou searchParams mudam, a navegação terminou
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams, isNavigating]);

  // Limpar timer ao desmontar
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, []);

  // Interceptar cliques em links internos do Next.js
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Ignorar cliques com teclas modificadoras (ctrl, cmd, shift) ou botão direito
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const targetAttr = anchor.getAttribute("target");

      // Ignorar links externos, downloads, âncoras locais ou novas abas
      if (
        !href ||
        targetAttr === "_blank" ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      try {
        const url = new URL(anchor.href, window.location.href);

        // Somente links do mesmo domínio
        if (url.origin !== window.location.origin) {
          return;
        }

        // Se estiver clicando na mesma URL exata, não acionar loading
        const currentUrl = new URL(window.location.href);
        if (url.pathname === currentUrl.pathname && url.search === currentUrl.search) {
          return;
        }

        // Inicia feedback imediato no momento do clique (0ms)
        setIsNavigating(true);
        setProgress(20);

        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
        }

        progressTimerRef.current = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              if (progressTimerRef.current) clearInterval(progressTimerRef.current);
              return 90;
            }
            // Incremento suave decrescente
            const diff = (90 - prev) * 0.15;
            return prev + Math.max(diff, 2);
          });
        }, 120);
      } catch {
        // Ignora erros de parsing de URL
      }
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, []);

  if (!isNavigating && progress === 0) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-[2.5px] z-[99999] pointer-events-none transition-all duration-300 ease-out ${
        progress === 100 ? "opacity-0" : "opacity-100"
      }`}
      style={{
        width: `${progress}%`,
        background: "linear-gradient(90deg, #003366 0%, #ebb343 50%, #facc15 100%)",
        boxShadow: "0 0 8px rgba(235, 179, 67, 0.7)",
      }}
    />
  );
}
