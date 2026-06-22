import styled from 'styled-components';

const weatherDays = [
  {
    id: 'yesterday',
    label: '어제',
    date: '6월 22일',
    temp: 21,
    feelsLike: 22,
    humidity: 58,
    wind: 2.1,
    condition: '구름 많음',
    outfit: '얇은 니트와 가벼운 자켓',
    accent: '#8A93A3',
  },
  {
    id: 'today',
    label: '오늘',
    date: '6월 23일',
    temp: 24,
    feelsLike: 25,
    humidity: 66,
    wind: 2.8,
    condition: '맑음',
    outfit: '반팔 셔츠와 얇은 팬츠',
    accent: '#31326F',
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
    value: getSignedText(today.temp - yesterday.temp, '°'),
    summary:
      today.temp > yesterday.temp
        ? '오늘이 어제보다 더워요.'
        : today.temp < yesterday.temp
          ? '오늘이 어제보다 추워요.'
          : '어제와 기온이 같아요.',
  },
  {
    label: '체감',
    value: getSignedText(today.feelsLike - yesterday.feelsLike, '°'),
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
  return (
    <Page>
      <TitleGroup>
        <Eyebrow>Daily Weather</Eyebrow>
        <Title>오늘과 어제 비교</Title>
        <Description>
          어제보다 오늘이 더 더운지, 습한지, 바람이 강한지 확인해요.
        </Description>
      </TitleGroup>

      <WeatherGrid>
        {weatherDays.map((day) => (
          <WeatherCard key={day.id} $accent={day.accent} $primary={day.id === 'today'}>
            <CardHeader>
              <Badge $accent={day.accent}>{day.label}</Badge>
              <DateText>{day.date}</DateText>
            </CardHeader>
            <Condition>{day.condition}</Condition>
            <Temperature>{day.temp}°</Temperature>
            <MetaGrid>
              <MetaItem>
                <MetaLabel>체감</MetaLabel>
                <MetaValue>{day.feelsLike}°</MetaValue>
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
            <OutfitBox>
              <MetaLabel>추천 옷차림</MetaLabel>
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
                <MetricValue>{metric.value}</MetricValue>
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
  display: grid;
  gap: 18px;
  padding-bottom: 8px;
`;

const TitleGroup = styled.div`
  display: grid;
  gap: 6px;
`;

const Eyebrow = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.seasons.winter.primary};
  font-size: 13px;
  font-weight: 700;
`;

const Title = styled.h2`
  margin: 0;
  color: #111827;
  font-size: 24px;
  font-weight: 700;
`;

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  line-height: 1.5;
`;

const WeatherGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const WeatherCard = styled.article`
  display: grid;
  gap: 12px;
  padding: 16px;
  border: 1px solid ${({ $accent }) => `${$accent}2e`};
  border-radius: 8px;
  background: ${({ $primary }) => ($primary ? '#fbfbff' : '#ffffff')};
  box-shadow: 0 8px 20px rgba(49, 50, 111, 0.08);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const Badge = styled.span`
  padding: 5px 9px;
  border-radius: 999px;
  background: ${({ $accent }) => `${$accent}14`};
  color: ${({ $accent }) => $accent};
  font-size: 12px;
  font-weight: 700;
`;

const DateText = styled.span`
  color: #8a93a3;
  font-size: 12px;
`;

const Condition = styled.h3`
  margin: 0;
  color: #111827;
  font-size: 18px;
`;

const Temperature = styled.p`
  margin: 0;
  color: #111827;
  font-size: 44px;
  font-weight: 700;
  line-height: 1;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

const MetaItem = styled.div`
  display: grid;
  gap: 3px;
  min-width: 0;
`;

const MetaLabel = styled.span`
  color: #8a93a3;
  font-size: 12px;
`;

const MetaValue = styled.strong`
  color: #111827;
  font-size: 13px;
`;

const OutfitBox = styled.div`
  display: grid;
  gap: 4px;
  padding: 12px;
  border-radius: 8px;
  background: #f6f7fb;
`;

const Outfit = styled.p`
  margin: 0;
  color: #111827;
  font-size: 14px;
  line-height: 1.4;
`;

const SummaryCard = styled.section`
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.seasons.winter.background};
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: #111827;
  font-size: 18px;
`;

const MetricList = styled.div`
  display: grid;
  gap: 8px;
`;

const MetricItem = styled.article`
  display: grid;
  gap: 5px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.82);
`;

const MetricHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const MetricLabel = styled.span`
  color: #4b5563;
  font-size: 13px;
  font-weight: 700;
`;

const MetricValue = styled.strong`
  color: ${({ theme }) => theme.colors.seasons.winter.primary};
  font-size: 17px;
`;

const MetricSummary = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  line-height: 1.45;
`;

export default ComparisonPage;
