import { useRef, useState } from 'react';
import styled from 'styled-components';
import OutfitCard from './OutfitCard';
import PaginationDots from '@/components/common/PaginationDots';
import { useLikedOutfits } from '@/store/likedOutfitsStore';

const CARD_GAP = 32;
const CLICK_DRAG_THRESHOLD = 5;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function OutfitCarousel({ items, seasonTheme }) {
  const trackRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedCardIds, setFlippedCardIds] = useState([]);
  const { isLiked, toggleLikedOutfit } = useLikedOutfits();
  const hasDragged = useRef(false);
  const scrollStart = useRef(0);
  const settleTimer = useRef(null);

  const getSlideSize = () => {
    const slideWidth =
      trackRef.current
        ?.querySelector('[data-slide]')
        ?.getBoundingClientRect().width ?? 1;

    return slideWidth + CARD_GAP;
  };

  const scrollToIndex = (index) => {
    const track = trackRef.current;
    if (!track) return;

    const safeIndex = clamp(index, 0, items.length - 1);
    const slideSize = getSlideSize();

    setCurrentIndex(safeIndex);
    track.scrollTo({
      left: safeIndex * slideSize,
      behavior: 'smooth',
    });
  };

  const handlePointerDown = () => {
    const track = trackRef.current;
    if (!track) return;

    scrollStart.current = track.scrollLeft;
    hasDragged.current = false;
  };

  const settleToNearestSlide = () => {
    const track = trackRef.current;
    if (!track) return;

    const slideSize = getSlideSize();
    const nextIndex = clamp(
      Math.round(track.scrollLeft / slideSize),
      0,
      items.length - 1,
    );

    setCurrentIndex(nextIndex);
    scrollToIndex(nextIndex);
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;

    if (Math.abs(track.scrollLeft - scrollStart.current) > CLICK_DRAG_THRESHOLD) {
      hasDragged.current = true;
    }

    const slideSize = getSlideSize();
    const nextIndex = clamp(
      Math.round(track.scrollLeft / slideSize),
      0,
      items.length - 1,
    );
    setCurrentIndex(nextIndex);

    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(settleToNearestSlide, 120);
  };

  const handleClick = (e) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const toggleCard = (id) => {
    setFlippedCardIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id],
    );
  };

  return (
    <Container>
      <Viewport>
        <Track
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onTouchStart={handlePointerDown}
          onScroll={handleScroll}
          onClickCapture={handleClick}
          onDragStart={(e) => e.preventDefault()}
        >
          {items.map((item, index) => (
            <Slide key={item.id} data-slide>
              <OutfitCard
                imageSrc={item.imageSrc}
                title={item.title}
                details={item.details}
                color={seasonTheme.primary}
                isFlipped={flippedCardIds.includes(item.id)}
                isFavorite={isLiked(item.id)}
                recommendationNumber={index + 1}
                onToggle={() => toggleCard(item.id)}
                onFavoriteToggle={() =>
                  toggleLikedOutfit({
                    ...item,
                    color: seasonTheme.primary,
                  })
                }
              />
            </Slide>
          ))}
        </Track>
      </Viewport>
      <PaginationDots
        total={items.length}
        current={currentIndex}
        color={seasonTheme.primary}
      />
    </Container>
  );
}

const Container = styled.section`
  display: grid;
  gap: 4px;
  margin: 0 -20px;
`;

const Viewport = styled.div`
  overflow: visible;
`;

const Track = styled.div`
  display: flex;
  gap: ${CARD_GAP}px;
  overflow-x: auto;
  padding: 12px 20px;
  scrollbar-width: none;
  cursor: grab;
  scroll-snap-type: x mandatory;
  scroll-padding: 0 20px;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;

  &:active {
    cursor: grabbing;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  user-select: none;
`;

const Slide = styled.div`
  flex: 0 0 100%;
  display: flex;
  justify-content: center;
  scroll-snap-align: start;
  scroll-snap-stop: always;
`;

export default OutfitCarousel;
