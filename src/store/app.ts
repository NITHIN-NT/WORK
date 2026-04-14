import { create } from 'zustand';

interface AppState {
  isDataReady: boolean;
  setDataReady: (ready: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isDataReady: false,
  setDataReady: (isDataReady) => set({ isDataReady }),
}));
