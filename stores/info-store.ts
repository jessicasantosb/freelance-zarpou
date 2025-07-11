import { create } from "zustand";

export type States = {
  name: string;
  info: {
    destiny: string;
    date: string;
    count: string;
    description?: string;
  };
};

type Actions = {
  setName: (name: States["name"]) => void;
  setInfo: (info: States["info"]) => void;
};

const initialState: States = {
  name: "",
  info: {
    destiny: "",
    date: "",
    count: "",
    description: "",
  },
};

export const useInfoStore = create<States & Actions>()((set) => ({
  ...initialState,
  setName: (name) => set((state) => ({ ...state, name })),
  setInfo: (info) => set((state) => ({ ...state, info })),
}));
