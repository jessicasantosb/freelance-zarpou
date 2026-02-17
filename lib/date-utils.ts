import { addMonths, addDays, format } from "date-fns";

export const APP_DATE_FORMAT = "yyyy-MM-dd";

export function getTravelDates(monthsAhead = 2, durationDays = 7) {
  const startDate = addMonths(new Date(), monthsAhead);
  const endDate = addDays(startDate, durationDays);

  return {
    startDate,
    endDate,
    startFormatted: format(startDate, APP_DATE_FORMAT),
    endFormatted: format(endDate, APP_DATE_FORMAT),
  };
}
