/**
 * Utilitário centralizado para cálculo e exibição de notas de hospedagens da Zarpou Viagens.
 * Regra: A nota deve ser de acordo com a nota que o cliente dá ao local.
 * Só não pode mostrar se a nota for muito baixa (< 7.0) ou null/undefined.
 */

export interface HotelRatingInfo {
  rating: number | null;
  reviewCount: number;
  label: string;
  shouldShow: boolean;
}

export function calculateHotelRating(
  hotel: { id?: string; rating?: number | null; reviewCount?: number | null; reviewLabel?: string },
  bookings?: Array<{ hotel?: { id?: string }; review?: { rating?: number } }>
): HotelRatingInfo {
  if (!hotel) {
    return { rating: null, reviewCount: 0, label: "", shouldShow: false };
  }

  // 1. Avaliações feitas por clientes em Minhas Viagens para este hotel
  let clientRatings: number[] = [];
  if (hotel.id && Array.isArray(bookings)) {
    clientRatings = bookings
      .filter((b) => b.hotel?.id === hotel.id && b.review?.rating && b.review.rating > 0)
      .map((b) => {
        const star = b.review!.rating!;
        // Converte escala de 1 a 5 estrelas para escala 0 a 10 (ex: 5 -> 9.5-10.0, 4 -> 8.0, 3 -> 6.0)
        return star * 2;
      });
  }

  let finalRating: number | null = null;
  let finalReviewCount = 0;

  if (clientRatings.length > 0) {
    // Média real calculada exclusivamente a partir das avaliações enviadas por clientes
    const sum = clientRatings.reduce((acc, r) => acc + r, 0);
    const avgClients = sum / clientRatings.length;
    finalRating = Number(avgClients.toFixed(1));
    finalReviewCount = clientRatings.length;
  }

  // Regra de Negócio: Não mostrar se for null ou nota muito baixa (< 7.0)
  const shouldShow = finalRating !== null && finalRating >= 7.0;

  let label = hotel.reviewLabel || "Muito Bom";
  if (finalRating) {
    if (finalRating >= 9.0) label = "Excelente";
    else if (finalRating >= 8.0) label = "Fabuloso";
    else if (finalRating >= 7.0) label = "Bom";
  }

  return {
    rating: shouldShow ? finalRating : null,
    reviewCount: finalReviewCount,
    label,
    shouldShow,
  };
}
