import { getWeatherRefreshSlot } from './mainWeatherCache';

const CACHE_KEY = 'wear-weather-outfit-rec';

export const readOutfitRecommendCache = (weatherId) => {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const payload = JSON.parse(raw);

    if (
      payload?.weatherId !== weatherId ||
      !Array.isArray(payload?.recommendations) ||
      payload.recommendations.length === 0 ||
      !Number.isFinite(payload?.nextRefreshAt) ||
      Date.now() >= payload.nextRefreshAt
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};

export const writeOutfitRecommendCache = (weatherId, recommendations) => {
  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        weatherId,
        recommendations,
        nextRefreshAt: getWeatherRefreshSlot().nextRefreshAt,
      }),
    );
  } catch {
    // localStorage can fail in private browsing or restricted environments.
  }
};
