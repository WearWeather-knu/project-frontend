import styled from 'styled-components';
import { useSeasonTheme } from '@/store/seasonThemeStore';

const preferenceGroups = [
  {
    title: '패션 선호',
    options: ['스트릿', '캐주얼', '미니멀', '페미닌'],
  },
  {
    title: '날씨 관련',
    options: ['더위 취약', '추위 취약', '햇빛 알러지', '비 오는 날 선호'],
  },
];

function StylePreferencesPage() {
  const { seasonTheme } = useSeasonTheme();

  return (
    <Page $background={seasonTheme.background}>
      <Title>스 타 일  취 향  설 정</Title>
      <SectionList>
        {preferenceGroups.map((group) => (
          <PreferenceSection key={group.title} $shadowColor={seasonTheme.primary}>
            <SectionTitle>{group.title}</SectionTitle>
            <OptionGrid>
              {group.options.map((option, index) => (
                <OptionButton
                  key={option}
                  type="button"
                  $active={index < 2}
                  $primary={seasonTheme.primary}
                >
                  #{option}
                </OptionButton>
              ))}
            </OptionGrid>
          </PreferenceSection>
        ))}
      </SectionList>
    </Page>
  );
}

const Page = styled.section`
  min-height: calc(100% + 44px);
  display: grid;
  align-content: start;
  gap: 20px;
  margin: -20px -20px -24px;
  padding: 28px 20px 32px;
  background: ${({ $background }) => $background};
`;

const Title = styled.h2`
  margin: 0 0 4px 22px;
  color: #43474F;
  font-family: 'KyoboHandwriting2025lyb', sans-serif;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0;
`;

const SectionList = styled.div`
  display: grid;
  gap: 18px;
`;

const PreferenceSection = styled.section`
  display: grid;
  gap: 16px;
  padding: 22px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 8px 22px ${({ $shadowColor }) => `${$shadowColor}29`};
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 17px;
  font-weight: 500;
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
`;

const OptionButton = styled.button`
  min-height: 36px;
  padding: 8px 10px;
  border: 1px solid ${({ $primary }) => $primary};
  border-radius: 999px;
  background: ${({ $active, $primary }) => ($active ? $primary : '#ffffff')};
  color: ${({ $active, $primary }) => ($active ? '#ffffff' : $primary)};
  font-size: 13px;
`;

export default StylePreferencesPage;
