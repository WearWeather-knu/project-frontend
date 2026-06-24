import { useEffect, useState } from 'react';
import styled from 'styled-components';

const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

function MobileFrame({ children }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const nextScale = Math.min(
        window.innerWidth / BASE_WIDTH,
        window.innerHeight / BASE_HEIGHT,
        1,
      );

      setScale(Number.isFinite(nextScale) ? nextScale : 1);
    };

    updateScale();
    window.addEventListener('resize', updateScale);

    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <Viewport>
      <FrameShell
        $scale={scale}
        $width={BASE_WIDTH}
        $height={BASE_HEIGHT}
      >
        <Frame $scale={scale}>{children}</Frame>
      </FrameShell>
    </Viewport>
  );
}

const Viewport = styled.div`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f5f7;
  overflow: hidden;
`;

const FrameShell = styled.div`
  position: relative;
  width: ${({ $width, $scale }) => `${$width * $scale}px`};
  height: ${({ $height, $scale }) => `${$height * $scale}px`};
  flex: 0 0 auto;
`;

const Frame = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 390px;
  height: 844px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  transform: ${({ $scale }) => `scale(${$scale})`};
  transform-origin: top left;
  overflow: hidden;
`;

export default MobileFrame;
