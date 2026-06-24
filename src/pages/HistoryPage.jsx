import { useState } from 'react';
import styled from 'styled-components';
import OutfitCard from '@/components/main/OutfitCard';
import { useLikedOutfits } from '@/store/likedOutfitsStore';
import { useSeasonTheme } from '@/store/seasonThemeStore';

function HistoryPage() {
  const [flippedCardIds, setFlippedCardIds] = useState([]);
  const { likedOutfits, toggleLikedOutfit } = useLikedOutfits();
  const { seasonTheme } = useSeasonTheme();
  const hasLikedOutfits = likedOutfits.length > 0;
  const cardColor = seasonTheme.primary;

  const toggleCard = (id) => {
    setFlippedCardIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id],
    );
  };

  return (
    <Page $background={seasonTheme.background}>
      <Title>P I C K S</Title>

      {hasLikedOutfits ? (
        <OutfitList>
          {likedOutfits.map((outfit, index) => (
            <OutfitCard
              key={outfit.id}
              imageSrc={outfit.imageSrc}
              title={outfit.title}
              details={outfit.details}
              color={cardColor}
              isFlipped={flippedCardIds.includes(outfit.id)}
              isFavorite
              favoriteSize={24}
              favoriteOffset={{ top: 8, right: 10 }}
              recommendationNumber={index + 1}
              compact
              onToggle={() => toggleCard(outfit.id)}
              onFavoriteToggle={() => toggleLikedOutfit(outfit)}
            />
          ))}
        </OutfitList>
      ) : (
        <EmptyState>
          <EmptyTitle $textColor={seasonTheme.text}>
            아직 저장된 코디가 없어요.
          </EmptyTitle>
          <EmptyText>마음에 드는 추천 코디의 별을 누르면 이곳에 모여요.</EmptyText>
        </EmptyState>
      )}
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

const OutfitList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 14px;
`;

const EmptyState = styled.div`
  display: grid;
  justify-items: center;
  gap: 10px;
  margin: 12px 20px 0;
  padding: 44px 24px 42px;
  border-radius: 28px;
  text-align: center;
`;

const EmptyTitle = styled.h3`
  margin: 0;
  color: ${({ $textColor }) => $textColor};
  font-size: 18px;
`;

const EmptyText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  line-height: 1.45;
`;

export default HistoryPage;
