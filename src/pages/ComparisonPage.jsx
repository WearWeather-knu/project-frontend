import styled from 'styled-components';
import { useSeasonTheme } from '@/store/seasonThemeStore';

const weatherDays = [
  {
    id: 'yesterday',
    label: '어제',
    date: '06.22',
    temp: 21,
    feelsLike: 22,
    humidity: 58,
    wind: 2.1,
    condition: '구름 많음',
    outfit: '얇은 니트와 가벼운 자켓',
  },
  {
    id: 'today',
    label: '오늘',
    date: '06.23',
    temp: 24,
    feelsLike: 25,
    humidity: 66,
    wind: 2.8,
    condition: '맑음',
    outfit: '반팔 셔츠와 얇은 팬츠',
  },
];

const yesterday = weatherDays[0];
const today = weatherDays[1];

const getSignedText = (value, unit) => {
  if (value > 0) {
    return `+${value}${unit}`;
  }

  return `${value}${unit}`;
};

const comparisonMetrics = [
  {
    label: '기온',
    value: getSignedText(today.temp - yesterday.temp, '℃'),
    summary:
      today.temp > yesterday.temp
        ? '오늘이 어제보다 더워요.'
        : today.temp < yesterday.temp
          ? '오늘이 어제보다 추워요.'
          : '어제와 기온이 같아요.',
  },
  {
    label: '체감',
    value: getSignedText(today.feelsLike - yesterday.feelsLike, '℃'),
    summary:
      today.feelsLike > yesterday.feelsLike
        ? '몸으로 느끼는 온도도 더 높아요.'
        : today.feelsLike < yesterday.feelsLike
          ? '몸으로 느끼는 온도는 더 낮아요.'
          : '체감 온도는 비슷해요.',
  },
  {
    label: '습도',
    value: getSignedText(today.humidity - yesterday.humidity, '%'),
    summary:
      today.humidity > yesterday.humidity
        ? '오늘이 조금 더 습해요.'
        : today.humidity < yesterday.humidity
          ? '오늘이 더 쾌적해요.'
          : '습도는 거의 같아요.',
  },
  {
    label: '바람',
    value: getSignedText((today.wind - yesterday.wind).toFixed(1), 'm/s'),
    summary:
      today.wind > yesterday.wind
        ? '바람이 어제보다 조금 강해요.'
        : today.wind < yesterday.wind
          ? '바람이 어제보다 약해요.'
          : '바람 세기는 비슷해요.',
  },
];

function ComparisonPage() {
  const { seasonTheme } = useSeasonTheme();

  return (
    <Page $background={seasonTheme.background} $primary={seasonTheme.primary}>
      <TitleGroup>
        <Title>W E A T H E R</Title>
      </TitleGroup>

      <WeatherGrid>
        {weatherDays.map((day) => (
          <WeatherCard
            key={day.id}
            $primary={seasonTheme.primary}
            $muted={day.id === 'yesterday'}
          >
            <CardHeader>
              <Badge $primary={seasonTheme.primary} $muted={day.id === 'yesterday'}>
                {day.id === 'yesterday' ? 'YESTERDAY' : 'TODAY'}
              </Badge>
              <DateText>{day.date}</DateText>
            </CardHeader>
            <Condition>{day.condition}</Condition>
            <WeatherMain>
              <Temperature>{day.temp}℃</Temperature>
              <WeatherIcon $primary={seasonTheme.primary} $cloud={day.id === 'yesterday'} />
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
              <OutfitLabel>추천 옷차림</OutfitLabel>
              <Outfit>{day.outfit}</Outfit>
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
                <MetricValue $primary={seasonTheme.primary}>{metric.value}</MetricValue>
              </MetricHead>
              <MetricSummary>{metric.summary}</MetricSummary>
            </MetricItem>
          ))}
        </MetricList>
      </SummaryCard>
    </Page>
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
  color: #43474F;
  font-family: 'KyoboHandwriting2025lyb', sans-serif;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0;
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

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 28px;
`;

const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 999px;
  background: ${({ $primary, $muted }) => ($muted ? '#f2f4f7' : `${$primary}24`)};
  color: ${({ $primary, $muted }) => ($muted ? '#9ca3af' : $primary)};
  font-size: 10px;
  font-weight: 400;
`;

const DateText = styled.span`
  color: #43474F;
  font-size: 12px;
`;

const Condition = styled.h3`
  margin: 0;
  margin-bottom: -3px;
  transform: translateX(10px);
  color: #43474F;
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

const Temperature = styled.p`
  margin: 0;
  transform: translateX(10px);
  color: #448662;
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
      <path d="M9 37H35" stroke={$primary} strokeWidth="3" strokeLinecap="round" />
      <path d="M14 42H30" stroke={$primary} strokeWidth="3" strokeLinecap="round" />
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
  flex: 0 0 auto;
  transform: translateY(-6px);
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
  color: #448662;
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
  margin: 16px 0 4px 22px;
  color: #43474F;
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
  box-shadow: 0 6px 18px color-mix(in srgb, var(--season-primary) 16%, transparent);
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
