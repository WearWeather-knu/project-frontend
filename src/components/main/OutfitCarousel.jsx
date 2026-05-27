import { useRef, useState } from 'react';
import styled from 'styled-components';
import OutfitCard from './OutfitCard';
import PaginationDots from '@/components/common/PaginationDots';

const CARD_GAP = 32;

function OutfitCarousel({ items, seasonTheme }) {
  const trackRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const snapTimer = useRef(null);

  const snapToIndex = (track, index) => {
    const slideWidth = track.querySelector('[data-slide]')?.clientWidth ?? 1;
    track.scrollTo({
      left: index * (slideWidth + CARD_GAP),
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;

    const slideWidth = track.querySelector('[data-slide]')?.clientWidth ?? 1;
    const nextIndex = Math.round(track.scrollLeft / (slideWidth + CARD_GAP));
    setCurrentIndex(nextIndex);

    // 마우스 드래그 중이 아닐 때(쉬프트 드래그 등) 스크롤 멈추면 스냅
    if (!isDragging.current) {
      clearTimeout(snapTimer.current);
      snapTimer.current = setTimeout(() => {
        snapToIndex(track, nextIndex);
      }, 150);
    }
  };

  const handleMouseDown = (e) => {
    clearTimeout(snapTimer.current);
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX;
    scrollStart.current = trackRef.current.scrollLeft;
    trackRef.current.style.scrollBehavior = 'auto';
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const dist = e.pageX - startX.current;
    if (Math.abs(dist) > 5) hasDragged.current = true;
    trackRef.current.scrollLeft = scrollStart.current - dist;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const track = trackRef.current;
    const slideWidth = track.querySelector('[data-slide]')?.clientWidth ?? 1;
    const targetIndex = Math.round(track.scrollLeft / (slideWidth + CARD_GAP));

    track.style.scrollBehavior = '';
    snapToIndex(track, targetIndex);
  };

  const handleClick = (e) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <Container>
      <Viewport>
        <Track
          ref={trackRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClickCapture={handleClick}
          onDragStart={(e) => e.preventDefault()}
        >
          {items.map((item) => (
            <Slide key={item.id} data-slide>
              <OutfitCard
                imageSrc={item.imageSrc}
                title={item.title}
                color={seasonTheme.primary}
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
