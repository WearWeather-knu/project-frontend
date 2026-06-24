import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import outfitImage from '@/assets/hero.png';
import OutfitCarousel from '@/components/main/OutfitCarousel';
import RetryButton from '@/components/main/RetryButton';
import WeatherInfoCard from '@/components/main/WeatherInfoCard';
import { fetchWeather } from '@/api/weather.js';
import { fetchRecommend } from '../api/recommend';
import { useSeasonTheme } from '@/store/seasonThemeStore';

const outfits = [
  {
    id: 1,
    title: '첫 번째 추천 코디',
    imageSrc: outfitImage,
    details: {
      top: '아이보리 니트',
      bottom: '블랙 슬랙스',
      outer: '네이비 트렌치',
      shoes: '화이트 스니커즈',
      point: '실버 미니백',
      reason: '차분한 색 조합으로 쌀쌀한 날에도 단정하게 입기 좋아요.',
    },
  },
  {
    id: 2,
    title: '두 번째 추천 코디',
    imageSrc: outfitImage,
    details: {
      top: '스카이블루 셔츠',
      bottom: '라이트 데님',
      outer: '그레이 가디건',
      shoes: '블랙 로퍼',
      point: '브라운 벨트',
      reason: '밝은 상의와 데님이 산뜻하고, 가디건이 온도 변화에 대응해요.',
    },
  },
  {
    id: 3,
    title: '세 번째 추천 코디',
    imageSrc: outfitImage,
    details: {
      top: '화이트 긴팔 티',
      bottom: '카키 와이드 팬츠',
      outer: '블랙 재킷',
      shoes: '그레이 스니커즈',
      point: '네이비 캡',
      reason: '활동성이 좋고 바람이 불 때도 가볍게 걸치기 좋은 조합이에요.',
    },
  },
  {
    id: 4,
    title: '네 번째 추천 코디',
    imageSrc: outfitImage,
    details: {
      top: '민트 셔츠',
      bottom: '베이지 치노 팬츠',
      outer: '브라운 블루종',
      shoes: '화이트 캔버스화',
      point: '오렌지 양말',
      reason: '부드러운 색감에 작은 포인트를 더해 가볍게 눈에 띄어요.',
    },
  },
  {
    id: 5,
    title: '다섯 번째 추천 코디',
    imageSrc: outfitImage,
    details: {
      top: '버건디 니트',
      bottom: '네이비 데님',
      outer: '그레이 코트',
      shoes: '브라운 부츠',
      point: '블랙 머플러',
      reason: '따뜻한 소재와 깊은 색감으로 체감온도가 낮은 날에 적합해요.',
    },
  },
];

const MAIN_WEATHER_CACHE_KEY = 'wear-weather-main-weather';
const MAIN_LOCATION_NAME = '대구광역시, 북구';
const WEATHER_REFRESH_INTERVAL_MS = 30 * 60 * 1000;

const getWeatherRefreshSlot = (date = new Date()) => {
  const slotStart = new Date(date);
  const minutes = slotStart.getMinutes();
  slotStart.setMinutes(minutes < 30 ? 0 : 30, 0, 0);

  return {
    slotStartedAt: slotStart.getTime(),
    nextRefreshAt: slotStart.getTime() + WEATHER_REFRESH_INTERVAL_MS,
  };
};

const isValidWeatherData = (data) =>
  typeof data?.location === 'string' && Number.isFinite(Number(data?.temperature));

const readMainWeatherCache = () => {
  try {
    const cachedValue = window.localStorage.getItem(MAIN_WEATHER_CACHE_KEY);

    if (!cachedValue) return null;

    const cachedPayload = JSON.parse(cachedValue);

    if (
      !Number.isFinite(cachedPayload?.slotStartedAt) ||
      !Number.isFinite(cachedPayload?.nextRefreshAt) ||
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

const writeMainWeatherCache = (data) => {
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

const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });

function MainPage() {
  const [temperature, setTemperature] = useState(0);
  const [location, setLocation] = useState('');
  const refreshTimerRef = useRef(null);
  const loadWeatherRef = useRef(null);
  const isMountedRef = useRef(false);
  const { seasonTheme } = useSeasonTheme();

  const applyWeatherData = useCallback((data) => {
    if (!isMountedRef.current) return;

    setLocation(data.location);
    setTemperature(Number(data.temperature));
  }, []);

  const scheduleNextWeatherLoad = useCallback((nextRefreshAt) => {
    if (!isMountedRef.current) return;

    window.clearTimeout(refreshTimerRef.current);

    const delay = Math.max(0, nextRefreshAt - Date.now());
    refreshTimerRef.current = window.setTimeout(() => {
      loadWeatherRef.current?.();
    }, delay);
  }, []);

  const loadWeather = useCallback(async () => {
    const cachedPayload = readMainWeatherCache();

    if (cachedPayload && Date.now() < cachedPayload.nextRefreshAt) {
      applyWeatherData(cachedPayload.data);
      scheduleNextWeatherLoad(cachedPayload.nextRefreshAt);
      return;
    }

    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const res = await fetchWeather({
        lat: latitude,
        lon: longitude,
        location_name: MAIN_LOCATION_NAME,
      });
      const responseData = res.data.data;
      const weatherData = {
        location: responseData.location_name,
        temperature: Number(responseData.current_temp),
      };

      if (!isValidWeatherData(weatherData)) {
        throw new Error('Invalid weather response data');
      }

      const nextRefreshAt = getWeatherRefreshSlot().nextRefreshAt;

      applyWeatherData(weatherData);
      writeMainWeatherCache(weatherData);
      scheduleNextWeatherLoad(nextRefreshAt);
    } catch (error) {
      console.error(error);

      if (cachedPayload) {
        applyWeatherData(cachedPayload.data);
      }

      scheduleNextWeatherLoad(getWeatherRefreshSlot().nextRefreshAt);
    }
  }, [applyWeatherData, scheduleNextWeatherLoad]);

  useEffect(() => {
    loadWeatherRef.current = loadWeather;
  }, [loadWeather]);

  useEffect(() => {
    isMountedRef.current = true;
    loadWeather();

    return () => {
      isMountedRef.current = false;
      window.clearTimeout(refreshTimerRef.current);
    };
  }, [loadWeather]);

  useEffect(() => {
    fetchRecommend({ weather: String(temperature) }).then((res) => {
      console.log(res);
    });
  }, [temperature]);

  return (
    <Page $background={seasonTheme.background}>
      <Question>🤔 오늘 뭐 입지 ?</Question>
      <OutfitCarousel items={outfits} seasonTheme={seasonTheme} />
      <WeatherTip>☼ 선크림은 필수 !!</WeatherTip>
      <WeatherSection>
        <WeatherInfoCard
          location={location}
          temperature={Math.floor(temperature)}
          color={seasonTheme.primary}
        />
        <RetryButton color={seasonTheme.primary} />
      </WeatherSection>
    </Page>
  );
}

const Page = styled.section`
  min-height: calc(100% + 44px);
  display: grid;
  align-content: start;
  gap: 5px;
  margin: -20px -20px -24px;
  padding: 20px 20px 24px;
  background: ${({ $background }) => $background};
`;

const Question = styled.p`
  margin: 0;
  font-family: 'KyoboHandwriting2025lyb', sans-serif;
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  font-weight: 500;
`;

const WeatherTip = styled.p`
  margin: 4px 0 8px;
  font-family: 'KyoboHandwriting2025lyb', sans-serif;
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
`;

const WeatherSection = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 72px;
  gap: 20px;
  align-items: stretch;
`;

export default MainPage;
