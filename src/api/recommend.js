import backendInstance from './backendInstance';

export const fetchRecommend = (prompt) => {
  return backendInstance.post('/gemini/outfit-images', { prompt });
};
