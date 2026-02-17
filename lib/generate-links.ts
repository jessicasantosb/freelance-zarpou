import { getTravelDates } from "./date-utils";

const DEFAULT_GUESTS = {
  adults: "2",
  children: "0",
  infants: "0",
};

const HOTEL_ROOM_CONFIG = [
  {
    numberOfAdults: 2,
    numberOfInfant: 0,
    numberOfChilds: 0,
    agesOfChild: [],
    roomNum: 0,
  },
];

export function generateHotelLink(cityName: string, id: string) {
  const { startFormatted, endFormatted } = getTravelDates();
  const baseUrl = "https://app.onertravel.com/zarpouviagens/hotel-list";

  const params = new URLSearchParams({
    rooms: JSON.stringify(HOTEL_ROOM_CONFIG),
    numberOfAdults: DEFAULT_GUESTS.adults,
    numberOfChild: DEFAULT_GUESTS.children,
    numberOfInfant: DEFAULT_GUESTS.infants,
    numberOfRooms: "1",
    cityName,
    id,
    type: "1",
    startDate: startFormatted,
    endDate: endFormatted,
    source: "h",
  });

  return `${baseUrl}?${params.toString()}`;
}

export function generateFlightLink(
  arrivalIata: string,
  arrivalName: string,
  arrivalCity: string,
  departureFrom: string,
) {
  const { startFormatted, endFormatted } = getTravelDates();
  const baseUrl = "https://app.onertravel.com/zarpouviagens/flight-list";

  const params = new URLSearchParams({
    departureDate: `${startFormatted}T00:00:00.000Z`,
    returnDate: `${endFormatted}T00:00:00.000Z`,
    isRoundTrip: "true",
    adultsCount: DEFAULT_GUESTS.adults,
    infantCount: DEFAULT_GUESTS.infants,
    childCount: DEFAULT_GUESTS.children,
    departureIata: departureFrom,
    arrivalIata,
    departureName: `${departureFrom} Todos os aeroportos`,
    departureCity: departureFrom,
    arrivalName,
    arrivalCity,
    source: "f",
  });

  return `${baseUrl}?${params.toString()}`;
}
