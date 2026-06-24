import backendInstance from './backendInstance';

export const previewClothesImport = ({ category, originalUrl }) =>
  backendInstance.post('/clothes/import/preview', { category, originalUrl });

export const importClothes = (data) =>
  backendInstance.post('/clothes/import', data);
