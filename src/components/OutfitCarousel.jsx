import { useRef, useState } from 'react';
import styled from 'styled-components';
import OutfitCard from './OutfitCard';
import PaginationDots from './PaginationDots';

function OutfitCarousel({ items, seasonTheme }) {
  const trackRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = () => {
    const track = trackRef.current;

    if (!track) return;

    const nextIndex = Math.round(track.scrollLeft / track.clientWidth);
    setCurrentIndex(nextIndex);
  };

  return (
    <Container>
      <Track ref={trackRef} onScroll={handleScroll}>
        {items.map((item) => (
          <Slide key={item.id}>
            <OutfitCard
              imageSrc={item.imageSrc}
              title={item.title}
              color={seasonTheme.primary}
            />
          </Slide>
        ))}
      </Track>
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
`;

const Track = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 12px 0;
  margin: -12px 0;
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
