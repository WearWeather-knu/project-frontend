import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import OutfitCard from './OutfitCard';
import PaginationDots from '@/components/common/PaginationDots';
import { useLikedOutfits } from '@/store/likedOutfitsStore';

const CARD_GAP = 32;
const CLICK_DRAG_THRESHOLD = 5;
const MIN_SWIPE_DISTANCE = 40;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function OutfitCarousel({ items, seasonTheme }) {
  const viewportRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const [slideSizePx, setSlideSizePx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [flippedCardIds, setFlippedCardIds] = useState([]);
  const { isLiked, toggleLikedOutfit } = useLikedOutfits();
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const isHorizontalDrag = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const gestureStartIndex = useRef(0);

  const getSlideSize = () => {
    const viewportWidth = viewportRef.current?.clientWidth ?? 1;

    return viewportWidth + CARD_GAP;
  };

  useEffect(() => {
    const updateSlideSize = () => {
      setSlideSizePx(getSlideSize());
    };

    updateSlideSize();
    window.addEventListener('resize', updateSlideSize);

    return () => {
      window.removeEventListener('resize', updateSlideSize);
    };
  }, []);

  const moveToIndex = (index) => {
    const safeIndex = clamp(index, 0, items.length - 1);

    setIsAnimating(true);
    setDragOffsetPx(0);
    setCurrentIndex(safeIndex);
  };

  const startDrag = (clientX, clientY = 0) => {
    isDragging.current = true;
    hasDragged.current = false;
    isHorizontalDrag.current = false;
    startX.current = clientX;
    startY.current = clientY;
    gestureStartIndex.current = currentIndex;
    setIsAnimating(false);
    setDragOffsetPx(0);
  };

  const moveDrag = (clientX, clientY = 0) => {
    if (!isDragging.current) return;

    const distX = clientX - startX.current;
    const distY = clientY - startY.current;

    if (
      !isHorizontalDrag.current &&
      Math.abs(distX) > CLICK_DRAG_THRESHOLD &&
      Math.abs(distX) > Math.abs(distY)
    ) {
      isHorizontalDrag.current = true;
    }

    if (!isHorizontalDrag.current) return;

    hasDragged.current = true;
    setDragOffsetPx(distX);
  };

  const endDrag = (clientX) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const slideSize = getSlideSize();
    const dist = typeof clientX === 'number' ? clientX - startX.current : 0;
    const threshold = Math.min(MIN_SWIPE_DISTANCE, slideSize * 0.15);
    let targetIndex = gestureStartIndex.current;

    if (Math.abs(dist) >= threshold) {
      targetIndex += dist < 0 ? 1 : -1;
    }

    targetIndex = clamp(targetIndex, 0, items.length - 1);
    moveToIndex(targetIndex);
  };

  const cancelDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    moveToIndex(gestureStartIndex.current);
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;

    startDrag(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    moveDrag(e.clientX, e.clientY);
  };

  const handleMouseUp = (e) => {
    endDrag(e.clientX);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;

    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length !== 1) return;

    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);

    if (isHorizontalDrag.current) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];

    endDrag(touch?.clientX);
  };

  const handleViewportRef = useCallback((node) => {
    viewportRef.current = node;

    if (!node) return;

    setSlideSizePx(node.clientWidth + CARD_GAP);
  }, []);

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
      <Viewport ref={handleViewportRef}>
        <Track
          $index={currentIndex}
          $slideSizePx={slideSizePx}
          $dragOffsetPx={dragOffsetPx}
          $animating={isAnimating}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={cancelDrag}
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
  overflow: hidden;
`;

const Track = styled.div`
  display: flex;
  gap: ${CARD_GAP}px;
  padding: 12px 20px;
  cursor: grab;
  touch-action: pan-y;
  transform: translate3d(
    ${({ $index, $slideSizePx, $dragOffsetPx }) =>
      $dragOffsetPx - $index * $slideSizePx}px,
    0,
    0
  );
  transition: ${({ $animating }) =>
    $animating ? 'transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'};
  will-change: transform;

  &:active {
    cursor: grabbing;
  }

  user-select: none;
`;

const Slide = styled.div`
  flex: 0 0 100%;
  display: flex;
  justify-content: center;
`;

export default OutfitCarousel;
