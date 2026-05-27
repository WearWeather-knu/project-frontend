import { useTheme } from 'styled-components';
import styled from 'styled-components';
import outfitImage from '@/assets/hero.png';
import OutfitCarousel from '@/components/main/OutfitCarousel';
import RetryButton from '@/components/main/RetryButton';
import WeatherInfoCard from '@/components/main/WeatherInfoCard';

const outfits = [
  { id: 1, title: '첫 번째 추천 코디', imageSrc: outfitImage },
  { id: 2, title: '두 번째 추천 코디', imageSrc: outfitImage },
  { id: 3, title: '세 번째 추천 코디', imageSrc: outfitImage },
  { id: 4, title: '네 번째 추천 코디', imageSrc: outfitImage },
  { id: 5, title: '다섯 번째 추천 코디', imageSrc: outfitImage },
];

function MainPage() {
  const theme = useTheme();
  const season = 'winter'; // 예시로 겨울 테마를 사용
  const seasonTheme = theme.colors.seasons[season];

  return (
    <Page $background={seasonTheme.background}>
      <Question>🤔 오늘 뭐 입지 ?</Question>
      <OutfitCarousel items={outfits} seasonTheme={seasonTheme} />
      <WeatherTip>☼ 선크림은 필수 !!</WeatherTip>
      <WeatherSection>
        <WeatherInfoCard
          location="Daegu, korea"
          temperature={22}
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
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  font-weight: 500;
`;

const WeatherTip = styled.p`
  margin: 4px 0 8px;
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
