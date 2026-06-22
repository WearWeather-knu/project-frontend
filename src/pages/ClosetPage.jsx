import { useMemo, useState } from 'react';
import styled from 'styled-components';

const categories = ['전체', '상의', '하의', '아우터', '신발', '악세서리'];

const closetItems = [
  {
    id: 1,
    name: '아이보리 니트',
    category: '상의',
    seasons: ['봄', '가을'],
    weather: '12°~18°',
    color: '#F6E8D7',
  },
  {
    id: 2,
    name: '라이트 데님',
    category: '하의',
    seasons: ['봄', '여름', '가을'],
    weather: '16°~24°',
    color: '#9DB7D5',
  },
  {
    id: 3,
    name: '네이비 트렌치',
    category: '아우터',
    seasons: ['봄', '가을'],
    weather: '10°~17°',
    color: '#31326F',
  },
  {
    id: 4,
    name: '화이트 스니커즈',
    category: '신발',
    seasons: ['사계절'],
    weather: '맑은 날',
    color: '#F4F5F7',
  },
  {
    id: 5,
    name: '실버 미니백',
    category: '악세서리',
    seasons: ['사계절'],
    weather: '외출용',
    color: '#D8DEE9',
  },
  {
    id: 6,
    name: '블랙 슬랙스',
    category: '하의',
    seasons: ['봄', '가을', '겨울'],
    weather: '8°~19°',
    color: '#222831',
  },
];

function ClosetPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const filteredItems = useMemo(() => {
    if (selectedCategory === '전체') {
      return closetItems;
    }

    return closetItems.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <Page>
      <TitleRow>
        <TitleGroup>
          <Title>내 옷장</Title>
          <Description>날씨에 맞춰 꺼내 입기 좋은 옷을 정리해요.</Description>
        </TitleGroup>
        <AddButton type="button">추가 예정</AddButton>
      </TitleRow>

      <CategoryScroller aria-label="옷 카테고리">
        {categories.map((category) => (
          <CategoryButton
            key={category}
            type="button"
            $active={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </CategoryButton>
        ))}
      </CategoryScroller>

      {filteredItems.length > 0 ? (
        <ClosetGrid>
          {filteredItems.map((item) => (
            <ClosetCard key={item.id}>
              <ColorSwatch $color={item.color} />
              <ItemInfo>
                <Category>{item.category}</Category>
                <ItemName>{item.name}</ItemName>
                <TagRow>
                  {item.seasons.map((season) => (
                    <Tag key={season}>{season}</Tag>
                  ))}
                </TagRow>
                <WeatherTag>{item.weather}</WeatherTag>
              </ItemInfo>
            </ClosetCard>
          ))}
        </ClosetGrid>
      ) : (
        <EmptyState>
          <EmptyTitle>이 카테고리에 등록된 옷이 없어요.</EmptyTitle>
          <EmptyText>옷 등록 기능이 연결되면 이곳에서 추가할 수 있어요.</EmptyText>
        </EmptyState>
      )}
    </Page>
  );
}

const Page = styled.section`
  min-height: 100%;
  display: grid;
  align-content: start;
  gap: 16px;
  padding-bottom: 12px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const TitleGroup = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

const Title = styled.h2`
  margin: 0;
  color: #111827;
  font-size: 24px;
`;

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  line-height: 1.45;
`;

const AddButton = styled.button`
  flex: 0 0 auto;
  padding: 9px 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.seasons.winter.primary};
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
`;

const CategoryScroller = styled.div`
  display: flex;
  gap: 8px;
  max-width: 100%;
  overflow-x: auto;
  padding-bottom: 4px;
`;

const CategoryButton = styled.button`
  flex: 0 0 auto;
  padding: 9px 13px;
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.seasons.winter.primary : theme.colors.border};
  border-radius: 999px;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.seasons.winter.primary : '#ffffff'};
  color: ${({ $active }) => ($active ? '#ffffff' : '#4b5563')};
  font-size: 13px;
  font-weight: 700;
`;

const ClosetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
`;

const ClosetCard = styled.article`
  min-width: 0;
  display: grid;
  gap: 10px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 8px 18px rgba(17, 24, 39, 0.05);
`;

const ColorSwatch = styled.div`
  height: 78px;
  border-radius: 8px;
  border: 1px solid rgba(17, 24, 39, 0.08);
  background: ${({ $color }) => $color};
`;

const ItemInfo = styled.div`
  min-width: 0;
  display: grid;
  gap: 7px;
`;

const Category = styled.span`
  color: ${({ theme }) => theme.colors.seasons.winter.primary};
  font-size: 12px;
  font-weight: 700;
`;

const ItemName = styled.h3`
  margin: 0;
  color: #111827;
  font-size: 16px;
  line-height: 1.3;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const Tag = styled.span`
  padding: 4px 7px;
  border-radius: 999px;
  background: #f2f4f7;
  color: #4b5563;
  font-size: 11px;
`;

const WeatherTag = styled.span`
  color: #6b7280;
  font-size: 12px;
`;

const EmptyState = styled.div`
  display: grid;
  gap: 8px;
  justify-items: center;
  padding: 44px 22px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: #fafafa;
  text-align: center;
`;

const EmptyTitle = styled.h3`
  margin: 0;
  color: #111827;
  font-size: 18px;
`;

const EmptyText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  line-height: 1.45;
`;

export default ClosetPage;
