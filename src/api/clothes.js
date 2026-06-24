import backendInstance from './backendInstance';

export const getClothes = () => backendInstance.get('/clothes');

export const previewClothesImport = ({ category, originalUrl }) =>
  backendInstance.post('/clothes/import/preview', { category, originalUrl });

export const importClothes = (data) =>
  backendInstance.post('/clothes/import', data);

export const updateClothesFavorite = (clothesId, favorite) =>
  backendInstance.patch(`/clothes/${clothesId}/favorite`, { favorite });
