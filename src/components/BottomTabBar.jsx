import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const tabs = [
  { to: '/closet', label: '옷장', logo: <ClosetLogo /> },
  { to: '/', label: '홈', end: true, logo: <MainLogo /> },
  { to: '/profile', label: '프로필', logo: <ProfileLogo /> },
];

function BottomTabBar() {
  return (
    <Container>
      {tabs.map((tab) => (
        <TabLink key={tab.to} to={tab.to} end={tab.end} $isHome={tab.label === '홈'}>
          {({ isActive }) =>
            tab.label === '홈' ? (
              <LogoWrapper>
                <MainLogo isActive={isActive} />
              </LogoWrapper>
            ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {tab.logo}
              {tab.label}
            </div>
          )
          }
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
  justify-items: center;
  padding: 0 8px;
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1px solid #eef0f3;
  background: #ffffff;
`;

const TabLink = styled(NavLink)`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #8a93a3;
  font-size: 13px;
  font-weight: 600;

  &.active {
    color: #111827;
    background: ${({ $isHome }) => $isHome ? 'transparent' : '#f2f4f7'};
  }
`;

const LogoWrapper = styled.div`
  transform: translateY(-15px);
`;

export default BottomTabBar;

function MainLogo({ isActive }) {
  return (
    <svg
      width="85"
      height="85"
      viewBox="0 0 85 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_85_518)">
        <circle cx="38.5" cy="38.5" r="35.5" fill="#31326F" />
      </g>
      <path
        d="M56.2251 35.425L59.9001 51.25L46.0001 42.85L32.1001 51.25L35.7501 35.425L23.5001 24.75L39.6751 23.4L46.0001 8.5L52.3251 23.4L68.5001 24.75L56.2251 35.425ZM16.0001 37.075C16.4751 37.075 16.9501 36.925 17.3751 36.65L25.3751 31.375L21.4501 27.975L14.6251 32.475C13.4726 33.225 13.1526 34.75 13.9001 36C14.4001 36.675 15.2001 37.075 16.0001 37.075ZM13.9001 59.875C14.4001 60.6 15.2001 61 16.0001 61C16.4751 61 16.9501 60.875 17.3751 60.6L27.6501 53.825L28.5001 50.4L29.2751 46.775L14.6251 56.4C13.4726 57.175 13.1526 58.725 13.9001 59.875ZM14.6251 44.45C14.073 44.8126 13.6868 45.379 13.551 46.0255C13.4152 46.6719 13.5407 47.3458 13.9001 47.9C14.4001 48.65 15.2001 49.025 16.0001 49.025C16.4751 49.025 16.9501 48.9 17.3751 48.625L30.9251 39.75L31.6001 36.775L29.3001 34.75L14.6251 44.45Z"
        fill={isActive ? '#FFEE00' : 'white'}
      />
      <defs>
        <filter
          id="filter0_d_85_518"
          x="0"
          y="0"
          width="85"
          height="85"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="2" dy="2" />
          <feGaussianBlur stdDeviation="2.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_85_518"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_85_518"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}

function ClosetLogo() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.6666 17.5852V16.4552C23.097 16.0844 24.3638 15.2495 25.2687 14.0813C26.1735 12.9132 26.6652 11.4778 26.6666 10.0002C26.6666 6.3235 23.6766 3.3335 20 3.3335C16.3233 3.3335 13.3333 6.3235 13.3333 10.0002H16.6666C16.6666 8.16183 18.1616 6.66683 20 6.66683C21.8383 6.66683 23.3333 8.16183 23.3333 10.0002C23.3333 11.8385 21.8383 13.3335 20 13.3335C19.5579 13.3335 19.134 13.5091 18.8214 13.8217C18.5089 14.1342 18.3333 14.5581 18.3333 15.0002V17.5852L3.89162 30.4218C3.64009 30.6469 3.46273 30.9429 3.38296 31.2709C3.30319 31.5988 3.32476 31.9432 3.44483 32.2587C3.5649 32.5741 3.77782 32.8457 4.05547 33.0376C4.33312 33.2295 4.66244 33.3327 4.99995 33.3335H35C35.3377 33.3327 35.6672 33.2294 35.945 33.0373C36.2228 32.8452 36.4357 32.5733 36.5557 32.2576C36.6756 31.9419 36.6969 31.5972 36.6167 31.2691C36.5365 30.941 36.3587 30.645 36.1066 30.4202L21.6666 17.5852ZM9.38329 30.0002L20 20.5635L30.6166 30.0002H9.38329Z"
        fill="#31326F"
      />
    </svg>
  );
}

function ProfileLogo() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28.3333 14.9998C28.3333 12.6982 27.4 10.6148 25.8933 9.10817C24.385 7.59984 22.3017 6.6665 20 6.6665C17.6983 6.6665 15.615 7.59984 14.1067 9.10817C12.6 10.6148 11.6667 12.6982 11.6667 14.9998C11.6667 17.3015 12.6 19.3848 14.1067 20.8915C15.615 22.3998 17.6983 23.3332 20 23.3332C22.3017 23.3332 24.385 22.3998 25.8933 20.8915C26.6684 20.1188 27.283 19.2005 27.7017 18.1894C28.1205 17.1782 28.3351 16.0943 28.3333 14.9998ZM10 31.6665C10 33.3332 13.75 34.9998 20 34.9998C25.8633 34.9998 30 33.3332 30 31.6665C30 28.3332 26.0767 24.9998 20 24.9998C13.75 24.9998 10 28.3332 10 31.6665Z"
        fill="#31326F"
      />
    </svg>
  );
}
