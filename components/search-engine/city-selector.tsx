"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, Search } from "lucide-react";

interface CitySelectorProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  airportsOnly?: boolean;
}

const defaultDestinations = [
  { city: "Rio de Janeiro", state: "RJ, Brasil", iata: "RIO" },
  { city: "Armação dos Búzios", state: "RJ, Brasil", iata: "BZC" },
  { city: "Recife", state: "PE, Brasil", iata: "REC" },
  { city: "Porto Alegre", state: "RS, Brasil", iata: "POA" },
  { city: "Belo Horizonte", state: "MG, Brasil", iata: "CNF" },
  { city: "São Paulo", state: "SP, Brasil", iata: "GRU" },
  { city: "Santiago", state: "Chile", iata: "SCL" },
  { city: "Miami", state: "Flórida, EUA", iata: "MIA" },
  { city: "Nova York", state: "NY, EUA", iata: "JFK" },
  { city: "Madri", state: "Espanha", iata: "MAD" },
  { city: "Roma", state: "Itália", iata: "FCO" },
  { city: "Dubai", state: "Emirados Árabes", iata: "DXB" },
];

export function CitySelector({
  label,
  placeholder,
  value,
  onChange,
  airportsOnly = false,
}: CitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = defaultDestinations.filter(
    (d) =>
      d.city.toLowerCase().includes(query.toLowerCase()) ||
      d.state.toLowerCase().includes(query.toLowerCase()) ||
      d.iata.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        onClick={() => setIsOpen(true)}
        className="w-full h-14 bg-white border border-slate-300 hover:border-primary/70 rounded-xl px-4 flex items-center gap-3 transition shadow-xs focus-within:ring-2 focus-within:ring-primary/20 cursor-text"
      >
        <MapPin className="size-5 text-primary shrink-0" />
        <div className="flex flex-col w-full min-w-0">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            {label}
          </span>
          <input
            type="text"
            value={query}
            placeholder={placeholder}
            onChange={(e) => {
              setQuery(e.target.value);
              onChange(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="w-full text-sm font-medium text-slate-900 bg-transparent border-none outline-hidden p-0 truncate placeholder:text-slate-400"
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[280px] bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Search className="size-3.5" />
            Destinos Populares
          </div>
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <button
                key={item.iata + item.city}
                type="button"
                onClick={() => {
                  const val = airportsOnly
                    ? `${item.city} (${item.iata})`
                    : item.city;
                  setQuery(val);
                  onChange(val);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-slate-50 transition group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <MapPin className="size-4 text-slate-400 group-hover:text-primary transition shrink-0" />
                  <div className="truncate">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {item.city}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{item.state}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md shrink-0">
                  {item.iata}
                </span>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-slate-500 text-center">
              Nenhum destino encontrado.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
