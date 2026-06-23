import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'wear-weather-liked-outfits';
const CHANGE_EVENT = 'wear-weather-liked-outfits-change';

function readLikedOutfits() {
  if (typeof window === 'undefined') return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLikedOutfits(outfits) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(outfits));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useLikedOutfits() {
  const [likedOutfits, setLikedOutfits] = useState(readLikedOutfits);

  useEffect(() => {
    const syncLikedOutfits = () => {
      setLikedOutfits(readLikedOutfits());
    };

    window.addEventListener(CHANGE_EVENT, syncLikedOutfits);
    window.addEventListener('storage', syncLikedOutfits);

    return () => {
      window.removeEventListener(CHANGE_EVENT, syncLikedOutfits);
      window.removeEventListener('storage', syncLikedOutfits);
    };
  }, []);

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

  const toggleLikedOutfit = useCallback((outfit) => {
    setLikedOutfits((currentOutfits) => {
      const exists = currentOutfits.some(
        (currentOutfit) => currentOutfit.id === outfit.id,
      );
      const nextOutfits = exists
        ? currentOutfits.filter((currentOutfit) => currentOutfit.id !== outfit.id)
        : [{ ...outfit, likedAt: Date.now() }, ...currentOutfits];

      writeLikedOutfits(nextOutfits);
      return nextOutfits;
    });
  }, []);

  return {
    likedOutfits: sortedLikedOutfits,
    isLiked,
    toggleLikedOutfit,
  };
}
