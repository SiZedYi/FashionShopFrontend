import { Product } from '@/types';
import {create} from 'zustand';


interface ProductQuickViewState {
  isOpen: boolean;
  product: Product | null;
  openModal: (product: Product) => void;
  closeModal: () => void;
}

export const useProductQuickViewStore = create<ProductQuickViewState>((set) => ({
  isOpen: false,
  product: null,
  openModal: (product: Product) => {
    set({ isOpen: true, product: product });
  },
  closeModal: () => set({ isOpen: false, product: null }),
}));