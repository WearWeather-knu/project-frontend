import styled from 'styled-components';

function MobileFrame({ children }) {
  return (
    <Viewport>
      <Frame>{children}</Frame>
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
`;

const Frame = styled.div`
  width: 100%;
  max-width: 390px;
  height: min(844px, 100dvh);
  display: flex;
  flex-direction: column;
  background: #ffffff;
  overflow: hidden;
`;

export default MobileFrame;
