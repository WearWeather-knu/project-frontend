import { useRef, useState } from 'react';
import styled from 'styled-components';
import OutfitCard from './OutfitCard';
import PaginationDots from '@/components/common/PaginationDots';

const CARD_GAP = 32;

function OutfitCarousel({ items, seasonTheme }) {
  const trackRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = () => {
    const track = trackRef.current;

    if (!track) return;

    const slideWidth = track.querySelector('[data-slide]')?.clientWidth ?? 1;
    const nextIndex = Math.round(track.scrollLeft / (slideWidth + CARD_GAP));
    setCurrentIndex(nextIndex);
  };

  return (
    <Container>
      <Viewport>
        <Track ref={trackRef} onScroll={handleScroll}>
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
  gap: 16px;
  margin: 0 -20px;
`;

const Viewport = styled.div`
  overflow: visible;
`;

const Track = styled.div`
  display: flex;
  gap: ${CARD_GAP}px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 12px 20px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Slide = styled.div`
  flex: 0 0 100%;
  display: flex;
  justify-content: center;
  scroll-snap-align: center;
`;

export default OutfitCarousel;
