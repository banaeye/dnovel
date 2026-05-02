import { create } from 'zustand';

interface UIStore {
  isSystemMenuOpen: boolean;
  isSaveMenuOpen: boolean;
  selectedItemId: string | null;
  openSystemMenu: () => void;
  closeSystemMenu: () => void;
  openSaveMenu: () => void;
  closeSaveMenu: () => void;
  selectItem: (itemId: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isSystemMenuOpen: false,
  isSaveMenuOpen: false,
  selectedItemId: null,
  openSystemMenu: () => set({ isSystemMenuOpen: true }),
  closeSystemMenu: () => set({ isSystemMenuOpen: false }),
  openSaveMenu: () => set({ isSaveMenuOpen: true }),
  closeSaveMenu: () => set({ isSaveMenuOpen: false }),
  selectItem: (itemId) => set({ selectedItemId: itemId }),
}));
