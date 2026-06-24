import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { supabase } from '@/api/auth/supabaseClient';
import { clearDevSession, useAuthStore } from '@/store/authStore';
import { useSeasonTheme } from '@/store/seasonThemeStore';

const profileTags = ['#스트릿패션', '#편한옷선호', '#더위취약', '#햇빛알러지'];
const menuItems = [
  { label: '내 옷장 관리', path: '/closet' },
  { label: '스타일 취향 설정', path: '/style-preferences' },
  { label: 'OOTD 캘린더', path: '/ootd-calendar' },
  { label: '선호 OOTD', path: '/history' },
];

const seasonLabels = {
  spring: '봄',
  summer: '여름',
  autumn: '가을',
  winter: '겨울',
};

const seasonOptions = ['spring', 'summer', 'autumn', 'winter'];

function ProfilePage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { session, setSession } = useAuthStore();
  const email = session?.user?.email ?? 'weather@example.com';
  const displayName = email.split('@')[0] || '사용자';
  const { season, seasonTheme, setSeason } = useSeasonTheme();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const handleSeasonSelect = (nextSeason) => {
    setSeason(nextSeason);
    setIsThemeMenuOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearDevSession();
    setSession(null);
    navigate('/login', { replace: true });
  };

  return (
    <Page $background={seasonTheme.background}>
      <ProfileCard $shadowColor={seasonTheme.primary}>
        <ThemeSelectButton
          type="button"
          aria-label="시즌 테마 선택"
          aria-haspopup="listbox"
          aria-expanded={isThemeMenuOpen}
          $primary={seasonTheme.primary}
          onClick={() => setIsThemeMenuOpen((currentValue) => !currentValue)}
        >
          <ThemeSwatch $color={seasonTheme.primary} />
          <ThemeButtonText>{seasonLabels[season]}</ThemeButtonText>
        </ThemeSelectButton>

        {isThemeMenuOpen && (
          <ThemeMenu role="listbox" aria-label="시즌 테마">
            {seasonOptions.map((seasonOption) => {
              const optionTheme = theme.colors.seasons[seasonOption];
              const isActive = season === seasonOption;

              return (
                <ThemeMenuItem
                  key={seasonOption}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  $active={isActive}
                  $primary={optionTheme.primary}
                  onClick={() => handleSeasonSelect(seasonOption)}
                >
                  <ThemeSwatch $color={optionTheme.primary} />
                  <span>{seasonLabels[seasonOption]}</span>
                </ThemeMenuItem>
              );
            })}
          </ThemeMenu>
        )}

        <AvatarArea>
          <Avatar aria-hidden="true" $primary={seasonTheme.primary}>
            <AvatarHead />
            <AvatarBody />
          </Avatar>
          <CameraButton
            type="button"
            aria-label="프로필 사진 변경"
            $primary={seasonTheme.primary}
          >
            <CameraIcon />
          </CameraButton>
        </AvatarArea>

        <ProfileDetails>
          <UserLabel>사용자</UserLabel>
          <UserLine>
            <UserName>{displayName}</UserName>
            <UserEmail>{email}</UserEmail>
          </UserLine>
          <TagList>
            {profileTags.map((tag, index) => (
              <ProfileTag
                key={tag}
                $active={index < 2}
                $primary={seasonTheme.primary}
              >
                {tag}
              </ProfileTag>
            ))}
          </TagList>
        </ProfileDetails>
      </ProfileCard>

      <MenuCard $shadowColor={seasonTheme.primary}>
        {menuItems.map((item) => (
          <MenuButton
            key={item.path}
            type="button"
            onClick={() => navigate(item.path)}
          >
            <MenuIconCircle aria-hidden="true" $primary={seasonTheme.primary}>
              <HangerIcon />
            </MenuIconCircle>
            <MenuText>{item.label}</MenuText>
            <Chevron aria-hidden="true" $primary={seasonTheme.primary}>
              ›
            </Chevron>
          </MenuButton>
        ))}
      </MenuCard>

      <AccountCard $shadowColor={seasonTheme.primary}>
        <AccountButton type="button" onClick={handleLogout}>
          로그아웃
        </AccountButton>
        <DangerButton type="button">계정탈퇴</DangerButton>
      </AccountCard>
    </Page>
  );
}

function CameraIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.2 5.8L7.4 4.2H11.6L12.8 5.8H15.4C16.1 5.8 16.7 6.4 16.7 7.1V14.5C16.7 15.2 16.1 15.8 15.4 15.8H3.6C2.9 15.8 2.3 15.2 2.3 14.5V7.1C2.3 6.4 2.9 5.8 3.6 5.8H6.2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="10.7" r="2.7" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function HangerIcon() {
  return (
    <svg
      width="33"
      height="33"
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.8 14.5V13.5C19.1 13.1 20 11.9 20 10.5C20 8.6 18.4 7 16.5 7C14.6 7 13 8.6 13 10.5H15.3C15.3 9.9 15.8 9.4 16.5 9.4C17.2 9.4 17.7 9.9 17.7 10.6C17.7 11.2 17.2 11.8 16.5 11.8C15.9 11.8 15.5 12.2 15.5 12.8V14.5L6.3 22.7C6 22.9 5.9 23.3 6.1 23.6C6.2 24 6.6 24.2 7 24.2H26C26.4 24.2 26.8 24 26.9 23.6C27.1 23.3 27 22.9 26.7 22.7L17.8 14.5ZM10.2 22L16.5 16.4L22.8 22H10.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

const Page = styled.section`
  height: calc(100% + 44px);
  display: grid;
  grid-template-rows: auto auto auto;
  align-content: start;
  gap: clamp(20px, 5vw, 28px);
  margin: -20px -20px -24px;
  padding: 43px 28px 56px;
  background: ${({ $background }) => $background};
`;

const ProfileCard = styled.section`
  position: relative;
  min-height: 154px;
  display: grid;
  grid-template-columns: 102px minmax(0, 1fr);
  align-items: center;
  gap: 16px;
  padding: 20px 28px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 8px 22px ${({ $shadowColor }) => `${$shadowColor}29`};
`;

const ThemeSelectButton = styled.button`
  position: absolute;
  top: 20px;
  right: 30px;
  min-width: 58px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 9px;
  border: 1px solid ${({ $primary }) => `${$primary}4D`};
  border-radius: 999px;
  background: #ffffff;
  color: ${({ $primary }) => $primary};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  --press-scale: 1;
  --press-active-filter: brightness(0.98);
  z-index: 2;
`;

const ThemeButtonText = styled.span`
  line-height: 1;
`;

const ThemeSwatch = styled.span`
  width: 10px;
  height: 10px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.82);
`;

const ThemeMenu = styled.div`
  position: absolute;
  top: 54px;
  right: 30px;
  width: 96px;
  z-index: 4;
  display: grid;
  gap: 4px;
  padding: 7px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(17, 24, 39, 0.16);
`;

const ThemeMenuItem = styled.button`
  height: 31px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 8px;
  border: 1px solid
    ${({ $active, $primary }) => ($active ? $primary : 'transparent')};
  border-radius: 8px;
  background: ${({ $active, $primary }) =>
    $active ? `${$primary}18` : '#ffffff'};
  color: ${({ $active, $primary }) => ($active ? $primary : '#4b5563')};
  font-size: 12px;
  font-weight: 700;
  text-align: left;
`;

const AvatarArea = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;

const Avatar = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  overflow: hidden;
  border: 3px solid ${({ $primary }) => $primary};
  border-radius: 50%;
  background: #d9d9d9;
`;

const AvatarHead = styled.div`
  position: absolute;
  top: 22px;
  left: 50%;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ffffff;
  transform: translateX(-50%);
`;

const AvatarBody = styled.div`
  position: absolute;
  left: 50%;
  bottom: -3px;
  width: 60px;
  height: 38px;
  border-radius: 50% 50% 0 0;
  background: #ffffff;
  transform: translateX(-50%);
`;

const CameraButton = styled.button`
  position: absolute;
  right: 9px;
  bottom: 0;
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border: 2px solid #ffffff;
  border-radius: 50%;
  background: #ffffff;
  color: ${({ $primary }) => $primary};
  box-shadow: 0 2px 8px rgba(17, 24, 39, 0.14);
  --press-scale: 1;
  --press-active-filter: brightness(0.98);

  svg {
    width: 13px;
    height: 13px;
  }
`;

const ProfileDetails = styled.div`
  min-width: 0;
  display: grid;
  gap: 5px;
  padding-top: 16px;
`;

const UserLabel = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 8px;
  font-weight: 400;
`;

const UserLine = styled.div`
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 5px;
`;

const UserName = styled.h2`
  margin: 0;
  color: #333333;
  font-size: 16px;
  line-height: 1.15;
  font-weight: 500;
`;

const UserEmail = styled.p`
  min-width: 0;
  margin: 0;
  color: #d1d5db;
  font-size: 10px;
  line-height: 1.25;
  word-break: break-all;
`;

const TagList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 5px 6px;
  padding-top: 7px;
`;

const ProfileTag = styled.span`
  min-width: 0;
  padding: 4px 6px;
  border: 1px solid ${({ $primary }) => $primary};
  border-radius: 999px;
  background: ${({ $active, $primary }) => ($active ? $primary : '#ffffff')};
  color: ${({ $active, $primary }) => ($active ? '#ffffff' : $primary)};
  font-size: 10px;
  font-weight: 400;
  text-align: center;
`;

const MenuCard = styled.section`
  height: 272px;
  display: grid;
  grid-template-rows: repeat(4, 68px);
  overflow: hidden;
  align-self: start;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 8px 22px ${({ $shadowColor }) => `${$shadowColor}29`};
`;

const MenuButton = styled.button`
  width: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 20px;
  align-items: center;
  gap: 11px;
  padding: 9px 22px;
  border-bottom: 1px solid #eef0f3;
  background: #ffffff;
  color: ${({ theme }) => theme.colors.text};
  text-align: left;
  --press-scale: 1;
  --press-active-filter: brightness(0.98);

  &:last-child {
    border-bottom: 0;
  }
`;

const MenuIconCircle = styled.span`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: ${({ $primary }) => $primary};
  color: #ffffff;

  svg {
    width: 27px;
    height: 27px;
  }
`;

const MenuText = styled.span`
  min-width: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  line-height: 1.25;
`;

const Chevron = styled.span`
  color: ${({ $primary }) => $primary};
  font-size: 31px;
  line-height: 1;
`;

const AccountCard = styled.section`
  overflow: hidden;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 8px 22px ${({ $shadowColor }) => `${$shadowColor}29`};
`;

const AccountButton = styled.button`
  width: 100%;
  height: 52px;
  border-bottom: 1px solid #eef0f3;
  color: #4b5563;
  font-size: 17px;
  font-weight: 500;
  --press-scale: 1;
  --press-active-filter: brightness(0.98);
`;

const DangerButton = styled.button`
  width: 100%;
  height: 52px;
  color: #ef4444;
  font-size: 17px;
  font-weight: 500;
  --press-scale: 1;
  --press-active-filter: brightness(0.98);
`;

export default ProfilePage;
