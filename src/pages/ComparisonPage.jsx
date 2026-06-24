import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { getWeatherComparison } from '@/api/weather';
import { useSeasonTheme } from '@/store/seasonThemeStore';
import {
  WEATHER_COMPARISON_LOCATION,
  isValidComparisonData,
  readWeatherComparisonCache,
  writeWeatherComparisonCache,
} from '@/utils/weatherComparisonCache';

const comparisonLocation = WEATHER_COMPARISON_LOCATION;

const conditionLabels = {
  'thunderstorm with light rain': '천둥번개',
  'thunderstorm with rain': '천둥번개',
  'thunderstorm with heavy rain': '천둥번개',
  'light thunderstorm': '천둥번개',
  thunderstorm: '천둥번개',
  'heavy thunderstorm': '천둥번개',
  'ragged thunderstorm': '천둥번개',
  'thunderstorm with light drizzle': '천둥번개',
  'thunderstorm with drizzle': '천둥번개',
  'thunderstorm with heavy drizzle': '천둥번개',
  'light intensity drizzle': '이슬비',
  drizzle: '이슬비',
  'heavy intensity drizzle': '이슬비',
  'light intensity drizzle rain': '이슬비',
  'drizzle rain': '이슬비',
  'heavy intensity drizzle rain': '이슬비',
  'shower rain and drizzle': '이슬비',
  'heavy shower rain and drizzle': '이슬비',
  'shower drizzle': '이슬비',
  'light rain': '비',
  'moderate rain': '비',
  'heavy intensity rain': '비',
  'very heavy rain': '비',
  'extreme rain': '비',
  'freezing rain': '비',
  'light intensity shower rain': '비',
  'shower rain': '비',
  'heavy intensity shower rain': '비',
  'ragged shower rain': '비',
  'light snow': '눈',
  snow: '눈',
  'heavy snow': '눈',
  sleet: '눈',
  'light shower sleet': '눈',
  'shower sleet': '눈',
  'light rain and snow': '눈',
  'rain and snow': '눈',
  'light shower snow': '눈',
  'shower snow': '눈',
  'heavy shower snow': '눈',
  mist: '대기',
  smoke: '대기',
  haze: '대기',
  'sand/dust whirls': '대기',
  fog: '대기',
  sand: '대기',
  dust: '대기',
  'volcanic ash': '대기',
  squalls: '대기',
  tornado: '대기',
  'clear sky': '맑음',
  'few clouds': '구름',
  'scattered clouds': '구름',
  'broken clouds': '구름',
  'overcast clouds': '구름',
};

const formatDate = (date) => {
  if (!date) return '--.--';

  const [, month, day] = date.split('-');

  if (!month || !day) return date;

  return `${month}.${day}`;
};

const formatNumber = (value, fractionDigits = 0) => {
  const number = Number(value);

  if (!Number.isFinite(number)) return '-';

  return number.toFixed(fractionDigits);
};

const getSignedText = (value, unit) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return `-${unit}`;
  }

  const roundedValue = Number(number.toFixed(1));

  if (roundedValue > 0) {
    return `+${roundedValue}${unit}`;
  }

  return `${roundedValue}${unit}`;
};

const isPositiveNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) && number > 0;
};

const getUvIndexLevel = (value) => {
  const uvIndex = Number(value);

  if (!Number.isFinite(uvIndex)) return '정보 없음';
  if (uvIndex <= 2) return '낮음';
  if (uvIndex <= 5) return '보통';
  if (uvIndex <= 7) return '높음';
  if (uvIndex <= 10) return '매우 높음';

  return '위험';
};

const getPm10Level = (value) => {
  const pm10 = Number(value);

  if (!Number.isFinite(pm10)) return '정보 없음';
  if (pm10 <= 30) return '좋음';
  if (pm10 <= 80) return '보통';
  if (pm10 <= 150) return '나쁨';

  return '매우 나쁨';
};

const getConditionLabel = (condition) => {
  if (!condition) return '-';

  const normalizedCondition = condition.toLowerCase().trim();

  return conditionLabels[normalizedCondition] ?? condition;
};

const createEnvironmentText = (day) => {
  const environmentItems = [
    `자외선 ${getUvIndexLevel(day.uvIndex)}`,
    `미세먼지 ${getPm10Level(day.pm10)}`,
  ];

  if (isPositiveNumber(day.pop)) {
    environmentItems.unshift(`강수 ${day.pop}%`);
  }

  return environmentItems.join(' · ');
};

const getComparisonSummary = (todayValue, yesterdayValue, messages) => {
  const todayNumber = Number(todayValue);
  const yesterdayNumber = Number(yesterdayValue);

  if (!Number.isFinite(todayNumber) || !Number.isFinite(yesterdayNumber)) {
    return '비교할 수 있는 데이터가 부족해요.';
  }

  if (todayNumber > yesterdayNumber) return messages.up;
  if (todayNumber < yesterdayNumber) return messages.down;

  return messages.same;
};

const createWeatherDay = (id, weather) => ({
  id,
  date: formatDate(weather?.date),
  avgTemp: formatNumber(weather?.avg_temp, 0),
  minTemp: formatNumber(weather?.temp_min, 1),
  maxTemp: formatNumber(weather?.temp_max, 1),
  feelsLike: formatNumber(weather?.feels_like, 1),
  humidity: formatNumber(weather?.humidity),
  wind: formatNumber(weather?.wind_speed, 1),
  condition: getConditionLabel(weather?.sky_status),
  pop: formatNumber(weather?.pop),
  uvIndex: formatNumber(weather?.uv_index, 1),
  pm10: formatNumber(weather?.pm10),
  isCloudy: weather?.sky_status?.toLowerCase().includes('cloud') ?? false,
});

const createComparisonMetrics = (today, yesterday) => {
  const popDifference = Number(today.pop) - Number(yesterday.pop);
  const metrics = [
    {
      label: '평균기온',
      value: getSignedText(
        Number(today.avg_temp) - Number(yesterday.avg_temp),
        '℃',
      ),
      summary: getComparisonSummary(today.avg_temp, yesterday.avg_temp, {
        up: '오늘이 어제보다 더워요.',
        down: '오늘이 어제보다 추워요.',
        same: '어제와 평균 기온이 같아요.',
      }),
    },
    {
      label: '습도',
      value: getSignedText(
        Number(today.humidity) - Number(yesterday.humidity),
        '%',
      ),
      summary: getComparisonSummary(today.humidity, yesterday.humidity, {
        up: '오늘이 조금 더 습해요.',
        down: '오늘이 더 쾌적해요.',
        same: '습도는 거의 같아요.',
      }),
    },
    {
      label: '바람',
      value: getSignedText(
        Number(today.wind_speed) - Number(yesterday.wind_speed),
        'm/s',
      ),
      summary: getComparisonSummary(today.wind_speed, yesterday.wind_speed, {
        up: '바람이 어제보다 조금 강해요.',
        down: '바람이 어제보다 약해요.',
        same: '바람 세기는 비슷해요.',
      }),
    },
  ];

  if (Number.isFinite(popDifference) && popDifference !== 0) {
    metrics.push({
      label: '강수확률',
      value: getSignedText(popDifference, '%'),
      summary: getComparisonSummary(today.pop, yesterday.pop, {
        up: '비가 올 가능성이 어제보다 높아요.',
        down: '비가 올 가능성이 어제보다 낮아요.',
        same: '강수확률은 어제와 비슷해요.',
      }),
    });
  }

  return metrics;
};

function ComparisonPage() {
  const { seasonTheme } = useSeasonTheme();
  const [comparisonData, setComparisonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadWeatherComparison = useCallback(async ({ ignoreCache = false } = {}) => {
    setIsLoading(true);
    setError('');

    if (!ignoreCache) {
      const cachedData = readWeatherComparisonCache();

      if (cachedData) {
        setComparisonData(cachedData);
        setIsLoading(false);
        return;
      }
    }

    try {
      console.log('weather comparison request', {
        location_name: comparisonLocation,
      });
      const response = await getWeatherComparison(comparisonLocation);
      const responseData = response.data?.data ?? response.data;
      console.log('weather comparison response', response);
      console.log('weather comparison response.data', response.data);
      console.log('weather comparison responseData', responseData);

      if (!isValidComparisonData(responseData)) {
        setError('비교할 날씨 데이터가 아직 없어요.');
        setComparisonData(null);
        return;
      }

      setComparisonData(responseData);
      writeWeatherComparisonCache(responseData);
    } catch (comparisonError) {
      console.error('weather comparison error', comparisonError);
      console.error(
        'weather comparison error.response',
        comparisonError.response,
      );
      setError('날씨 비교 정보를 불러오지 못했어요.');
      setComparisonData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadWeatherComparison();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadWeatherComparison]);

  const weatherDays = useMemo(() => {
    if (!comparisonData) return [];

    return [
      createWeatherDay('yesterday', comparisonData.yesterday),
      createWeatherDay('today', comparisonData.today),
    ];
  }, [comparisonData]);

  const comparisonMetrics = useMemo(() => {
    if (!comparisonData) return [];

    return createComparisonMetrics(
      comparisonData.today,
      comparisonData.yesterday,
    );
  }, [comparisonData]);

  return (
    <Page $background={seasonTheme.background} $primary={seasonTheme.primary}>
      <TitleGroup>
        <Title>W E A T H E R</Title>
      </TitleGroup>

      {isLoading ? (
        <ComparisonSkeleton primary={seasonTheme.primary} />
      ) : error ? (
        <StatusCard>
          <StatusText>{error}</StatusText>
          <RetryButton
            type="button"
            onClick={() => loadWeatherComparison({ ignoreCache: true })}
          >
            다시 시도
          </RetryButton>
        </StatusCard>
      ) : (
        <>
          <WeatherGrid>
            {weatherDays.map((day) => (
              <WeatherCard
                key={day.id}
                $primary={seasonTheme.primary}
                $muted={day.id === 'yesterday'}
              >
                <CardHeader>
                  <Badge
                    $primary={seasonTheme.primary}
                    $muted={day.id === 'yesterday'}
                  >
                    {day.id === 'yesterday' ? '어제' : '오늘'}
                  </Badge>
                  <DateText>{day.date}</DateText>
                </CardHeader>
                <WeatherMain>
                  <WeatherTextGroup>
                    <Condition>{day.condition}</Condition>
                    <Temperature $primary={seasonTheme.primary}>
                      {day.avgTemp}℃
                    </Temperature>
                  </WeatherTextGroup>
                  <WeatherIcon
                    $primary={seasonTheme.primary}
                    $cloud={day.isCloudy}
                  />
                </WeatherMain>
                <MetaGrid>
                  <MetaItem>
                    <MetaLabel>체감</MetaLabel>
                    <MetaValue>{day.feelsLike}℃</MetaValue>
                  </MetaItem>
                  <MetaItem>
                    <MetaLabel>습도</MetaLabel>
                    <MetaValue>{day.humidity}%</MetaValue>
                  </MetaItem>
                  <MetaItem>
                    <MetaLabel>바람</MetaLabel>
                    <MetaValue>{day.wind}m/s</MetaValue>
                  </MetaItem>
                </MetaGrid>
                <OutfitBox
                  $primary={seasonTheme.primary}
                  $muted={day.id === 'yesterday'}
                >
                  <OutfitLabel $primary={seasonTheme.primary}>
                    날씨 정보
                  </OutfitLabel>
                  <Outfit>{createEnvironmentText(day)}</Outfit>
                </OutfitBox>
              </WeatherCard>
            ))}
          </WeatherGrid>

          <SummaryCard>
            <SectionTitle>오늘은 이렇게 달라요</SectionTitle>
            <MetricList>
              {comparisonMetrics.map((metric) => (
                <MetricItem key={metric.label}>
                  <MetricHead>
                    <MetricLabel>{metric.label}</MetricLabel>
                    <MetricValue $primary={seasonTheme.primary}>
                      {metric.value}
                    </MetricValue>
                  </MetricHead>
                  <MetricSummary>{metric.summary}</MetricSummary>
                </MetricItem>
              ))}
            </MetricList>
          </SummaryCard>
        </>
      )}
    </Page>
  );
}

function ComparisonSkeleton({ primary }) {
  return (
    <SkeletonContent aria-hidden="true">
      <WeatherGrid>
        {[
          { id: 'yesterday', label: '어제' },
          { id: 'today', label: '오늘' },
        ].map((day) => (
          <WeatherCard
            key={day.id}
            $primary={primary}
            $muted={day.id === 'yesterday'}
          >
            <CardHeader>
              <Badge $primary={primary} $muted={day.id === 'yesterday'}>
                {day.label}
              </Badge>
              <SkeletonDateBlock />
            </CardHeader>
            <WeatherMain>
              <SkeletonWeatherMainBlock />
            </WeatherMain>
            <MetaGrid>
              <SkeletonMetaGridBlock />
            </MetaGrid>
            <OutfitBox $primary={primary} $muted={day.id === 'yesterday'}>
              <OutfitLabel $primary={primary}>날씨 정보</OutfitLabel>
              <SkeletonOutfitTextBlock />
            </OutfitBox>
          </WeatherCard>
        ))}
      </WeatherGrid>

      <SummaryCard>
        <SectionTitle>오늘은 이렇게 달라요</SectionTitle>
        <MetricList>
          {[0, 1, 2].map((item) => (
            <MetricItem key={item}>
              <SkeletonMetricBlock />
            </MetricItem>
          ))}
        </MetricList>
      </SummaryCard>
    </SkeletonContent>
  );
}

const Page = styled.section`
  min-height: calc(100% + 44px);
  display: grid;
  gap: 20px;
  margin: -20px -20px -24px;
  padding: 28px 20px 32px;
  background: ${({ $background }) => $background};
  --season-primary: ${({ $primary }) => $primary};
`;

const TitleGroup = styled.div`
  display: grid;
  gap: 6px;
`;

const Title = styled.h2`
  margin: 0 0 4px 22px;
  color: #43474f;
  font-family: 'KyoboHandwriting2025lyb', sans-serif;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0;
`;

const StatusCard = styled.div`
  display: grid;
  gap: 14px;
  justify-items: center;
  align-content: center;
  min-height: 220px;
  padding: 24px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.72);
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  text-align: center;
`;

const StatusText = styled.p`
  margin: 0;
`;

const RetryButton = styled.button`
  height: 38px;
  padding: 0 18px;
  border-radius: 8px;
  background: var(--season-primary);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
`;

const SkeletonBlock = styled.div`
  width: ${({ $width }) => $width ?? '100%'};
  height: ${({ $height }) => $height};
  border-radius: ${({ $radius }) => $radius ?? '8px'};
  background: linear-gradient(
    90deg,
    rgba(229, 231, 235, 0.62) 0%,
    rgba(255, 255, 255, 0.78) 45%,
    rgba(229, 231, 235, 0.62) 100%
  );
  background-size: 220% 100%;
  animation: skeleton-shimmer 1200ms ease-in-out infinite;

  @keyframes skeleton-shimmer {
    0% {
      background-position: 120% 0;
    }

    100% {
      background-position: -120% 0;
    }
  }
`;

const SkeletonContent = styled.div`
  display: contents;
`;

const WeatherGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

const WeatherCard = styled.article`
  display: grid;
  gap: 0;
  min-width: 0;
  padding: 14px 10px 12px;
  border-radius: 8px;
  background: ${({ $muted }) =>
    $muted ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'};
  box-shadow: 0 8px 22px ${({ $primary }) => `${$primary}24`};
`;

const SkeletonDateBlock = styled(SkeletonBlock).attrs({
  $height: '12px',
  $width: '38px',
})``;

const SkeletonWeatherMainBlock = styled(SkeletonBlock).attrs({
  $height: '48px',
  $width: '100%',
})`
  margin-left: 4px;
`;

const SkeletonMetaGridBlock = styled(SkeletonBlock).attrs({
  $height: '21px',
})`
  grid-column: 1 / -1;
`;

const SkeletonOutfitTextBlock = styled(SkeletonBlock).attrs({
  $height: '18px',
  $width: '90%',
})`
  justify-self: center;
`;

const SkeletonMetricBlock = styled(SkeletonBlock).attrs({
  $height: '32px',
  $width: '100%',
})``;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
`;

const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 999px;
  background: ${({ $primary, $muted }) =>
    $muted ? '#f2f4f7' : `${$primary}24`};
  color: ${({ $primary, $muted }) => ($muted ? '#9ca3af' : $primary)};
  font-size: 10px;
  font-weight: 400;
`;

const DateText = styled.span`
  color: #43474f;
  font-size: 12px;
`;

const Condition = styled.h3`
  margin: 0;
  color: #43474f;
  font-size: 10px;
  font-weight: 400;
`;

const WeatherMain = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 12px;
`;

const WeatherTextGroup = styled.div`
  min-width: 0;
  display: grid;
  gap: 2px;
  padding-left: 4px;
`;

const Temperature = styled.p`
  margin: 0;
  color: ${({ $primary }) => $primary};
  font-family: 'Coda Caption', sans-serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
`;

function WeatherIcon({ $primary, $cloud }) {
  return $cloud ? (
    <IconSvg width="56" height="56" viewBox="0 0 45 45" fill="none">
      <path
        d="M13.5 30.5H31.8C35.7 30.5 38.8 27.4 38.8 23.6C38.8 19.8 35.7 16.8 31.9 16.8H31.2C30.1 12.8 26.4 9.9 22 9.9C16.9 9.9 12.7 13.9 12.4 19C8.9 19.4 6.2 21.8 6.2 25C6.2 28.1 9.4 30.5 13.5 30.5Z"
        fill={$primary}
        opacity="0.92"
      />
      <path
        d="M9 37H35"
        stroke={$primary}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M14 42H30"
        stroke={$primary}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </IconSvg>
  ) : (
    <IconSvg width="56" height="56" viewBox="0 0 45 45" fill="none">
      <circle cx="22.5" cy="22.5" r="8" fill={$primary} opacity="0.92" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((rotate) => (
        <path
          key={rotate}
          d="M22.5 5.5V10.5"
          stroke={$primary}
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${rotate} 22.5 22.5)`}
        />
      ))}
    </IconSvg>
  );
}

const IconSvg = styled.svg`
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  justify-items: center;
  padding: 0 4px;
  transform: translateX(-2px);
  margin-bottom: 14px;
`;

const MetaItem = styled.div`
  display: grid;
  gap: 3px;
  justify-items: start;
  min-width: 0;
  width: max-content;
  text-align: left;
`;

const MetaLabel = styled.span`
  color: #8a93a3;
  font-size: 8px;
`;

const MetaValue = styled.strong`
  color: #111827;
  font-size: 10px;
`;

const OutfitBox = styled.div`
  display: grid;
  gap: 9px;
  min-height: 58px;
  align-content: center;
  padding: 10px 8px;
  border-radius: 8px;
  background: ${({ $muted, $primary }) =>
    $muted ? 'rgba(199, 199, 199, 0.2)' : `${$primary}24`};
  text-align: center;
`;

const OutfitLabel = styled.span`
  color: ${({ $primary }) => $primary};
  font-size: 8px;
`;

const Outfit = styled.p`
  margin: 0;
  color: #111827;
  font-size: 10px;
  line-height: 1.4;
`;

const SummaryCard = styled.section`
  display: grid;
  gap: 14px;
`;

const SectionTitle = styled.h3`
  margin: 4px 12px;
  color: #43474f;
  font-size: 14px;
  font-weight: 400;
`;

const MetricList = styled.div`
  display: grid;
  gap: 12px;
`;

const MetricItem = styled.article`
  display: grid;
  align-content: center;
  gap: 2px;
  min-height: 58px;
  padding: 13px 18px 17px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 6px 18px
    color-mix(in srgb, var(--season-primary) 16%, transparent);
`;

const MetricHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const MetricLabel = styled.span`
  color: #4b5563;
  font-family: inherit;
  font-size: 11px;
  font-weight: 400;
`;

const MetricValue = styled.strong`
  transform: translateY(10px);
  color: ${({ $primary }) => $primary};
  font-family: 'Pretendard', sans-serif;
  font-size: 18px;
  font-weight: 800;
  line-height: 1;
`;

const MetricSummary = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  line-height: 1.25;
`;

export default ComparisonPage;
