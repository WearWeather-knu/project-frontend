import styled from 'styled-components';

const detailRows = [
  ['상의', 'top'],
  ['하의', 'bottom'],
  ['아우터', 'outer'],
  ['신발', 'shoes'],
  ['포인트', 'point'],
];

function OutfitCard({
  imageSrc,
  title,
  details,
  color,
  isFlipped,
  isFavorite = false,
  favoriteSize = 32,
  favoriteOffset = { top: 16, right: 18 },
  onToggle,
  onFavoriteToggle,
}) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle();
    }
  };

  const handleFavoriteClick = (event) => {
    event.stopPropagation();
    onFavoriteToggle?.();
  };

  return (
    <CardShell $color={color}>
      <Card
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        aria-label={`${title} 추천 정보 보기`}
        $isFlipped={isFlipped}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
      >
        <Face $side="front">
          <Favorite
            type="button"
            aria-label={isFavorite ? '찜 해제' : '찜하기'}
            aria-pressed={isFavorite}
            $color={color}
            $isFavorite={isFavorite}
            $size={favoriteSize}
            $top={favoriteOffset.top}
            $right={favoriteOffset.right}
            onClick={handleFavoriteClick}
          >
            <StarIcon filled={isFavorite} />
          </Favorite>
          <Image src={imageSrc} alt={title} draggable="false" />
        </Face>

        <Face $side="back">
          <BackContent>
            <BackTitle>{title}</BackTitle>
            <DetailList>
              {detailRows.map(([label, key]) => (
                <DetailRow key={key}>
                  <DetailLabel>{label}</DetailLabel>
                  <DetailValue>{details?.[key] ?? '-'}</DetailValue>
                </DetailRow>
              ))}
            </DetailList>
            <Reason>{details?.reason}</Reason>
          </BackContent>
        </Face>
      </Card>
    </CardShell>
  );
}

function StarIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 2.4L14.9 8.4L21.5 9.3L16.7 13.9L17.9 20.4L12 17.2L6.1 20.4L7.3 13.9L2.5 9.3L9.1 8.4L12 2.4Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
    </svg>
  );
}

const CardShell = styled.article`
  width: min(346px, 100%);
  aspect-ratio: 346 / 442;
  border-radius: 10px;
  perspective: 1200px;
  filter: drop-shadow(2px 2px 8px ${({ $color }) => `${$color}33`});
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  cursor: pointer;
  transform-style: preserve-3d;
  transform: ${({ $isFlipped }) =>
    $isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
  transition: transform 360ms ease;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.seasons.winter.primary};
    outline-offset: 4px;
  }
`;

const Face = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
  background: #ffffff;
  overflow: hidden;
  backface-visibility: hidden;
  transform: ${({ $side }) =>
    $side === 'back' ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;

const Favorite = styled.button`
  position: absolute;
  top: ${({ $top }) => $top}px;
  right: ${({ $right }) => $right}px;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ $color }) => $color};
  font-size: 0;
  cursor: pointer;
  opacity: ${({ $isFavorite }) => ($isFavorite ? 1 : 0.82)};

  svg {
    width: ${({ $size }) => $size}px;
    height: ${({ $size }) => $size}px;
    display: block;
  }
`;

const Image = styled.img`
  width: 82%;
  height: 82%;
  object-fit: contain;
`;

const BackContent = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  align-content: center;
  gap: 14px;
  padding: 28px;
`;

const BackTitle = styled.h3`
  margin: 0;
  color: #111827;
  font-size: 22px;
  line-height: 1.3;
`;

const DetailList = styled.dl`
  display: grid;
  gap: 9px;
  margin: 0;
`;

const DetailRow = styled.div`
  display: grid;
  grid-template-columns: 62px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
`;

const DetailLabel = styled.dt`
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
`;

const DetailValue = styled.dd`
  margin: 0;
  color: #111827;
  font-size: 14px;
  line-height: 1.35;
  word-break: keep-all;
`;

const Reason = styled.p`
  margin: 0;
  padding-top: 4px;
  color: #4b5563;
  font-size: 14px;
  line-height: 1.45;
  word-break: keep-all;
`;

export default OutfitCard;
