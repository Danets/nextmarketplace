import { create } from "zustand";

interface ModalStore {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));
