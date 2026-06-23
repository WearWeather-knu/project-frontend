import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '@/api/auth/supabaseClient';
import { clearDevSession, useAuthStore } from '@/store/authStore';

const profileTags = ['#스트릿패션', '#편한옷선호', '#더위취약', '#햇빛알러지'];
const menuItems = ['나의 옷장', '나의 선호 착장', '나의 옷장 기록', '나의 옷장 기록'];

function ProfilePage() {
  const navigate = useNavigate();
  const { session, setSession } = useAuthStore();
  const email = session?.user?.email ?? 'weather@example.com';
  const displayName = email.split('@')[0] || '사용자';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearDevSession();
    setSession(null);
    navigate('/login', { replace: true });
  };

  return (
    <Page>
      <ProfileCard>
        <ProfileSettingsButton type="button" aria-label="프로필 설정">
          <ProfileSettingsIcon />
        </ProfileSettingsButton>

        <AvatarArea>
          <Avatar aria-hidden="true">
            <AvatarHead />
            <AvatarBody />
          </Avatar>
          <CameraButton type="button" aria-label="프로필 사진 변경">
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
              <ProfileTag key={tag} $active={index < 2}>
                {tag}
              </ProfileTag>
            ))}
          </TagList>
        </ProfileDetails>
      </ProfileCard>

      <MenuCard>
        {menuItems.map((item, index) => (
          <MenuButton key={`${item}-${index}`} type="button">
            <MenuIconCircle aria-hidden="true">
              <HangerIcon />
            </MenuIconCircle>
            <MenuText>{item}</MenuText>
            <Chevron aria-hidden="true">›</Chevron>
          </MenuButton>
        ))}
      </MenuCard>

      <AccountCard>
        <AccountButton type="button" onClick={handleLogout}>
          로그아웃
        </AccountButton>
        <DangerButton type="button">계정탈퇴</DangerButton>
      </AccountCard>
    </Page>
  );
}

function ProfileSettingsIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.4 13.2C15.1 13.2 17.3 11 17.3 8.3C17.3 5.6 15.1 3.4 12.4 3.4C9.7 3.4 7.5 5.6 7.5 8.3C7.5 11 9.7 13.2 12.4 13.2ZM4.2 22.1C5.4 18.7 8.6 16.2 12.4 16.2C14 16.2 15.5 16.6 16.8 17.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M21 14.9L21.6 16.8L23.6 16.4L22.2 17.9L23.6 19.4L21.6 19L21 20.9L20.4 19L18.4 19.4L19.8 17.9L18.4 16.4L20.4 16.8L21 14.9Z"
        fill="currentColor"
      />
    </svg>
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
  grid-template-rows: auto minmax(0, 1fr) auto;
  align-content: stretch;
  gap: 18px;
  margin: -20px -20px -24px;
  padding: 34px 28px 36px;
  background:
    radial-gradient(circle at 6% 42%, rgba(214, 198, 245, 0.7), transparent 32%),
    linear-gradient(180deg, #ffffff 0%, #f3f0ff 56%, #eaf5ff 100%);
`;

const ProfileCard = styled.section`
  position: relative;
  min-height: 154px;
  display: grid;
  grid-template-columns: 108px minmax(0, 1fr);
  align-items: center;
  gap: 15px;
  padding: 18px 21px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 8px 22px rgba(49, 50, 111, 0.14);
`;

const ProfileSettingsButton = styled.button`
  position: absolute;
  top: 14px;
  right: 16px;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.seasons.winter.primary};

  svg {
    width: 24px;
    height: 24px;
  }
`;

const AvatarArea = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
`;

const Avatar = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
  overflow: hidden;
  border: 3px solid ${({ theme }) => theme.colors.seasons.winter.primary};
  border-radius: 50%;
  background: #d9d9d9;
`;

const AvatarHead = styled.div`
  position: absolute;
  top: 21px;
  left: 50%;
  width: 33px;
  height: 33px;
  border-radius: 50%;
  background: #ffffff;
  transform: translateX(-50%);
`;

const AvatarBody = styled.div`
  position: absolute;
  left: 50%;
  bottom: -4px;
  width: 68px;
  height: 39px;
  border-radius: 50% 50% 0 0;
  background: #ffffff;
  transform: translateX(-50%);
`;

const CameraButton = styled.button`
  position: absolute;
  right: 8px;
  bottom: 0;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border: 2px solid #ffffff;
  border-radius: 50%;
  background: #ffffff;
  color: ${({ theme }) => theme.colors.seasons.winter.primary};
  box-shadow: 0 2px 8px rgba(17, 24, 39, 0.14);

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ProfileDetails = styled.div`
  min-width: 0;
  display: grid;
  gap: 6px;
  padding-top: 8px;
`;

const UserLabel = styled.span`
  color: ${({ theme }) => theme.colors.seasons.winter.primary};
  font-size: 10px;
  font-weight: 700;
`;

const UserLine = styled.div`
  min-width: 0;
  display: grid;
  gap: 3px;
`;

const UserName = styled.h2`
  margin: 0;
  color: #333333;
  font-size: 21px;
  line-height: 1.15;
  font-weight: 500;
`;

const UserEmail = styled.p`
  min-width: 0;
  margin: 0;
  color: #d1d5db;
  font-size: 12px;
  line-height: 1.25;
  word-break: break-all;
`;

const TagList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px 7px;
  padding-top: 3px;
`;

const ProfileTag = styled.span`
  min-width: 0;
  padding: 5px 6px;
  border: 1px solid ${({ theme }) => theme.colors.seasons.winter.primary};
  border-radius: 999px;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.seasons.winter.primary : '#ffffff'};
  color: ${({ $active, theme }) =>
    $active ? '#ffffff' : theme.colors.seasons.winter.primary};
  font-size: 10px;
  font-weight: 700;
  text-align: center;
`;

const MenuCard = styled.section`
  min-height: 0;
  display: grid;
  grid-template-rows: repeat(4, minmax(0, 1fr));
  overflow: hidden;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 8px 22px rgba(49, 50, 111, 0.14);
`;

const MenuButton = styled.button`
  width: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 20px;
  align-items: center;
  gap: 12px;
  padding: 10px 22px;
  border-bottom: 1px solid #eef0f3;
  background: #ffffff;
  color: #4b5563;
  text-align: left;

  &:last-child {
    border-bottom: 0;
  }
`;

const MenuIconCircle = styled.span`
  width: 35px;
  height: 35px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.seasons.winter.primary};
  color: #ffffff;

  svg {
    width: 28px;
    height: 28px;
  }
`;

const MenuText = styled.span`
  min-width: 0;
  color: #4b5563;
  font-size: 17px;
  line-height: 1.25;
`;

const Chevron = styled.span`
  color: ${({ theme }) => theme.colors.seasons.winter.primary};
  font-size: 31px;
  line-height: 1;
`;

const AccountCard = styled.section`
  overflow: hidden;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 8px 22px rgba(49, 50, 111, 0.14);
`;

const AccountButton = styled.button`
  width: 100%;
  height: 52px;
  border-bottom: 1px solid #eef0f3;
  color: #4b5563;
  font-size: 17px;
  font-weight: 500;
`;

const DangerButton = styled.button`
  width: 100%;
  height: 52px;
  color: #ef4444;
  font-size: 17px;
  font-weight: 500;
`;

export default ProfilePage;
