import { create } from 'zustand';
import { ShippingAddress } from '@/types/order';

interface CheckoutState {
  shippingAddress: ShippingAddress | null;
  setShippingAddress: (address: ShippingAddress) => void;
  clearShippingAddress: () => void;
  hydrate: () => void;
}

const STORAGE_KEY = 'shipping-address';

export const useCheckoutStore = create<CheckoutState>((set) => ({
  shippingAddress: null,

  setShippingAddress: (address: ShippingAddress) => {
    set({ shippingAddress: address });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(address));
    } catch (error) {
      console.error('Failed to save shipping address:', error);
    }
  },

  clearShippingAddress: () => {
    set({ shippingAddress: null });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear shipping address:', error);
    }
  },

  hydrate: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const address = JSON.parse(stored) as ShippingAddress;
        set({ shippingAddress: address });
      }
    } catch (error) {
      console.error('Failed to hydrate shipping address:', error);
    }
  },
}));
