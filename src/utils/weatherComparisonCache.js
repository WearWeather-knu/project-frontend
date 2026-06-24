export const WEATHER_COMPARISON_LOCATION = '대구광역시, 북구';

export const getWeatherComparisonCacheKey = (
  location = WEATHER_COMPARISON_LOCATION,
) => `weather-comparison:${location}`;

export const getNextMidnightTimestamp = () => {
  const nextMidnight = new Date();
  nextMidnight.setHours(24, 0, 0, 0);

  return nextMidnight.getTime();
};

export const isValidComparisonData = (data) =>
  Boolean(data?.today && data?.yesterday);

export const readWeatherComparisonCache = (
  location = WEATHER_COMPARISON_LOCATION,
) => {
  if (typeof window === 'undefined') return null;

  const cacheKey = getWeatherComparisonCacheKey(location);

  try {
    const cachedValue = window.localStorage.getItem(cacheKey);

    if (!cachedValue) return null;

    const cachedPayload = JSON.parse(cachedValue);

    if (
      !cachedPayload?.expiresAt ||
      Date.now() >= cachedPayload.expiresAt ||
      !isValidComparisonData(cachedPayload.data)
    ) {
      window.localStorage.removeItem(cacheKey);
      return null;
    }

    return cachedPayload.data;
  } catch {
    window.localStorage.removeItem(cacheKey);
    return null;
  }
};

export const writeWeatherComparisonCache = (
  data,
  location = WEATHER_COMPARISON_LOCATION,
) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(
      getWeatherComparisonCacheKey(location),
      JSON.stringify({
        expiresAt: getNextMidnightTimestamp(),
        data,
      }),
    );
  } catch {
    // localStorage can fail in private browsing or restricted environments.
  }
};
