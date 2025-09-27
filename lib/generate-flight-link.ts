function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatDateISO(date: Date) {
  return date.toISOString().split(".")[0] + ".000Z";
}

export function generateFlightLink(arrivalIata: string, arrivalName: string, arrivalCity: string) {
  const today = new Date();

  // Ida = 2 meses depois
  const departure = addMonths(today, 2);

  // Volta = 7 dias depois
  const returnDate = new Date(departure);
  returnDate.setDate(returnDate.getDate() + 7);

  const baseUrl = "https://app.onertravel.com/zarpouviagens/flight-list";

  const params = new URLSearchParams({
    departureDate: formatDateISO(departure),
    returnDate: formatDateISO(returnDate),
    isRoundTrip: "true",
    adultsCount: "1",
    infantCount: "0",
    childCount: "0",
    departureIata: "SAO",
    arrivalIata,
    isDepartureIataCity: "true",
    departureName: "SAO Todos os aeroportos",
    departureCity: "SAO",
    isArrivalIataCity: "false",
    arrivalName,
    arrivalCity,
    source: "f",
  });

  return `${baseUrl}?${params.toString()}`;
}
