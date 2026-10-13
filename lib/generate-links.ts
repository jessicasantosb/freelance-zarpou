type GenerateFlightLinkProps = {
  departureFrom: string;
  arrivalIata: string;
  arrivalName?: string;
  arrivalCity?: string;
};

export function generateHotelLink(cityName: string, id?: string) {
  if (id && id.startsWith("hotel-")) {
    return `/hospedagens/${id}`;
  }
  const params = new URLSearchParams({
    city: cityName,
    checkIn: "2026-11-20",
    checkOut: "2026-11-23",
    adults: "2",
  });
  return `/hospedagens?${params.toString()}`;
}

export function generateFlightLink({
  departureFrom,
  arrivalIata,
}: GenerateFlightLinkProps) {
  const params = new URLSearchParams({
    from: departureFrom,
    to: arrivalIata,
    departureDate: "2026-11-20",
    returnDate: "2026-11-27",
    adults: "2",
  });
  return `/passagens?${params.toString()}`;
}
