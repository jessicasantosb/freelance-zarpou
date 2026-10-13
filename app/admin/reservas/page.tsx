"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Eye, CalendarCheck, Hotel, Plane } from "lucide-react";
import { useBookingStore } from "@/stores/booking-store";

export default function AdminReservasPage() {
  const { bookings, fetchAllBookings } = useBookingStore();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  useEffect(() => {
    setMounted(true);
    fetchAllBookings();
  }, [fetchAllBookings]);

  if (!mounted) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        Carregando reservas...
      </div>
    );
  }

  const safeBookings = Array.isArray(bookings) ? bookings : [];

  const filtered = safeBookings.filter((b) => {
    if (statusFilter !== "todos" && b.status !== statusFilter) return false;
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      (b.locatorCode || "").toLowerCase().includes(term) ||
      b.travelers?.some((t) => (t.fullName || "").toLowerCase().includes(term)) ||
      (b.hotel?.name || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Reservas & Pedidos dos Clientes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Histórico completo de compras e vouchers emitidos pelo app
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por PNR ou nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-3 text-xs bg-white rounded-xl border border-slate-300 outline-hidden focus:border-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 outline-hidden"
          >
            <option value="todos">Todos os Status</option>
            <option value="confirmada">Confirmadas</option>
            <option value="pendente_pagamento">Aguardando Pagamento</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <CalendarCheck className="size-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">
              Nenhuma reserva encontrada
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Quando clientes realizarem compras no site, elas aparecerão listadas aqui com atualização em tempo real.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3">PNR (Localizador)</th>
                  <th className="pb-3">Titular</th>
                  <th className="pb-3">Serviço / Produto</th>
                  <th className="pb-3">Datas</th>
                  <th className="pb-3">Meio de Pagamento</th>
                  <th className="pb-3">Valor Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Voucher</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 font-mono font-black text-primary">
                      {b.locatorCode}
                    </td>
                    <td className="py-4">
                      <p className="font-bold text-slate-900">
                        {b.travelers?.[0]?.fullName || "Cliente"}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {b.travelers?.[0]?.email || ""}
                      </p>
                    </td>
                    <td className="py-4 max-w-[200px]">
                      <div className="flex items-center gap-2 truncate">
                        {b.productType === "hotel" ? (
                          <Hotel className="size-3.5 text-primary shrink-0" />
                        ) : (
                          <Plane className="size-3.5 text-primary shrink-0" />
                        )}
                        <span className="truncate">
                          {b.productType === "hotel"
                            ? b.hotel?.name || "Hotel"
                            : b.flight?.outbound?.airline || "Voo"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-500 whitespace-nowrap">
                      {b.checkInDate} → {b.checkOutDate}
                    </td>
                    <td className="py-4 uppercase text-[10px] font-bold text-slate-600">
                      {b.paymentMethod === "credit_card"
                        ? `Cartão (${b.installments}x)`
                        : b.paymentMethod === "pix"
                        ? "Pix"
                        : "Boleto"}
                    </td>
                    <td className="py-4 font-black text-slate-900">
                      R$ {(b.pricing?.finalAmount || 0).toFixed(2)}
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          b.status === "confirmada"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {b.status === "confirmada" ? "✓ Confirmada" : "Pendente Pix"}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        href={`/reserva/confirmada/${b.id}`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold inline-flex items-center gap-1.5 transition shadow-2xs"
                      >
                        <Eye className="size-3.5" />
                        Voucher
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
