import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';
import BottomTabBar from './BottomTabBar';

function AppLayout() {
  return (
    <Container>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <BottomTabBar />
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  min-height: 0;
  height: 100%;
  display: grid;
  grid-template-rows:
    calc(${({ theme }) => theme.heights.header} + env(safe-area-inset-top))
    minmax(0, 1fr)
    calc(${({ theme }) => theme.heights.bottomNav} + env(safe-area-inset-bottom));
  background: #ffffff;
  overflow: hidden;
`;

const Main = styled.main`
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 20px 20px 24px;
`;

export default AppLayout;
