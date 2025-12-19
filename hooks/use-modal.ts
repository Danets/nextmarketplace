import { create } from "zustand";

interface ModalStore {
  isOpen: boolean;
  onClose: () => void;
  onOpen: (id?: string) => void;
  modalId?: string;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));

export const useModalCellAction = create<ModalStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: (id?: string) => set({ isOpen: true, modalId: id }),
}));
