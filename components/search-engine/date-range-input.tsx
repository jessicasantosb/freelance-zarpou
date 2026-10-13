"use client";

import { useMemo } from "react";
import { Calendar } from "lucide-react";

interface DateRangeInputProps {
  startDate: string;
  endDate: string;
  startLabel?: string;
  endLabel?: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
  singleDate?: boolean;
}

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "Selecione";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return dateStr;
}

export function DateRangeInput({
  startDate,
  endDate,
  startLabel = "Check-in",
  endLabel = "Check-out",
  onStartChange,
  onEndChange,
  singleDate = false,
}: DateRangeInputProps) {
  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  return (
    <div className={`w-full grid ${singleDate ? "grid-cols-1" : "grid-cols-2"} gap-2`}>
      {/* Campo Inicial / Ida / Check-in */}
      <div className="h-14 bg-white border border-slate-300 hover:border-primary/70 rounded-xl px-2.5 sm:px-3 flex items-center gap-2 transition shadow-xs focus-within:ring-2 focus-within:ring-primary/20 relative cursor-pointer group">
        <Calendar className="size-4.5 text-primary shrink-0 pointer-events-none group-hover:scale-105 transition-transform" />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate pointer-events-none">
            {startLabel}
          </span>
          <span className="text-xs sm:text-[13px] md:text-sm font-bold text-slate-900 tracking-tight whitespace-nowrap pointer-events-none">
            {formatDisplayDate(startDate)}
          </span>
        </div>
        <input
          type="date"
          value={startDate}
          min={todayStr}
          onChange={(e) => {
            const val = e.target.value;
            onStartChange(val);
            if (val && endDate && val > endDate) {
              onEndChange(val);
            }
          }}
          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
          title={startLabel}
        />
      </div>

      {/* Campo Final / Volta / Check-out */}
      {!singleDate && (
        <div className="h-14 bg-white border border-slate-300 hover:border-primary/70 rounded-xl px-2.5 sm:px-3 flex items-center gap-2 transition shadow-xs focus-within:ring-2 focus-within:ring-primary/20 relative cursor-pointer group">
          <Calendar className="size-4.5 text-primary shrink-0 pointer-events-none group-hover:scale-105 transition-transform" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate pointer-events-none">
              {endLabel}
            </span>
            <span className="text-xs sm:text-[13px] md:text-sm font-bold text-slate-900 tracking-tight whitespace-nowrap pointer-events-none">
              {formatDisplayDate(endDate)}
            </span>
          </div>
          <input
            type="date"
            value={endDate}
            min={startDate || todayStr}
            onChange={(e) => {
              const val = e.target.value;
              if (startDate && val < startDate) {
                onEndChange(startDate);
              } else {
                onEndChange(val);
              }
            }}
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
            title={endLabel}
          />
        </div>
      )}
    </div>
  );
}
