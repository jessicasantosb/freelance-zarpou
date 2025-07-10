import { TopAirTicket } from "./top-air-ticket";
import { TopDestination } from "./top-destination";
import { TopHotels } from "./top-hotels";

export function TopChoices() {
  return (
    <>
      <TopDestination />
      <TopHotels />
      <TopAirTicket />
    </>
  );
}
