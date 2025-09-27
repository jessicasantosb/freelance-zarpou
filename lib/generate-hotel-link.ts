function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0]; // só YYYY-MM-DD
}

export function generateHotelLink(cityName: string, id: string) {
  const today = new Date();

  // check-in = 2 meses depois
  const startDate = addMonths(today, 2);

  // check-out = 7 dias depois
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);

  const baseUrl = "https://app.onertravel.com/zarpouviagens/hotel-list";

  const params = new URLSearchParams({
    rooms: JSON.stringify([
      {
        numberOfAdults: 2,
        numberOfInfant: 0,
        numberOfChilds: 0,
        agesOfChild: [],
        roomNum: 0,
      },
    ]),
    numberOfAdults: "2",
    numberOfChild: "0",
    numberOfInfant: "0",
    numberOfRooms: "1",
    cityName,
    id,
    type: "1",
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    source: "h",
  });

  return `${baseUrl}?${params.toString()}`;
}
