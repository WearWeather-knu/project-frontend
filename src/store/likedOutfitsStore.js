import { useCallback, useMemo } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const STORAGE_KEY = 'wear-weather-liked-outfits';
const fallbackStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

const legacyAwareStorage = createJSONStorage(() => {
  if (typeof window === 'undefined') return fallbackStorage;

  return {
    getItem: (name) => {
      const storedValue = window.localStorage.getItem(name);

      if (!storedValue) return null;

      try {
        const parsedValue = JSON.parse(storedValue);

        if (Array.isArray(parsedValue)) {
          return JSON.stringify({
            state: { likedOutfits: parsedValue },
            version: 0,
          });
        }
      } catch {
        return null;
      }

      return storedValue;
    },
    setItem: (name, value) => window.localStorage.setItem(name, value),
    removeItem: (name) => window.localStorage.removeItem(name),
  };
});

export const useLikedOutfitsStore = create(
  persist(
    (set, get) => ({
      likedOutfits: [],
      toggleLikedOutfit: (outfit) => {
        const { likedOutfits } = get();
        const exists = likedOutfits.some(
          (currentOutfit) => currentOutfit.id === outfit.id,
        );
        const nextOutfits = exists
          ? likedOutfits.filter((currentOutfit) => currentOutfit.id !== outfit.id)
          : [{ ...outfit, likedAt: Date.now() }, ...likedOutfits];

        set({ likedOutfits: nextOutfits });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: legacyAwareStorage,
      partialize: (state) => ({ likedOutfits: state.likedOutfits }),
    },
  ),
);

export function useLikedOutfits() {
  const likedOutfits = useLikedOutfitsStore((state) => state.likedOutfits);
  const toggleLikedOutfit = useLikedOutfitsStore(
    (state) => state.toggleLikedOutfit,
  );

  const sortedLikedOutfits = useMemo(
    () =>
      [...likedOutfits].sort(
        (a, b) => (b.likedAt ?? 0) - (a.likedAt ?? 0),
      ),
    [likedOutfits],
  );

  const isLiked = useCallback(
    (id) => likedOutfits.some((outfit) => outfit.id === id),
    [likedOutfits],
  );

  return {
    likedOutfits: sortedLikedOutfits,
    isLiked,
    toggleLikedOutfit,
  };
}
