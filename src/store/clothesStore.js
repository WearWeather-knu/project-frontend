import { create } from 'zustand';
import { getClothes, updateClothesFavorite } from '@/api/clothes';

export const useClothesStore = create((set, get) => ({
  items: [],
  clothesById: {},
  loading: true,
  error: '',
  likedItemIds: [],
  favoritePendingItemIds: [],

  loadClothes: async (mapCloth) => {
    set({ loading: true, error: '' });

    try {
      const { data } = await getClothes();
      const clothes = Array.isArray(data) ? data : [];

      set({
        items: clothes.map(mapCloth),
        clothesById: Object.fromEntries(
          clothes.map((cloth) => [cloth.clothesId, { name: cloth.name, category: cloth.category }]),
        ),
        likedItemIds: clothes
          .filter((cloth) => cloth.favorite)
          .map((cloth) => cloth.clothesId),
      });
    } catch {
      set({ error: '옷 목록을 불러오지 못했습니다. 다시 시도해 주세요.' });
    } finally {
      set({ loading: false });
    }
  },

  loadClothesLookup: async () => {
    if (Object.keys(get().clothesById).length > 0) return;

    try {
      const { data } = await getClothes();
      const clothes = Array.isArray(data) ? data : [];

      set({
        clothesById: Object.fromEntries(
          clothes.map((cloth) => [cloth.clothesId, { name: cloth.name, category: cloth.category }]),
        ),
      });
    } catch {
      // best-effort enrichment
    }
  },

  appendImportedClothes: (item) => {
    set((state) => ({ items: [item, ...state.items] }));
  },

  toggleFavoriteOptimistic: async (itemId) => {
    const { favoritePendingItemIds, likedItemIds } = get();

    if (favoritePendingItemIds.includes(itemId)) return;

    const wasLiked = likedItemIds.includes(itemId);
    const nextFavorite = !wasLiked;

    set({
      error: '',
      favoritePendingItemIds: [...favoritePendingItemIds, itemId],
      likedItemIds: nextFavorite
        ? [...likedItemIds, itemId]
        : likedItemIds.filter((currentItemId) => currentItemId !== itemId),
    });

    try {
      await updateClothesFavorite(itemId, nextFavorite);
    } catch {
      set((state) => ({
        likedItemIds: wasLiked
          ? [...new Set([...state.likedItemIds, itemId])]
          : state.likedItemIds.filter((currentItemId) => currentItemId !== itemId),
        error: '좋아요 변경에 실패했습니다. 다시 시도해 주세요.',
      }));
    } finally {
      set((state) => ({
        favoritePendingItemIds: state.favoritePendingItemIds.filter(
          (currentItemId) => currentItemId !== itemId,
        ),
      }));
    }
  },
}));
