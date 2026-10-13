"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Users, Plus, Minus } from "lucide-react";

interface GuestsPopoverProps {
  adults: number;
  childrenCount: number;
  rooms?: number;
  showRooms?: boolean;
  onChange: (data: { adults: number; children: number; rooms: number }) => void;
}

export function GuestsPopover({
  adults,
  childrenCount,
  rooms = 1,
  showRooms = true,
  onChange,
}: GuestsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calcular posição exata em relação à viewport
  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8,
        // Alinha a borda direita do popover com a borda direita do botão
        right: Math.max(16, window.innerWidth - rect.right),
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition, { passive: true });
    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  // Fechar ao clicar fora do botão e fora do popover
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (buttonRef.current && buttonRef.current.contains(target)) {
        return;
      }
      if (popoverRef.current && popoverRef.current.contains(target)) {
        return;
      }
      setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const totalGuests = adults + childrenCount;
  const summaryLabel = showRooms
    ? `${totalGuests} ${totalGuests === 1 ? "viajante" : "viajantes"}, ${rooms} ${rooms === 1 ? "quarto" : "quartos"}`
    : `${totalGuests} ${totalGuests === 1 ? "passageiro" : "passageiros"}`;

  return (
    <div className="relative w-full">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full h-14 bg-white border border-slate-300 hover:border-primary/70 rounded-xl px-4 flex items-center gap-3 text-left transition shadow-xs focus:ring-2 focus:ring-primary/20 focus:outline-hidden cursor-pointer"
      >
        <Users className="size-5 text-primary shrink-0" />
        <div className="flex flex-col truncate">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            {showRooms ? "Hóspedes e Quartos" : "Passageiros"}
          </span>
          <span className="text-sm font-medium text-slate-900 truncate">
            {summaryLabel}
          </span>
        </div>
      </button>

      {/* RENDERIZAÇÃO VIA PORTAL DIRETO NO BODY (NUNCA É CORTADO POR NENHUM CARD OU DIV) */}
      {isOpen && coords && mounted && typeof document !== "undefined" && createPortal(
        <div
          ref={popoverRef}
          className="fixed w-80 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-slate-900/10 pointer-events-auto"
          style={{
            top: coords.top,
            right: coords.right,
            zIndex: 999999,
          }}
        >
          <div className="space-y-4">
            {/* Adultos */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="min-w-0 pr-2">
                <p className="font-semibold text-slate-900 text-sm">Adultos</p>
                <p className="text-xs text-slate-500">12 anos ou mais</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  aria-label="Diminuir adultos"
                  disabled={adults <= 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    const newAdults = Math.max(1, adults - 1);
                    const newTotal = newAdults + childrenCount;
                    onChange({
                      adults: newAdults,
                      children: childrenCount,
                      rooms: rooms > newTotal ? newTotal : rooms,
                    });
                  }}
                  className="size-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0 cursor-pointer"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-5 text-center font-bold text-slate-800 text-sm select-none shrink-0">
                  {adults}
                </span>
                <button
                  type="button"
                  aria-label="Aumentar adultos"
                  disabled={adults >= 8}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange({
                      adults: adults + 1,
                      children: childrenCount,
                      rooms,
                    });
                  }}
                  className="size-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0 cursor-pointer"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Crianças */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="min-w-0 pr-2">
                <p className="font-semibold text-slate-900 text-sm">Crianças</p>
                <p className="text-xs text-slate-500">0 a 11 anos</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  aria-label="Diminuir crianças"
                  disabled={childrenCount <= 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    const newChildren = Math.max(0, childrenCount - 1);
                    const newTotal = adults + newChildren;
                    onChange({
                      adults,
                      children: newChildren,
                      rooms: rooms > newTotal ? newTotal : rooms,
                    });
                  }}
                  className="size-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0 cursor-pointer"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-5 text-center font-bold text-slate-800 text-sm select-none shrink-0">
                  {childrenCount}
                </span>
                <button
                  type="button"
                  aria-label="Aumentar crianças"
                  disabled={childrenCount >= 6}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange({
                      adults,
                      children: childrenCount + 1,
                      rooms,
                    });
                  }}
                  className="size-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0 cursor-pointer"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Quartos (se aplicável) */}
            {showRooms && (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 pr-2">
                  <p className="font-semibold text-slate-900 text-sm">Quartos</p>
                  <p className="text-xs text-slate-500">Acomodações</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    aria-label="Diminuir quartos"
                    disabled={rooms <= 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange({
                        adults,
                        children: childrenCount,
                        rooms: Math.max(1, rooms - 1),
                      });
                    }}
                    className="size-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0 cursor-pointer"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-5 text-center font-bold text-slate-800 text-sm select-none shrink-0">
                    {rooms}
                  </span>
                  <button
                    type="button"
                    aria-label="Aumentar quartos"
                    disabled={rooms >= 4 || rooms >= totalGuests}
                    title={rooms >= totalGuests ? "O número de quartos não pode ser maior que o de hóspedes" : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (rooms >= totalGuests) return;
                      onChange({
                        adults,
                        children: childrenCount,
                        rooms: rooms + 1,
                      });
                    }}
                    className="size-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0 cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full mt-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition shadow-xs cursor-pointer"
          >
            Aplicar
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}
