import styled from 'styled-components';
import outfitImage from '@/assets/hero.png';

const likedOutfits = [
  {
    id: 1,
    title: '맑은 봄날 출근 코디',
    weather: '18° 맑음',
    tags: ['가벼운 아우터', '데님', '출근'],
    imageSrc: outfitImage,
  },
  {
    id: 2,
    title: '흐린 날 산책 코디',
    weather: '15° 구름 많음',
    tags: ['후드집업', '운동화', '산책'],
    imageSrc: outfitImage,
  },
  {
    id: 3,
    title: '따뜻한 주말 코디',
    weather: '22° 맑음',
    tags: ['셔츠', '면바지', '주말'],
    imageSrc: outfitImage,
  },
];

function HistoryPage() {
  const hasLikedOutfits = likedOutfits.length > 0;

  return (
    <Page>
      <TitleGroup>
        <Title>좋아요한 코디</Title>
        <Description>다시 보고 싶은 추천 코디를 모아봤어요.</Description>
      </TitleGroup>

      {hasLikedOutfits ? (
        <OutfitList>
          {likedOutfits.map((outfit) => (
            <OutfitCard key={outfit.id}>
              <Thumbnail src={outfit.imageSrc} alt="" />
              <CardBody>
                <CardTop>
                  <WeatherLabel>{outfit.weather}</WeatherLabel>
                  <UnlikeButton type="button" aria-label={`${outfit.title} 좋아요 해제`}>
                    ♥
                  </UnlikeButton>
                </CardTop>
                <CardTitle>{outfit.title}</CardTitle>
                <TagList>
                  {outfit.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </TagList>
              </CardBody>
            </OutfitCard>
          ))}
        </OutfitList>
      ) : (
        <EmptyState>
          <EmptyTitle>아직 좋아요한 코디가 없어요.</EmptyTitle>
          <EmptyText>마음에 드는 추천 코디를 저장하면 이곳에서 볼 수 있어요.</EmptyText>
        </EmptyState>
      )}
    </Page>
  );
}

const Page = styled.section`
  display: grid;
  gap: 18px;
`;

const TitleGroup = styled.div`
  display: grid;
  gap: 6px;
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
`;

const OutfitList = styled.div`
  display: grid;
  gap: 12px;
`;

const OutfitCard = styled.article`
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 14px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 8px 18px rgba(17, 24, 39, 0.06);
`;

const Thumbnail = styled.img`
  width: 96px;
  height: 112px;
  border-radius: 8px;
  object-fit: cover;
  background: #f3f4f6;
`;

const CardBody = styled.div`
  min-width: 0;
  display: grid;
  align-content: start;
  gap: 9px;
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const WeatherLabel = styled.span`
  color: ${({ theme }) => theme.colors.seasons.winter.primary};
  font-size: 13px;
  font-weight: 700;
`;

const UnlikeButton = styled.button`
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #fff1f2;
  color: #e11d48;
  font-size: 17px;
`;

const CardTitle = styled.h3`
  margin: 0;
  color: #111827;
  font-size: 17px;
  line-height: 1.35;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tag = styled.span`
  padding: 5px 8px;
  border-radius: 999px;
  background: #f2f4f7;
  color: #4b5563;
  font-size: 12px;
`;

const EmptyState = styled.div`
  display: grid;
  gap: 8px;
  justify-items: center;
  padding: 48px 24px;
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

export default HistoryPage;
