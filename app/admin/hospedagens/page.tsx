"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Hotel as HotelIcon,
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  X,
  Check,
  Star,
  MapPin,
  Loader2,
  Bed,
  Image as ImageIcon,
  Coffee,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import { useProductStore } from "@/stores/product-store";
import { Hotel, Room } from "@/types/product";
import { ImageUploader } from "@/components/admin/image-uploader";
import { useConfirm } from "@/components/shared/confirm-dialog-provider";

const DEFAULT_HOTEL_IMG =
  "https://images.pexels.com/photos/720300/pexels-photo-720300.jpeg";

const COMMON_AMENITIES = [
  "Café da Manhã Incluso",
  "Piscina",
  "Wi-Fi Grátis",
  "Academia",
  "Frente à Praia",
  "Spa",
  "Restaurante",
  "Estacionamento",
  "Pet Friendly",
  "Ar-condicionado",
  "Bar na Piscina",
  "Serviço de Quarto 24h",
];

const BED_OPTIONS = [
  "1 Cama King Size",
  "1 Cama Queen Size",
  "1 Cama de Casal",
  "2 Camas de Solteiro",
  "1 Cama Queen + 1 Sofá-cama",
  "2 Camas Queen Size",
  "3 Camas de Solteiro",
  "1 Cama King + 1 Cama de Solteiro",
  "1 Cama de Casal + 1 Beliche",
];

const DEFAULT_ROOMS_SAMPLE: Room[] = [
  {
    id: "room-default-1",
    name: "Apartamento Standard",
    description: "Acomodação confortável com ar-condicionado, Wi-Fi de alta velocidade e varanda.",
    maxAdults: 2,
    maxChildren: 1,
    beds: "1 Cama Queen Size",
    sizeM2: 28,
    pricePerNight: 650,
    originalPricePerNight: 820,
    freeCancellation: true,
    breakfastIncluded: true,
    availableRooms: 5,
    amenities: ["Wi-Fi", "Ar-condicionado"],
  },
  {
    id: "room-default-2",
    name: "Suíte Luxo com Vista para o Mar",
    description: "Ampla suíte com banheira de hidromassagem, cama king size e vista panorâmica.",
    maxAdults: 2,
    maxChildren: 2,
    beds: "1 Cama King Size",
    sizeM2: 45,
    pricePerNight: 980,
    originalPricePerNight: 1250,
    freeCancellation: true,
    breakfastIncluded: true,
    availableRooms: 3,
    amenities: ["Wi-Fi", "Ar-condicionado", "Hidromassagem", "Vista Mar"],
  },
];

export default function AdminHospedagensPage() {
  const { confirm } = useConfirm();
  const { hotels, fetchHotels, addHotel, updateHotel, deleteHotel, resetCatalog } =
    useProductStore();

  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"geral" | "quartos" | "fotos" | "comodidades">("geral");

  // Form State - Dados Gerais
  const [formName, setFormName] = useState("");
  const [formCity, setFormCity] = useState("Rio de Janeiro");
  const [formState, setFormState] = useState("RJ");
  const [formNeighborhood, setFormNeighborhood] = useState("Copacabana");
  const [formAddress, setFormAddress] = useState("Av. Atlântica, 1702");
  const [formStars, setFormStars] = useState(5);
  const [formBadge, setFormBadge] = useState("Recomendado");
  const [formMaxInstallments, setFormMaxInstallments] = useState(12);
  const [formDescription, setFormDescription] = useState("");
  const [formImageUrl, setFormImageUrl] = useState(DEFAULT_HOTEL_IMG);
  const [formGallery, setFormGallery] = useState<string[]>([
    "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
  ]);
  const [newGalleryPhotoUrl, setNewGalleryPhotoUrl] = useState("");
  const [formAmenities, setFormAmenities] = useState<string[]>([
    "Café da Manhã Incluso",
    "Piscina",
    "Wi-Fi Grátis",
  ]);

  // Form State - Quartos Dinâmicos com Tipos de Cama
  const [formRooms, setFormRooms] = useState<Room[]>(DEFAULT_ROOMS_SAMPLE);

  useEffect(() => {
    setMounted(true);
    if (hotels.length === 0) {
      fetchHotels();
    }
  }, [hotels.length, fetchHotels]);

  if (!mounted) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        Carregando hospedagens...
      </div>
    );
  }

  const handleOpenNew = () => {
    setEditingId(null);
    setFormName("");
    setFormCity("Rio de Janeiro");
    setFormState("RJ");
    setFormNeighborhood("Copacabana");
    setFormAddress("Av. Atlântica, 1702");
    setFormStars(5);
    setFormBadge("Oferta Zarpou");
    setFormMaxInstallments(12);
    setFormDescription(
      "Experiência única de hospedagem com vista privilegiada, gastronomia impecável e atendimento de excelência para sua família."
    );
    setFormImageUrl(DEFAULT_HOTEL_IMG);
    setFormGallery([
      "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg",
      "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    ]);
    setNewGalleryPhotoUrl("");
    setFormAmenities(["Café da Manhã Incluso", "Piscina", "Wi-Fi Grátis", "Ar-condicionado"]);
    setFormRooms([
      {
        id: `room-${Date.now()}-1`,
        name: "Apartamento Standard",
        description: "Acomodação confortável com ar-condicionado, Wi-Fi e varanda.",
        maxAdults: 2,
        maxChildren: 1,
        beds: "1 Cama Queen Size",
        sizeM2: 28,
        pricePerNight: 650,
        originalPricePerNight: 820,
        freeCancellation: true,
        breakfastIncluded: true,
        availableRooms: 5,
        amenities: ["Wi-Fi", "Ar-condicionado"],
      },
      {
        id: `room-${Date.now()}-2`,
        name: "Suíte Luxo com Vista para o Mar",
        description: "Ampla suíte com banheira de hidromassagem, cama king size e vista panorâmica.",
        maxAdults: 2,
        maxChildren: 2,
        beds: "1 Cama King Size",
        sizeM2: 45,
        pricePerNight: 980,
        originalPricePerNight: 1250,
        freeCancellation: true,
        breakfastIncluded: true,
        availableRooms: 3,
        amenities: ["Wi-Fi", "Ar-condicionado", "Hidromassagem", "Vista Mar"],
      },
    ]);
    setActiveTab("geral");
    setModalOpen(true);
  };

  const handleOpenEdit = (hotel: Hotel) => {
    setEditingId(hotel.id);
    setFormName(hotel.name || "");
    setFormCity(hotel.city || "");
    setFormState(hotel.state || "");
    setFormNeighborhood(hotel.neighborhood || "");
    setFormAddress(hotel.address || `${hotel.neighborhood}, ${hotel.city}`);
    setFormStars(hotel.stars || 4);
    setFormBadge(hotel.badges?.[0] || "");
    setFormMaxInstallments(hotel.maxInstallments || 12);
    setFormDescription(hotel.description || "");
    setFormImageUrl(hotel.imageUrl || DEFAULT_HOTEL_IMG);
    setFormGallery(
      hotel.gallery && hotel.gallery.length > 0
        ? hotel.gallery.filter((g) => g !== hotel.imageUrl)
        : []
    );
    setNewGalleryPhotoUrl("");
    setFormAmenities(hotel.amenities || ["Piscina", "Wi-Fi Grátis"]);
    setFormRooms(
      hotel.rooms && hotel.rooms.length > 0
        ? hotel.rooms
        : [
            {
              id: `room-${Date.now()}-1`,
              name: "Apartamento Standard",
              description: "Acomodação confortável com ar-condicionado e Wi-Fi.",
              maxAdults: 2,
              maxChildren: 1,
              beds: "1 Cama Queen Size",
              sizeM2: 28,
              pricePerNight: hotel.basePricePerNight || 600,
              originalPricePerNight: hotel.originalPricePerNight || 750,
              freeCancellation: true,
              breakfastIncluded: true,
              availableRooms: 5,
              amenities: hotel.amenities || [],
            },
          ]
    );
    setActiveTab("geral");
    setModalOpen(true);
  };

  const toggleAmenity = (item: string) => {
    if (formAmenities.includes(item)) {
      setFormAmenities(formAmenities.filter((a) => a !== item));
    } else {
      setFormAmenities([...formAmenities, item]);
    }
  };

  // Funções de Gestão de Quartos Dinâmicos
  const handleAddRoom = () => {
    const newRoom: Room = {
      id: `room-${Date.now()}-${formRooms.length + 1}`,
      name: `Novo Quarto ${formRooms.length + 1}`,
      description: "Acomodação completa com banheiro privativo, ar-condicionado e TV a cabo.",
      maxAdults: 2,
      maxChildren: 1,
      beds: "1 Cama Queen Size",
      sizeM2: 32,
      pricePerNight: formRooms.length > 0 ? formRooms[0].pricePerNight : 500,
      originalPricePerNight: formRooms.length > 0 ? formRooms[0].originalPricePerNight : undefined,
      freeCancellation: true,
      breakfastIncluded: true,
      availableRooms: 4,
      amenities: ["Wi-Fi", "Ar-condicionado"],
    };
    setFormRooms([...formRooms, newRoom]);
  };

  const handleRemoveRoom = (index: number) => {
    if (formRooms.length <= 1) {
      toast.warning("A hospedagem deve possuir pelo menos um tipo de quarto.");
      return;
    }
    setFormRooms(formRooms.filter((_, idx) => idx !== index));
  };

  const handleUpdateRoom = <K extends keyof Room>(index: number, field: K, value: Room[K]) => {
    setFormRooms(
      formRooms.map((room, idx) => {
        if (idx === index) {
          return { ...room, [field]: value };
        }
        return room;
      })
    );
  };

  // Funções de Galeria de Fotos Extras
  const handleAddGalleryPhoto = () => {
    if (!newGalleryPhotoUrl.trim()) return;
    setFormGallery([...formGallery, newGalleryPhotoUrl.trim()]);
    setNewGalleryPhotoUrl("");
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    setFormGallery(formGallery.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.warning("Informe o nome do hotel.");
      return;
    }

    if (formRooms.length === 0) {
      toast.warning("Adicione pelo menos um quarto à hospedagem.");
      return;
    }

    // Calcula a diária base a partir do menor preço de quarto configurado
    const lowestRoomPrice = Math.min(...formRooms.map((r) => r.pricePerNight));
    const lowestOriginalPrice = formRooms.some((r) => r.originalPricePerNight)
      ? Math.min(
          ...formRooms
            .filter((r) => r.originalPricePerNight && r.originalPricePerNight > r.pricePerNight)
            .map((r) => r.originalPricePerNight!)
        )
      : undefined;

    const discount =
      lowestOriginalPrice && lowestOriginalPrice > lowestRoomPrice
        ? Math.round(((lowestOriginalPrice - lowestRoomPrice) / lowestOriginalPrice) * 100)
        : 0;

    // Galeria completa com foto principal na primeira posição
    const completeGallery = [formImageUrl, ...formGallery.filter((g) => g && g !== formImageUrl)];

    const existingHotel = editingId ? hotels.find((h) => h.id === editingId) : null;

    const hotelData: Hotel = {
      id: editingId || `hotel-${Date.now()}`,
      name: formName,
      city: formCity,
      state: formState,
      country: "Brasil",
      stars: formStars,
      rating: existingHotel ? existingHotel.rating : 0, // Nota vem das avaliações reais dos clientes
      reviewCount: existingHotel ? existingHotel.reviewCount : 0,
      reviewLabel: existingHotel ? existingHotel.reviewLabel : "Excelente",
      address: formAddress || `${formNeighborhood}, ${formCity} - ${formState}`,
      neighborhood: formNeighborhood,
      description: formDescription,
      imageUrl: formImageUrl,
      gallery: completeGallery,
      amenities: formAmenities,
      basePricePerNight: lowestRoomPrice,
      originalPricePerNight: lowestOriginalPrice,
      discountPercent: discount,
      maxInstallments: formMaxInstallments,
      badges: formBadge ? [formBadge] : [],
      featured: true,
      rooms: formRooms,
    };

    setIsSaving(true);
    try {
      if (editingId) {
        await updateHotel(editingId, hotelData);
        toast.success("Hospedagem e quartos atualizados com sucesso!");
      } else {
        await addHotel(hotelData);
        toast.success("Nova hospedagem e quartos cadastrados com sucesso!");
      }
      setModalOpen(false);
    } catch {
      toast.error("Erro ao salvar hospedagem. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-primary text-[11px] font-black uppercase tracking-wider mb-2">
            <HotelIcon className="size-3 text-secondary fill-secondary" />
            Catálogo Completo
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Hospedagens & Quartos
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie acomodações, tipos de camas, comodidades e fotos para exibição no site e detalhes (/hospedagens/item)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={async () => {
              const confirmed = await confirm({
                title: "Restaurar Hospedagens Padrão",
                description: "Deseja restaurar a lista original de hotéis e hospedagens da Zarpou?",
                confirmText: "Restaurar",
                cancelText: "Cancelar",
                variant: "warning",
                icon: "warning",
              });
              if (confirmed) {
                resetCatalog();
                toast.info("Catálogo de hospedagens restaurado com sucesso!");
              }
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            Restaurar Padrões
          </button>

          <button
            type="button"
            onClick={handleOpenNew}
            className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Plus className="size-4" />
            Adicionar Hotel
          </button>
        </div>
      </div>

      {/* LISTA DE CARDS DE HOTÉIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => {
          const installment = (
            hotel.basePricePerNight / (hotel.maxInstallments || 12)
          ).toFixed(2);

          return (
            <div
              key={hotel.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* IMAGEM E SELOS */}
                <div className="relative h-48 w-full bg-slate-100">
                  <Image
                    src={hotel.imageUrl || DEFAULT_HOTEL_IMG}
                    alt={hotel.name}
                    fill
                    unoptimized={hotel.imageUrl?.startsWith("data:")}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {hotel.badges && hotel.badges[0] && (
                    <div className="absolute top-3 left-3 bg-secondary text-primary font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                      {hotel.badges[0]}
                    </div>
                  )}

                  {hotel.rating > 0 && (
                    <div className="absolute top-3 right-3 bg-primary text-white px-2 py-0.5 rounded-lg flex items-center gap-1 text-xs font-black">
                      <Star className="size-3 text-secondary fill-secondary" />
                      <span>{hotel.rating.toFixed(1)}</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1 font-semibold truncate drop-shadow-xs">
                      <MapPin className="size-3 text-secondary shrink-0" />
                      {hotel.neighborhood || hotel.city}, {hotel.state}
                    </span>
                    <span className="text-[11px] text-white/80 shrink-0">
                      {hotel.rooms?.length || 1} {(hotel.rooms?.length || 1) === 1 ? "quarto" : "quartos"}
                    </span>
                  </div>
                </div>

                {/* DADOS */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: hotel.stars }).map((_, i) => (
                        <Star
                          key={i}
                          className="size-3 fill-amber-400 text-amber-400"
                        />
                      ))}
                      <span className="text-[11px] text-slate-400 ml-1 font-medium">
                        {hotel.stars} estrelas
                      </span>
                    </div>

                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                      {hotel.rooms?.length || 1} opçõe{(hotel.rooms?.length || 1) === 1 ? "o" : "s"}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                    {hotel.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {hotel.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      {hotel.originalPricePerNight &&
                        hotel.originalPricePerNight > hotel.basePricePerNight && (
                          <p className="text-[10px] text-slate-400 line-through">
                            De R$ {hotel.originalPricePerNight.toLocaleString("pt-BR")}
                          </p>
                        )}
                      <p className="text-lg font-black text-primary">
                        R$ {hotel.basePricePerNight.toLocaleString("pt-BR")}
                        <span className="text-xs font-normal text-slate-400">
                          {" "}
                          / noite
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-400">
                        ou em até {hotel.maxInstallments || 12}x de R$ {installment} sem juros
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AÇÕES */}
              <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(hotel)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-primary text-primary text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <Edit2 className="size-3.5" />
                  Editar
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    const confirmed = await confirm({
                      title: "Excluir Hospedagem",
                      description: `Tem certeza que deseja excluir o hotel "${hotel.name}"? Esta ação não pode ser desfeita.`,
                      confirmText: "Excluir",
                      cancelText: "Cancelar",
                      variant: "destructive",
                      icon: "trash",
                    });
                    if (confirmed) {
                      await deleteHotel(hotel.id);
                      toast.success("Hospedagem excluída com sucesso!");
                    }
                  }}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                  Excluir
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DE CRIAÇÃO / EDIÇÃO COMPLETO */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 border border-slate-200">
            {/* TOPO DO MODAL */}
            <div className="flex items-center justify-between p-5 pb-3 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  {editingId ? "Editar Hospedagem & Quartos" : "Cadastrar Nova Hospedagem"}
                </h2>
                <p className="text-xs text-slate-500">
                  Configure os dados exibidos na listagem e na tela de detalhes do hotel (/hospedagens/item)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* ABAS SUPERIORES DO MODAL */}
            <div className="flex border-b border-slate-200 bg-slate-50/80 px-4 pt-2 gap-2 shrink-0 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab("geral")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === "geral"
                    ? "bg-white text-primary border-t-2 border-primary shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <MapPin className="size-3.5" />
                Geral & Localização
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("quartos")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === "quartos"
                    ? "bg-white text-primary border-t-2 border-primary shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Bed className="size-3.5 text-secondary" />
                Quartos & Tipos de Camas ({formRooms.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("fotos")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === "fotos"
                    ? "bg-white text-primary border-t-2 border-primary shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <ImageIcon className="size-3.5" />
                Fotos & Descrição
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("comodidades")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === "comodidades"
                    ? "bg-white text-primary border-t-2 border-primary shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Check className="size-3.5" />
                Comodidades ({formAmenities.length})
              </button>
            </div>

            {/* FORMULÁRIO COM ROLAGEM */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                {/* 1. ABA GERAL & LOCALIZAÇÃO */}
                {activeTab === "geral" && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    {/* Nome do Hotel */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Nome do Hotel / Pousada / Resort *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Ex: Copacabana Palace Grand Luxury"
                        className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-semibold"
                      />
                    </div>

                    {/* Localização Detalhada */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                          Cidade *
                        </label>
                        <input
                          type="text"
                          required
                          value={formCity}
                          onChange={(e) => setFormCity(e.target.value)}
                          placeholder="Ex: Rio de Janeiro"
                          className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                          Estado (UF) *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={2}
                          value={formState}
                          onChange={(e) => setFormState(e.target.value.toUpperCase())}
                          placeholder="RJ"
                          className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-bold uppercase"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                          Bairro / Praia *
                        </label>
                        <input
                          type="text"
                          required
                          value={formNeighborhood}
                          onChange={(e) => setFormNeighborhood(e.target.value)}
                          placeholder="Ex: Copacabana"
                          className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-semibold"
                        />
                      </div>
                    </div>

                    {/* Endereço Completo */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Endereço Completo (Rua e Número)
                      </label>
                      <input
                        type="text"
                        value={formAddress}
                        onChange={(e) => setFormAddress(e.target.value)}
                        placeholder="Ex: Av. Atlântica, 1702"
                        className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-medium"
                      />
                    </div>

                    {/* Estrelas, Selo e Parcelamento */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                          Classificação (Estrelas)
                        </label>
                        <select
                          value={formStars}
                          onChange={(e) => setFormStars(Number(e.target.value))}
                          className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-semibold"
                        >
                          <option value={3}>3 Estrelas</option>
                          <option value={4}>4 Estrelas</option>
                          <option value={5}>5 Estrelas (Luxo)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                          Selo / Badge Destaque
                        </label>
                        <input
                          type="text"
                          value={formBadge}
                          onChange={(e) => setFormBadge(e.target.value)}
                          placeholder="Ex: Recomendado, Oferta Zarpou"
                          className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                          Max Parcelas Sem Juros
                        </label>
                        <select
                          value={formMaxInstallments}
                          onChange={(e) => setFormMaxInstallments(Number(e.target.value))}
                          className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-semibold"
                        >
                          <option value={6}>Até 6x sem juros</option>
                          <option value={10}>Até 10x sem juros</option>
                          <option value={12}>Até 12x sem juros</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ABA QUARTOS & TIPOS DE CAMAS */}
                {activeTab === "quartos" && (
                  <div className="space-y-5 animate-in fade-in duration-150">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60">
                      <div>
                        <h3 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                          <Bed className="size-4 text-amber-600" />
                          Opções de Quartos & Tipos de Camas
                        </h3>
                        <p className="text-[11px] text-amber-800/80 mt-0.5">
                          Adicione os quartos que o cliente poderá escolher na tela de reserva. Cada quarto tem seu tipo de cama e capacidade.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddRoom}
                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition shrink-0 cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                        Adicionar Quarto
                      </button>
                    </div>

                    {/* LISTA DE QUARTOS */}
                    <div className="space-y-4">
                      {formRooms.map((room, idx) => (
                        <div
                          key={room.id || idx}
                          className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3 relative group"
                        >
                          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                            <span className="text-xs font-extrabold text-primary flex items-center gap-1.5">
                              <span className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px]">
                                {idx + 1}
                              </span>
                              {room.name || `Quarto ${idx + 1}`}
                            </span>

                            {formRooms.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveRoom(idx)}
                                className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 transition cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                                Remover Quarto
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                            {/* Nome do Quarto */}
                            <div className="sm:col-span-6 space-y-1">
                              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                                Nome do Quarto *
                              </label>
                              <input
                                type="text"
                                required
                                value={room.name}
                                onChange={(e) => handleUpdateRoom(idx, "name", e.target.value)}
                                placeholder="Ex: Suíte Luxo Frente Mar"
                                className="w-full h-9 px-2.5 text-xs rounded-xl border border-slate-200 bg-white outline-hidden focus:border-primary font-semibold"
                              />
                            </div>

                            {/* Tipo de Cama */}
                            <div className="sm:col-span-6 space-y-1">
                              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                                <Bed className="size-3 text-secondary" />
                                Tipo de Cama *
                              </label>
                              <select
                                value={room.beds}
                                onChange={(e) => handleUpdateRoom(idx, "beds", e.target.value)}
                                className="w-full h-9 px-2.5 text-xs rounded-xl border border-slate-200 bg-white outline-hidden focus:border-primary font-semibold"
                              >
                                {BED_OPTIONS.map((bedOption) => (
                                  <option key={bedOption} value={bedOption}>
                                    {bedOption}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Diária e Preço Riscado */}
                            <div className="sm:col-span-3 space-y-1">
                              <label className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                                Diária (R$) *
                              </label>
                              <input
                                type="number"
                                required
                                min={50}
                                value={room.pricePerNight}
                                onChange={(e) =>
                                  handleUpdateRoom(idx, "pricePerNight", Number(e.target.value))
                                }
                                className="w-full h-9 px-2.5 text-xs rounded-xl border border-primary/40 bg-white outline-hidden focus:border-primary font-black text-primary"
                              />
                            </div>

                            <div className="sm:col-span-3 space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Preço De (Riscado)
                              </label>
                              <input
                                type="number"
                                value={room.originalPricePerNight || ""}
                                onChange={(e) =>
                                  handleUpdateRoom(
                                    idx,
                                    "originalPricePerNight",
                                    e.target.value ? Number(e.target.value) : undefined
                                  )
                                }
                                placeholder="Opcional"
                                className="w-full h-9 px-2.5 text-xs rounded-xl border border-slate-200 bg-white outline-hidden focus:border-primary font-medium text-slate-400"
                              />
                            </div>

                            {/* Capacidade Adultos / Crianças */}
                            <div className="sm:col-span-3 space-y-1">
                              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                                Adultos Máx.
                              </label>
                              <input
                                type="number"
                                min={1}
                                max={8}
                                value={room.maxAdults}
                                onChange={(e) =>
                                  handleUpdateRoom(idx, "maxAdults", Number(e.target.value))
                                }
                                className="w-full h-9 px-2.5 text-xs rounded-xl border border-slate-200 bg-white outline-hidden focus:border-primary font-semibold"
                              />
                            </div>

                            <div className="sm:col-span-3 space-y-1">
                              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                                Crianças Máx.
                              </label>
                              <input
                                type="number"
                                min={0}
                                max={6}
                                value={room.maxChildren}
                                onChange={(e) =>
                                  handleUpdateRoom(idx, "maxChildren", Number(e.target.value))
                                }
                                className="w-full h-9 px-2.5 text-xs rounded-xl border border-slate-200 bg-white outline-hidden focus:border-primary font-semibold"
                              />
                            </div>

                            {/* Tamanho e Quartos Restantes */}
                            <div className="sm:col-span-3 space-y-1">
                              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                                Tamanho (m²)
                              </label>
                              <input
                                type="number"
                                min={10}
                                value={room.sizeM2}
                                onChange={(e) =>
                                  handleUpdateRoom(idx, "sizeM2", Number(e.target.value))
                                }
                                className="w-full h-9 px-2.5 text-xs rounded-xl border border-slate-200 bg-white outline-hidden focus:border-primary font-semibold"
                              />
                            </div>

                            <div className="sm:col-span-3 space-y-1">
                              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                                Disponibilidade (Qtd)
                              </label>
                              <input
                                type="number"
                                min={1}
                                max={50}
                                value={room.availableRooms}
                                onChange={(e) =>
                                  handleUpdateRoom(idx, "availableRooms", Number(e.target.value))
                                }
                                className="w-full h-9 px-2.5 text-xs rounded-xl border border-slate-200 bg-white outline-hidden focus:border-primary font-semibold"
                              />
                            </div>

                            {/* Descrição do Quarto */}
                            <div className="sm:col-span-6 space-y-1">
                              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                                Descrição Rápida
                              </label>
                              <input
                                type="text"
                                value={room.description}
                                onChange={(e) =>
                                  handleUpdateRoom(idx, "description", e.target.value)
                                }
                                placeholder="Ex: Varanda com vista, ar e frigobar"
                                className="w-full h-9 px-2.5 text-xs rounded-xl border border-slate-200 bg-white outline-hidden focus:border-primary font-medium"
                              />
                            </div>
                          </div>

                          {/* Checkboxes de Café e Cancelamento */}
                          <div className="flex flex-wrap items-center gap-5 pt-2 border-t border-slate-200/60">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                              <input
                                type="checkbox"
                                checked={room.breakfastIncluded}
                                onChange={(e) =>
                                  handleUpdateRoom(idx, "breakfastIncluded", e.target.checked)
                                }
                                className="size-4 rounded-md accent-emerald-600 cursor-pointer"
                              />
                              <Coffee className="size-3.5 text-emerald-600" />
                              Café da Manhã Incluso
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                              <input
                                type="checkbox"
                                checked={room.freeCancellation}
                                onChange={(e) =>
                                  handleUpdateRoom(idx, "freeCancellation", e.target.checked)
                                }
                                className="size-4 rounded-md accent-emerald-600 cursor-pointer"
                              />
                              <ShieldCheck className="size-3.5 text-emerald-600" />
                              Cancelamento Grátis até 48h
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. ABA FOTOS & DESCRIÇÃO */}
                {activeTab === "fotos" && (
                  <div className="space-y-5 animate-in fade-in duration-150">
                    {/* Descrição Detalhada */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Descrição Completa do Hotel (&quot;Sobre a Acomodação&quot;)
                      </label>
                      <textarea
                        rows={3}
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Descreva a história, estrutura, lazer e diferenciais do local..."
                        className="w-full p-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary resize-none font-medium leading-relaxed"
                      />
                    </div>

                    {/* Foto Principal */}
                    <div className="pt-2 border-t border-slate-100">
                      <ImageUploader
                        value={formImageUrl}
                        onChange={(url) => setFormImageUrl(url)}
                        folder="hospedagens"
                        label="Foto Principal de Capa *"
                        description="Imagem principal exibida nos cards da home e cabeçalho"
                        aspectRatio="video"
                        recommendedResolution="Recomendado 1200x800 ou 800x600"
                      />
                    </div>

                    {/* Galeria de Fotos Extras */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <ImageIcon className="size-3.5 text-primary" />
                          Galeria de Fotos Extras (Página de Detalhes)
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Essas fotos aparecem nas miniaturas ao lado da foto principal na tela /hospedagens/[id].
                        </p>
                      </div>

                      {/* Input para Adicionar Foto */}
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          value={newGalleryPhotoUrl}
                          onChange={(e) => setNewGalleryPhotoUrl(e.target.value)}
                          placeholder="Cole o link da foto (URL direta: https://...)"
                          className="flex-1 h-9 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-medium"
                        />
                        <button
                          type="button"
                          onClick={handleAddGalleryPhoto}
                          disabled={!newGalleryPhotoUrl.trim()}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shrink-0 cursor-pointer"
                        >
                          Adicionar Foto
                        </button>
                      </div>

                      {/* Miniaturas da Galeria */}
                      {formGallery.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                          {formGallery.map((photo, idx) => (
                            <div
                              key={idx}
                              className="relative h-24 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100 shadow-2xs"
                            >
                              <Image
                                src={photo}
                                alt={`Galeria ${idx + 1}`}
                                fill
                                unoptimized={photo?.startsWith("data:")}
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryPhoto(idx)}
                                className="absolute top-1 right-1 size-6 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-xs cursor-pointer"
                                title="Remover foto"
                              >
                                <X className="size-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. ABA COMODIDADES */}
                {activeTab === "comodidades" && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Comodidades e Diferenciais
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Selecione todos os serviços oferecidos aos hóspedes no hotel.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {COMMON_AMENITIES.map((amenity) => {
                        const selected = formAmenities.includes(amenity);
                        return (
                          <button
                            key={amenity}
                            type="button"
                            onClick={() => toggleAmenity(amenity)}
                            className={`p-3 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-between border ${
                              selected
                                ? "bg-primary text-white border-primary shadow-xs font-bold"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <span>{amenity}</span>
                            {selected && <Check className="size-4 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* BOTÕES DE AÇÃO - FIXOS NA BASE */}
              <div className="flex items-center justify-between p-5 pt-3 border-t border-slate-100 shrink-0 bg-white">
                <div className="text-xs text-slate-500 font-medium hidden sm:block">
                  {formRooms.length} {formRooms.length === 1 ? "quarto configurado" : "quartos configurados"}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer"
                  >
                    {isSaving ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Check className="size-4" />
                    )}
                    {isSaving
                      ? "Salvando..."
                      : editingId
                      ? "Salvar Alterações"
                      : "Criar Hospedagem"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
