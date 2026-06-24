export const MAIN_WEATHER_CACHE_KEY = 'wear-weather-main-weather';
export const WEATHER_REFRESH_INTERVAL_MS = 30 * 60 * 1000;

export const getWeatherRefreshSlot = (date = new Date()) => {
  const slotStart = new Date(date);
  const minutes = slotStart.getMinutes();
  slotStart.setMinutes(minutes < 30 ? 0 : 30, 0, 0);

  return {
    slotStartedAt: slotStart.getTime(),
    nextRefreshAt: slotStart.getTime() + WEATHER_REFRESH_INTERVAL_MS,
  };
};

export const isValidWeatherId = (weatherId) =>
  Number.isInteger(Number(weatherId)) && Number(weatherId) > 0;

export const isValidWeatherData = (data) =>
  typeof data?.location === 'string' &&
  Number.isFinite(Number(data?.temperature)) &&
  isValidWeatherId(data?.weatherId);

export const getWeatherId = (data) => {
  const weatherId = data?.weatherId ?? data?.weather_id ?? data?.id;
  const numberWeatherId = Number(weatherId);

  return isValidWeatherId(numberWeatherId) ? numberWeatherId : null;
};

export const readMainWeatherCache = () => {
  try {
    const cachedValue = window.localStorage.getItem(MAIN_WEATHER_CACHE_KEY);

    if (!cachedValue) return null;

    const cachedPayload = JSON.parse(cachedValue);

    if (
      !Number.isFinite(cachedPayload?.slotStartedAt) ||
      !Number.isFinite(cachedPayload?.nextRefreshAt) ||
      !Object.hasOwn(cachedPayload?.data ?? {}, 'weatherId') ||
      !isValidWeatherData(cachedPayload?.data)
    ) {
      window.localStorage.removeItem(MAIN_WEATHER_CACHE_KEY);
      return null;
    }

    return cachedPayload;
  } catch {
    window.localStorage.removeItem(MAIN_WEATHER_CACHE_KEY);
    return null;
  }
};

export const writeMainWeatherCache = (data) => {
  try {
    window.localStorage.setItem(
      MAIN_WEATHER_CACHE_KEY,
      JSON.stringify({
        ...getWeatherRefreshSlot(),
        data,
      }),
    );
  } catch {
    // localStorage can fail in private browsing or restricted environments.
  }
};
