"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  CalendarCheck,
  Tag,
  Hotel,
  TrendingUp,
  ArrowRight,
  Eye,
} from "lucide-react";
import { useBookingStore } from "@/stores/booking-store";
import { useProductStore } from "@/stores/product-store";
import { usePromotionStore } from "@/stores/promotion-store";

export default function AdminDashboardPage() {
  const { bookings } = useBookingStore();
  const { hotels, flights } = useProductStore();
  const { promotions } = usePromotionStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        Carregando painel administrativo...
      </div>
    );
  }

  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const safeHotels = Array.isArray(hotels) ? hotels : [];
  const safeFlights = Array.isArray(flights) ? flights : [];
  const safePromotions = Array.isArray(promotions) ? promotions : [];

  const totalRevenue = safeBookings.reduce(
    (sum, b) => sum + (b?.pricing?.finalAmount || 0),
    0
  );
  const totalBookings = safeBookings.length;
  const activePromos = safePromotions.filter((p) => p?.active).length;
  const totalProducts = safeHotels.length + safeFlights.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">
          Visão Geral da Agência
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Métricas de vendas, reservas e status do catálogo da Zarpou Viagens
        </p>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Faturamento Total
            </span>
            <p className="text-2xl font-black text-primary mt-1">
              R$ {totalRevenue.toFixed(2)}
            </p>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="size-3" />
              100% no app próprio
            </span>
          </div>
          <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <DollarSign className="size-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Reservas Realizadas
            </span>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {totalBookings}
            </p>
            <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
              Comprovantes gerados
            </span>
          </div>
          <div className="size-12 rounded-2xl bg-secondary/20 text-primary flex items-center justify-center">
            <CalendarCheck className="size-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Promoções Ativas
            </span>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {activePromos}
            </p>
            <Link
              href="/admin/promocoes"
              className="text-[11px] font-semibold text-primary hover:underline mt-1 block"
            >
              Gerenciar Banners →
            </Link>
          </div>
          <div className="size-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Tag className="size-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Catálogo Ativo
            </span>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {totalProducts}
            </p>
            <Link
              href="/admin/produtos"
              className="text-[11px] font-semibold text-primary hover:underline mt-1 block"
            >
              Ajustar Preços →
            </Link>
          </div>
          <div className="size-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Hotel className="size-6" />
          </div>
        </div>
      </div>

      {/* ÚLTIMAS RESERVAS RECEBIDAS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Últimas Reservas de Clientes
            </h2>
            <p className="text-xs text-slate-500">
              Pedidos efetuados com emissão de voucher e pagamento no app
            </p>
          </div>

          <Link
            href="/admin/reservas"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            Ver todas
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {safeBookings.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Nenhuma reserva recebida até o momento. Faça uma simulação no site para ver o pedido refletido aqui!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3">Localizador</th>
                  <th className="pb-3">Titular</th>
                  <th className="pb-3">Produto</th>
                  <th className="pb-3">Data</th>
                  <th className="pb-3">Pagamento</th>
                  <th className="pb-3">Valor</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {safeBookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 font-mono font-bold text-primary">
                      {b.locatorCode}
                    </td>
                    <td className="py-3">
                      {b.travelers?.[0]?.fullName || "Cliente Zarpou"}
                    </td>
                    <td className="py-3 truncate max-w-[180px]">
                      {b.productType === "hotel"
                        ? b.hotel?.name || "Hotel"
                        : b.flight?.outbound?.airline || "Voo"}
                    </td>
                    <td className="py-3 text-slate-400">
                      {b.createdAt
                        ? new Date(b.createdAt).toLocaleDateString("pt-BR")
                        : "Recente"}
                    </td>
                    <td className="py-3 uppercase text-[10px]">
                      {b.paymentMethod === "credit_card"
                        ? "Cartão"
                        : b.paymentMethod === "pix"
                        ? "Pix"
                        : "Boleto"}
                    </td>
                    <td className="py-3 font-bold text-slate-900">
                      R$ {(b.pricing?.finalAmount || 0).toFixed(2)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === "confirmada"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/reserva/confirmada/${b.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 inline-flex items-center gap-1"
                      >
                        <Eye className="size-3.5" />
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
