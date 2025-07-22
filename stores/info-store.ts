import { create } from "zustand";

export type States = {
  client: {
    name: string;
    email: string;
    phone: string;
  };
  destinationInfo: {
    destination: string;
    startDate: string;
    endDate: string;
    numberOfAdults: string;
    numberOfChildren?: string;
    travelType: string;
  };
  travelInfo: {
    accommodationPreference: string;
    roomType: string;
    mealPlan: string;
    transportation: string;
    internalTransportation: string;
    estimatedBudget: string;
    dietaryRestrictions?: string;
    otherSpecialNeeds?: string;
    additionalInfo?: string;
  };
};

type Actions = {
  setClient: (name: States["client"]) => void;
  setDestinationInfo: (info: States["destinationInfo"]) => void;
  setTravelInfo: (info: States["travelInfo"]) => void;
};

const initialState: States = {
  client: {
    name: "",
    email: "",
    phone: "",
  },
  destinationInfo: {
    destination: "",
    startDate: "",
    endDate: "",
    numberOfAdults: "",
    numberOfChildren: "",
    travelType: "",
  },
  travelInfo: {
    accommodationPreference: "",
    roomType: "",
    mealPlan: "",
    transportation: "",
    internalTransportation: "",
    estimatedBudget: "",
    dietaryRestrictions: "",
    otherSpecialNeeds: "",
    additionalInfo: "",
  },
};

export const useInfoStore = create<States & Actions>()((set) => ({
  ...initialState,
  setClient: (client) => set((state) => ({ ...state, client })),
  setDestinationInfo: (destinationInfo) =>
    set((state) => ({ ...state, destinationInfo })),
  setTravelInfo: (travelInfo) => set((state) => ({ ...state, travelInfo })),
}));
