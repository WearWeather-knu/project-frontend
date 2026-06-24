import { useEffect, useRef, useState } from 'react';
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
  const [isSuppressingCardClick, setIsSuppressingCardClick] = useState(false);
  const [flippedCardIds, setFlippedCardIds] = useState([]);
  const { isLiked, toggleLikedOutfit } = useLikedOutfits();
  const hasDragged = useRef(false);
  const isMouseDown = useRef(false);
  const gestureStartX = useRef(0);
  const gestureStartY = useRef(0);
  const scrollSettleTimer = useRef(null);

  const getSlideSize = () => {
    const slideWidth =
      trackRef.current
        ?.querySelector('[data-slide]')
        ?.getBoundingClientRect().width ?? 1;

    return slideWidth + CARD_GAP;
  };

  const startGesture = (clientX, clientY) => {
    gestureStartX.current = clientX;
    gestureStartY.current = clientY;
    hasDragged.current = false;
  };

  const moveGesture = (clientX, clientY) => {
    const distX = clientX - gestureStartX.current;
    const distY = clientY - gestureStartY.current;

    if (Math.hypot(distX, distY) > CLICK_DRAG_THRESHOLD) {
      hasDragged.current = true;
      setIsSuppressingCardClick(true);
    }
  };

  const handleMouseDown = (event) => {
    if (event.button !== 0) return;

    isMouseDown.current = true;
    startGesture(event.clientX, event.clientY);
  };

  const handleMouseMove = (event) => {
    if (!isMouseDown.current) return;

    moveGesture(event.clientX, event.clientY);
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
  };

  const handleTouchStart = (event) => {
    if (event.touches.length !== 1) return;

    const touch = event.touches[0];
    startGesture(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (event) => {
    if (event.touches.length !== 1) return;

    const touch = event.touches[0];
    moveGesture(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    if (hasDragged.current) {
      hasDragged.current = false;
      setIsSuppressingCardClick(false);
    }
  };

  const syncIndex = () => {
    const track = trackRef.current;
    if (!track) return;
    const slideSize = getSlideSize();
    setCurrentIndex(
      clamp(Math.round(track.scrollLeft / slideSize), 0, items.length - 1),
    );
  };

  const handleScroll = () => {
    syncIndex();
    clearTimeout(scrollSettleTimer.current);
    scrollSettleTimer.current = setTimeout(syncIndex, 150);
  };

  const handleClick = (e) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();

      window.setTimeout(() => {
        hasDragged.current = false;
        setIsSuppressingCardClick(false);
      }, 0);
    }
  };

  useEffect(() => () => clearTimeout(scrollSettleTimer.current), []);

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
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
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
                disableToggle={isSuppressingCardClick}
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
`;

export default OutfitCarousel;
