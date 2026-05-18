"use client";

import { useSearchParams } from "next/navigation";
import { CategoryNavigation } from "./category-navigation";
import { SearchFlightPanel } from "./search-flight-panel";
import { SearchHotelPanel } from "./search-hotel-panel";

const panels = {
  passagens: SearchFlightPanel,
  hospedagens: SearchHotelPanel,
};

type TabId = keyof typeof panels;

export function BookingWidget() {
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as TabId) || "passagens";

  const ActivePanel = panels[activeTab] || SearchFlightPanel;

  return (
    <div className="w-full">
      <CategoryNavigation activeTab={activeTab} />
      <div className="mt-4">
        <ActivePanel />
      </div>
    </div>
  );
}
