import { useRef, useState } from 'react';
import styled from 'styled-components';
import OutfitCard from './OutfitCard';
import PaginationDots from '@/components/common/PaginationDots';
import { useLikedOutfits } from '@/store/likedOutfitsStore';

const CARD_GAP = 32;
const CLICK_DRAG_THRESHOLD = 5;
const MIN_SWIPE_DISTANCE = 40;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function OutfitCarousel({ items, seasonTheme }) {
  const trackRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedCardIds, setFlippedCardIds] = useState([]);
  const { isLiked, toggleLikedOutfit } = useLikedOutfits();
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const gestureStartIndex = useRef(0);
  const snapTimer = useRef(null);

  const getSlideSize = (track) => {
    const slideWidth = track.querySelector('[data-slide]')?.clientWidth ?? 1;

    return slideWidth + CARD_GAP;
  };

  const snapToIndex = (track, index) => {
    const slideSize = getSlideSize(track);
    const safeIndex = clamp(index, 0, items.length - 1);

    setCurrentIndex(safeIndex);
    track.scrollTo({
      left: safeIndex * slideSize,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;

    const slideSize = getSlideSize(track);
    const nextIndex = clamp(
      Math.round(track.scrollLeft / slideSize),
      0,
      items.length - 1,
    );
    setCurrentIndex(nextIndex);

    if (!isDragging.current) {
      clearTimeout(snapTimer.current);
      snapTimer.current = setTimeout(() => {
        snapToIndex(track, nextIndex);
      }, 150);
    }
  };

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;

    const track = trackRef.current;
    if (!track) return;

    clearTimeout(snapTimer.current);
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.clientX;
    scrollStart.current = track.scrollLeft;
    gestureStartIndex.current = currentIndex;
    track.style.scrollBehavior = 'auto';
    track.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;

    const track = trackRef.current;
    if (!track) return;

    const dist = e.clientX - startX.current;
    if (Math.abs(dist) > CLICK_DRAG_THRESHOLD) hasDragged.current = true;
    track.scrollLeft = scrollStart.current - dist;
  };

  const handlePointerUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const track = trackRef.current;
    if (!track) return;

    const slideSize = getSlideSize(track);
    const dist =
      typeof e.clientX === 'number' ? e.clientX - startX.current : 0;
    const threshold = Math.min(MIN_SWIPE_DISTANCE, slideSize * 0.15);
    let targetIndex = gestureStartIndex.current;

    if (Math.abs(dist) >= threshold) {
      targetIndex += dist < 0 ? 1 : -1;
    }

    targetIndex = clamp(targetIndex, 0, items.length - 1);

    track.style.scrollBehavior = '';
    track.releasePointerCapture?.(e.pointerId);
    snapToIndex(track, targetIndex);
  };

  const handlePointerCancel = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const track = trackRef.current;
    if (!track) return;

    track.style.scrollBehavior = '';
    track.releasePointerCapture?.(e.pointerId);
    snapToIndex(track, gestureStartIndex.current);
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
          onScroll={handleScroll}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
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
  touch-action: pan-y;

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
`;

export default OutfitCarousel;
