import backendInstance from './backendInstance';

export const fetchRecommend = (weather) => {
  return backendInstance.post('/gemini/outfit-images', {
    weather,
    outfitCount: 3,
    style: '여름 20대 남자 패션',
  });
};
