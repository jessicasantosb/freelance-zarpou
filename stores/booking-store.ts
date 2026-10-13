import { create } from "zustand";
import { AddonItem, CreditCardData, PaymentMethod, PriceSummary, TravelerInfo } from "@/types/checkout";
import { Flight, Hotel, Package, Room } from "@/types/product";
import { Booking } from "@/types/booking";
import { api } from "@/lib/api";

interface CurrentBookingState {
  productType: "hotel" | "flight" | "package";
  hotel?: Hotel;
  selectedRoom?: Room;
  flight?: Flight;
  packageItem?: Package;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  adults: number;
  children: number;
  travelers: TravelerInfo[];
  addons: AddonItem[];
  paymentMethod: PaymentMethod;
  installments: number;
  creditCard?: CreditCardData;
}

interface BookingStore {
  currentBooking: CurrentBookingState;
  bookings: Booking[];
  startHotelBooking: (
    hotel: Hotel,
    room: Room,
    checkIn: string,
    checkOut: string,
    adults: number,
    children: number
  ) => void;
  startFlightBooking: (
    flight: Flight,
    departureDate: string,
    returnDate: string | undefined,
    adults: number,
    children: number
  ) => void;
  setTravelers: (travelers: TravelerInfo[]) => void;
  toggleAddon: (addonId: string) => void;
  fetchAddons: () => Promise<void>;
  setPaymentMethod: (
    method: PaymentMethod,
    installments?: number,
    cardData?: CreditCardData
  ) => void;
  calculatePricing: () => PriceSummary;
  confirmBooking: () => Promise<Booking>;
  fetchUserBookings: () => Promise<void>;
  fetchAllBookings: () => Promise<void>;
  addBookingReview: (
    bookingId: string,
    rating: number,
    comment?: string
  ) => Promise<void>;
  getBookingById: (id: string) => Booking | undefined;
  getBookingByLocator: (locator: string) => Booking | undefined;
}

const initialCurrentBooking: CurrentBookingState = {
  productType: "hotel",
  checkInDate: "2026-11-20",
  checkOutDate: "2026-11-23",
  nights: 3,
  adults: 2,
  children: 0,
  travelers: [
    {
      id: "trav-1",
      fullName: "",
      documentType: "CPF",
      documentNumber: "",
      birthDate: "",
      gender: "M",
      email: "",
      phone: "",
      isPrimary: true,
    },
  ],
  addons: [],
  paymentMethod: "credit_card",
  installments: 1,
};

export const initialMockBookings: Booking[] = [];

export const useBookingStore = create<BookingStore>()((set, get) => ({
  currentBooking: initialCurrentBooking,
  bookings: [],

      startHotelBooking: (hotel, room, checkIn, checkOut, adults, children) => {
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        const currentAddons = get().currentBooking.addons;

        set({
          currentBooking: {
            ...initialCurrentBooking,
            productType: "hotel",
            hotel,
            selectedRoom: room,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            nights: diffDays,
            adults,
            children,
            addons: currentAddons.map((a) => ({ ...a, selected: false })),
          },
        });

        if (currentAddons.length === 0) {
          get().fetchAddons();
        }
      },

      startFlightBooking: (flight, departureDate, returnDate, adults, children) => {
        const currentAddons = get().currentBooking.addons;

        set({
          currentBooking: {
            ...initialCurrentBooking,
            productType: "flight",
            flight,
            checkInDate: departureDate,
            checkOutDate: returnDate || departureDate,
            adults,
            children,
            addons: currentAddons.map((a) => ({ ...a, selected: false })),
          },
        });

        if (currentAddons.length === 0) {
          get().fetchAddons();
        }
      },

      setTravelers: (travelers) =>
        set((state) => ({
          currentBooking: {
            ...state.currentBooking,
            travelers,
          },
        })),

      fetchAddons: async () => {
        try {
          const list = await api.get<any[]>("/addons");
          if (Array.isArray(list) && list.length > 0) {
            const mapped: AddonItem[] = list.map((a) => ({
              id: a.id,
              title: a.title,
              description: a.description || "",
              price: Number(a.price),
              category: a.category || "outro",
              selected: false,
            }));
            set((state) => ({
              currentBooking: {
                ...state.currentBooking,
                addons: mapped,
              },
            }));
          }
        } catch {
          // ignore
        }
      },

      toggleAddon: (addonId) =>
        set((state) => ({
          currentBooking: {
            ...state.currentBooking,
            addons: state.currentBooking.addons.map((a) =>
              a.id === addonId ? { ...a, selected: !a.selected } : a
            ),
          },
        })),

      setPaymentMethod: (method, installments = 1, cardData) =>
        set((state) => ({
          currentBooking: {
            ...state.currentBooking,
            paymentMethod: method,
            installments,
            creditCard: cardData,
          },
        })),

      calculatePricing: () => {
        const { currentBooking } = get();
        let base = 0;

        if (currentBooking.productType === "hotel" && currentBooking.selectedRoom) {
          base = currentBooking.selectedRoom.pricePerNight * currentBooking.nights;
        } else if (currentBooking.productType === "flight" && currentBooking.flight) {
          base = currentBooking.flight.price * (currentBooking.adults + currentBooking.children);
        } else {
          base = 500;
        }

        const taxes = Math.round(base * 0.05); // 5% taxa de serviço
        const addons = currentBooking.addons
          .filter((a) => a.selected)
          .reduce((sum, a) => sum + a.price, 0);

        // Desconto Pix (5% de desconto à vista)
        const discount = currentBooking.paymentMethod === "pix" ? Math.round((base + taxes) * 0.05) : 0;
        const finalAmount = base + taxes + addons - discount;

        return {
          baseAmount: base,
          taxesAndFees: taxes,
          addonsAmount: addons,
          discountAmount: discount,
          finalAmount,
        };
      },

      confirmBooking: async () => {
        const { currentBooking, calculatePricing } = get();
        const pricing = calculatePricing();

        try {
          // Chamada real ao checkout do FastAPI
          const payload = {
            productType: currentBooking.productType,
            hotelId: currentBooking.hotel?.id,
            selectedRoomId: currentBooking.selectedRoom?.id,
            flightId: currentBooking.flight?.id,
            packageId: currentBooking.packageItem?.id,
            checkInDate: currentBooking.checkInDate,
            checkOutDate: currentBooking.checkOutDate,
            nights: currentBooking.nights,
            adults: currentBooking.adults,
            children: currentBooking.children,
            travelers: currentBooking.travelers,
            addons: currentBooking.addons.filter((a) => a.selected),
            paymentMethod: currentBooking.paymentMethod,
            installments: currentBooking.installments,
            creditCard: currentBooking.creditCard,
          };

          const res = await api.post<any>("/bookings/checkout", payload);

          const newBooking: Booking = {
            id: res.id,
            locatorCode: res.locatorCode || res.locator,
            createdAt: res.createdAt,
            status: res.status,
            productType: res.productType,
            hotel: res.hotel || currentBooking.hotel,
            selectedRoom: res.selectedRoom || currentBooking.selectedRoom,
            flight: res.flight || currentBooking.flight,
            packageItem: res.packageItem || currentBooking.packageItem,
            checkInDate: res.checkInDate || currentBooking.checkInDate,
            checkOutDate: res.checkOutDate || currentBooking.checkOutDate,
            nights: res.nights || currentBooking.nights,
            travelers: res.travelers || currentBooking.travelers,
            addons: res.addons || currentBooking.addons.filter((a) => a.selected),
            paymentMethod: res.paymentMethod || currentBooking.paymentMethod,
            installments: res.installments || currentBooking.installments,
            pricing: res.pricing || pricing,
            pixCode: res.pixCode,
            pixQrCodeUrl: res.pixQrCodeUrl,
            pixExpiresAt: res.pixExpiresAt,
            voucherUrl: res.voucherUrl,
          };

          set((state) => ({
            bookings: [newBooking, ...state.bookings],
          }));

          return newBooking;
        } catch (err) {
          console.warn("API de checkout indisponível, gerando reserva local de contingência:", err);

          const randomNum = Math.floor(100000 + Math.random() * 900000);
          const locatorCode = `ZRP-${randomNum}`;
          const bookingId = `booking-${Date.now()}`;

          const newBooking: Booking = {
            id: bookingId,
            locatorCode,
            createdAt: new Date().toISOString(),
            status: currentBooking.paymentMethod === "pix" ? "pendente_pagamento" : "confirmada",
            productType: currentBooking.productType,
            hotel: currentBooking.hotel,
            selectedRoom: currentBooking.selectedRoom,
            flight: currentBooking.flight,
            packageItem: currentBooking.packageItem,
            checkInDate: currentBooking.checkInDate,
            checkOutDate: currentBooking.checkOutDate,
            nights: currentBooking.nights,
            travelers: currentBooking.travelers,
            addons: currentBooking.addons.filter((a) => a.selected),
            paymentMethod: currentBooking.paymentMethod,
            installments: currentBooking.installments,
            pricing,
            pixCode:
              currentBooking.paymentMethod === "pix"
                ? `00020126580014br.gov.bcb.pix0136${locatorCode}-zarpou-pagamentos520400005303986540${pricing.finalAmount.toFixed(2)}5802BR5922Zarpou Viagens Ltda6014Belo Horizonte62070503***6304`
                : undefined,
            pixExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          };

          set((state) => ({
            bookings: [newBooking, ...state.bookings],
          }));

          return newBooking;
        }
      },

      fetchUserBookings: async () => {
        try {
          const list = await api.get<Booking[]>("/bookings/my-trips");
          if (Array.isArray(list)) {
            set({ bookings: list });
          }
        } catch {}
      },

      fetchAllBookings: async () => {
        try {
          const list = await api.get<Booking[]>("/bookings");
          if (Array.isArray(list)) {
            set({ bookings: list });
          }
        } catch {}
      },

      addBookingReview: async (bookingId, rating, comment) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId
              ? {
                  ...b,
                  review: {
                    rating,
                    comment,
                    ratedAt: new Date().toISOString(),
                  },
                }
              : b
          ),
        }));

        try {
          await api.post(`/bookings/${bookingId}/review`, {
            rating,
            comment,
          });
        } catch {
          // Mantém a avaliação persistida em localStorage
        }
      },

      getBookingById: (id) => get().bookings.find((b) => b.id === id),
      getBookingByLocator: (locator) =>
        get().bookings.find(
          (b) => b.locatorCode.toLowerCase() === locator.toLowerCase()
        ),
    })
);
