import { create } from 'zustand';
import { CampusEvent } from '../types';

interface ModalState {
  detailsEvent: CampusEvent | null;
  isFormOpen: boolean;
  editingEvent: CampusEvent | null;
  deleteModalEvent: CampusEvent | null;
  isDeleting: boolean;

  // Actions
  openDetails: (event: CampusEvent) => void;
  closeDetails: () => void;
  openCreate: () => void;
  openEdit: (event: CampusEvent) => void;
  closeForm: () => void;
  openDeleteConfirm: (event: CampusEvent) => void;
  closeDeleteConfirm: () => void;
  setIsDeleting: (isDeleting: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  detailsEvent: null,
  isFormOpen: false,
  editingEvent: null,
  deleteModalEvent: null,
  isDeleting: false,

  openDetails: (event) => set({ detailsEvent: event }),
  closeDetails: () => set({ detailsEvent: null }),
  openCreate: () => set({ isFormOpen: true, editingEvent: null }),
  openEdit: (event) => set({ isFormOpen: true, editingEvent: event }),
  closeForm: () => set({ isFormOpen: false, editingEvent: null }),
  openDeleteConfirm: (event) => set({ deleteModalEvent: event }),
  closeDeleteConfirm: () => set({ deleteModalEvent: null }),
  setIsDeleting: (isDeleting) => set({ isDeleting }),
}));
