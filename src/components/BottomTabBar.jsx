import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const tabs = [
  { to: '/', label: '홈', end: true },
  { to: '/closet', label: '옷장' },
  { to: '/profile', label: '프로필' },
];

function BottomTabBar() {
  return (
    <Container>
      {tabs.map((tab) => (
        <TabLink key={tab.to} to={tab.to} end={tab.end}>
          {tab.label}
        </TabLink>
      ))}
    </Container>
  );
}

const Container = styled.nav`
  height: calc(
    ${({ theme }) => theme.heights.bottomNav} + env(safe-area-inset-bottom)
  );
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  padding: 0 8px;
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1px solid #eef0f3;
  background: #ffffff;
`;

const TabLink = styled(NavLink)`
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #8a93a3;
  font-size: 13px;
  font-weight: 600;

  &.active {
    color: #111827;
    background: #f2f4f7;
  }
`;

export default BottomTabBar;
