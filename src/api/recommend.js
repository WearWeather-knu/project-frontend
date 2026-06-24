import backendInstance from './backendInstance';

export const fetchRecommend = ({ weatherId, style }) => {
  return backendInstance.post('/gemini/outfit-images', {
    weatherId,
    style,
  });
};
