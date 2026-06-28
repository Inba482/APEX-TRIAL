import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: number[]; // Array of product IDs
  toggleItem: (productId: number) => void;
  hasItem: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (productId) => {
        set((state) => {
          if (state.items.includes(productId)) {
            return { items: state.items.filter((id) => id !== productId) };
          }
          return { items: [...state.items, productId] };
        });
      },
      hasItem: (productId) => {
        return get().items.includes(productId);
      },
    }),
    {
      name: 'apex-trail-wishlist',
    }
  )
);
