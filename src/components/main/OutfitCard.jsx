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
  recommendationNumber,
  compact = false,
  disableToggle = false,
  onToggle,
  onFavoriteToggle,
}) {
  const handleToggle = () => {
    if (disableToggle) return;

    onToggle();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
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
        $color={color}
        onClick={handleToggle}
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
          <BackContent $compact={compact}>
            {!compact && (
              <BackTitle $color={color}>No.{recommendationNumber}</BackTitle>
            )}
            <DetailList>
              {detailRows.map(([label, key]) => (
                <DetailRow key={key} $compact={compact}>
                  <DetailLabel $compact={compact}>{label}</DetailLabel>
                  <DetailValue $compact={compact}>
                    {details?.[key] ?? '-'}
                  </DetailValue>
                </DetailRow>
              ))}
            </DetailList>
            <ReasonBox $color={color} $compact={compact}>
              {!compact && <ReasonLabel>추천 이유</ReasonLabel>}
              <Reason $compact={compact}>{details?.reason ?? '-'}</Reason>
            </ReasonBox>
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
    outline: 3px solid ${({ $color }) => $color};
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
  align-content: start;
  gap: ${({ $compact }) => ($compact ? '10px' : '20px')};
  padding: ${({ $compact }) =>
    $compact ? '32px 20px 16px' : '74px 44px 42px'};
  container-type: inline-size;
`;

const BackTitle = styled.h3`
  margin: 0;
  color: ${({ $color }) => $color};
  font-size: ${({ $compact }) =>
    $compact ? '20px' : '28px'};
  line-height: 1.1;
  font-weight: 800;
`;

const DetailList = styled.dl`
  display: grid;
  gap: ${({ $compact }) => ($compact ? '4px' : '12px')};
  margin: 0;
`;

const DetailRow = styled.div`
  display: grid;
  grid-template-columns: ${({ $compact }) =>
    $compact ? '38px minmax(0, 1fr)' : '58px minmax(0, 1fr)'};
  gap: ${({ $compact }) => ($compact ? '8px' : '38px')};
  align-items: start;
`;

const DetailLabel = styled.dt`
  color: #111827;
  font-size: ${({ $compact }) => ($compact ? '10px' : '13px')};
  font-weight: 500;
`;

const DetailValue = styled.dd`
  margin: 0;
  color: #111827;
  font-size: ${({ $compact }) => ($compact ? '10px' : '13px')};
  line-height: 1.35;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

const ReasonBox = styled.div`
  align-self: end;
  display: grid;
  gap: 18px;
  margin-top: ${({ $compact }) => ($compact ? '2px' : '22px')};
  padding: ${({ $compact }) => ($compact ? '10px 8px' : '18px 18px 24px')};
  border-radius: 8px;
  background: ${({ $color }) => `${$color}24`};
  text-align: center;
`;

const ReasonLabel = styled.span`
  color: #43474f;
  font-size: 10px;
  line-height: 1;
`;

const Reason = styled.p`
  margin: 0;
  color: #111827;
  font-size: ${({ $compact }) => ($compact ? '8px' : '12px')};
  line-height: 1.45;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

export default OutfitCard;
