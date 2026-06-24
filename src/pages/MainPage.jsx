import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import outfitImage from '@/assets/hero.png';
import OutfitCarousel from '@/components/main/OutfitCarousel';
import RetryButton from '@/components/main/RetryButton';
import WeatherInfoCard from '@/components/main/WeatherInfoCard';
import { fetchWeather } from '@/api/weather.js';
import { fetchRecommend } from '../api/recommend';
import { useSeasonTheme } from '@/store/seasonThemeStore';
import { useClothesStore } from '@/store/clothesStore';
import {
  readOutfitRecommendCache,
  writeOutfitRecommendCache,
} from '@/utils/outfitRecommendCache';
import {
  getWeatherId,
  getWeatherRefreshSlot,
  isValidWeatherData,
  isValidWeatherId,
  readMainWeatherCache,
  writeMainWeatherCache,
} from '@/utils/mainWeatherCache';

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

const MAIN_LOCATION_NAME = '대구광역시, 북구';
const DEFAULT_RECOMMEND_STYLE = '여름 20대 남자 패션';

const categoryToDetailKey = {
  OUTER: 'outer',
  TOP: 'top',
  BOTTOM: 'bottom',
  SHOES: 'shoes',
};

const categoryLabels = {
  OUTER: '아우터',
  TOP: '상의',
  BOTTOM: '하의',
  SHOES: '신발',
  ACC: '액세서리',
  BAG: '가방',
};

const normalizeRecommendation = (recommendation, index = 0, clothesById = {}) => {
  if (!recommendation) return null;

  const usedClothesIds = Array.isArray(recommendation.usedClothesIds)
    ? recommendation.usedClothesIds
    : [];
  const missingCategories = Array.isArray(recommendation.missingCategories)
    ? recommendation.missingCategories
    : [];
  const imageSrc = recommendation.imageUrl || outfitImage;

  const namedDetails = { outer: '-', top: '-', bottom: '-', shoes: '-' };
  const pointItems = [];

  for (const id of usedClothesIds) {
    const cloth = clothesById[id];
    if (!cloth) continue;
    const detailKey = categoryToDetailKey[cloth.category];
    if (detailKey) {
      const current = namedDetails[detailKey];
      namedDetails[detailKey] = current === '-' ? cloth.name : `${current} / ${cloth.name}`;
    } else {
      pointItems.push(cloth.name);
    }
  }

  const point =
    pointItems.length > 0
      ? pointItems.join(', ')
      : missingCategories.length > 0
        ? `부족: ${missingCategories.map((c) => categoryLabels[c] ?? c).join(', ')}`
        : '-';

  return {
    id: recommendation.recommendationId ?? Date.now(),
    title: index === 0 ? '오늘의 OOTD 추천' : `추천 OOTD #${index + 1}`,
    imageSrc,
    imageUrl: imageSrc,
    description: recommendation.description ?? '',
    usedClothesIds,
    missingCategories,
    details: {
      ...namedDetails,
      point,
      reason: recommendation.description ?? '-',
    },
  };
};

const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });

function MainPage() {
  const [temperature, setTemperature] = useState(0);
  const [location, setLocation] = useState('');
  const [weatherId, setWeatherId] = useState(null);
  const [recommendedOutfits, setRecommendedOutfits] = useState(outfits);
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);
  const refreshTimerRef = useRef(null);
  const loadWeatherRef = useRef(null);
  const isMountedRef = useRef(false);
  const { seasonTheme } = useSeasonTheme();

  useEffect(() => {
    useClothesStore.getState().loadClothesLookup();
  }, []);

  const applyWeatherData = useCallback((data) => {
    if (!isMountedRef.current) return;

    setLocation(data.location);
    setTemperature(Number(data.temperature));
    setWeatherId(data.weatherId ?? null);
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
        weatherId: getWeatherId(responseData),
        location:
          responseData.location_name ??
          responseData.locationName ??
          MAIN_LOCATION_NAME,
        temperature: Number(
          responseData.current_temp ?? responseData.currentTemp,
        ),
      };

      if (!isValidWeatherData(weatherData)) {
        throw new Error('Invalid weather response data');
      }

      const nextRefreshAt = getWeatherRefreshSlot().nextRefreshAt;

      applyWeatherData(weatherData);
      writeMainWeatherCache(weatherData);
      scheduleNextWeatherLoad(nextRefreshAt);
    } catch {
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

  const loadRecommendations = useCallback(async (nextWeatherId, options = {}) => {
    if (!isValidWeatherId(nextWeatherId)) return;

    const numericWeatherId = Number(nextWeatherId);

    await useClothesStore.getState().loadClothesLookup();

    if (!options.force) {
      const cached = readOutfitRecommendCache(numericWeatherId);
      if (cached) {
        if (options.shouldIgnore?.()) return;
        const clothesById = useClothesStore.getState().clothesById;
        const nextOutfits = cached.recommendations
          .map((rec, idx) => normalizeRecommendation(rec, idx, clothesById))
          .filter(Boolean);
        if (nextOutfits.length > 0) setRecommendedOutfits(nextOutfits);
        return;
      }
    }

    setIsRecommendationLoading(true);

    try {
      const res = await fetchRecommend({
        weatherId: numericWeatherId,
        style: DEFAULT_RECOMMEND_STYLE,
      });
      const responseData = res.data?.data ?? res.data;
      const recommendationData = Array.isArray(responseData)
        ? responseData
        : [responseData];

      writeOutfitRecommendCache(numericWeatherId, recommendationData);

      const clothesById = useClothesStore.getState().clothesById;
      const nextOutfits = recommendationData
        .map((rec, idx) => normalizeRecommendation(rec, idx, clothesById))
        .filter(Boolean);

      if (options.shouldIgnore?.()) return;

      if (nextOutfits.length > 0) setRecommendedOutfits(nextOutfits);
    } catch {
      if (options.shouldIgnore?.()) return;
    } finally {
      if (!options.shouldIgnore?.()) {
        setIsRecommendationLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!isValidWeatherId(weatherId)) return undefined;

    let ignore = false;

    queueMicrotask(() => {
      loadRecommendations(weatherId, {
        shouldIgnore: () => ignore,
      });
    });

    return () => {
      ignore = true;
    };
  }, [loadRecommendations, weatherId]);

  const handleRetryRecommendations = () => {
    loadRecommendations(weatherId, { force: true });
  };

  return (
    <Page $background={seasonTheme.background}>
      <Question>🤔 오늘 뭐 입지 ?</Question>
      <OutfitCarousel items={recommendedOutfits} seasonTheme={seasonTheme} />
      <WeatherTip>☼ 선크림은 필수 !!</WeatherTip>
      <WeatherSection>
        <WeatherInfoCard
          location={location}
          temperature={Math.floor(temperature)}
          color={seasonTheme.primary}
        />
        <RetryButton
          color={seasonTheme.primary}
          onClick={handleRetryRecommendations}
          disabled={isRecommendationLoading}
        />
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
