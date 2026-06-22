import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '@/api/auth/supabaseClient';
import { useAuthStore } from '@/store/authStore';

const stylePreferences = [
  { label: '선호 스타일', value: '캐주얼, 미니멀' },
  { label: '추위 민감도', value: '조금 추위를 타요' },
  { label: '자주 입는 색상', value: '네이비, 아이보리' },
];

const menuItems = ['내 정보 수정', '위치 권한 설정', '알림 설정'];

function ProfilePage() {
  const navigate = useNavigate();
  const { session, setSession } = useAuthStore();
  const email = session?.user?.email ?? 'weather@example.com';
  const displayName = email.split('@')[0] || '사용자';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate('/login', { replace: true });
  };

  return (
    <Page>
      <ProfileCard>
        <Avatar>{displayName.slice(0, 1).toUpperCase()}</Avatar>
        <ProfileInfo>
          <UserName>{displayName}</UserName>
          <UserEmail>{email}</UserEmail>
        </ProfileInfo>
      </ProfileCard>

      <Section>
        <SectionTitle>스타일 프로필</SectionTitle>
        <PreferenceList>
          {stylePreferences.map((item) => (
            <PreferenceItem key={item.label}>
              <PreferenceLabel>{item.label}</PreferenceLabel>
              <PreferenceValue>{item.value}</PreferenceValue>
            </PreferenceItem>
          ))}
        </PreferenceList>
      </Section>

      <Section>
        <SectionTitle>계정 메뉴</SectionTitle>
        <MenuList>
          {menuItems.map((item) => (
            <MenuButton key={item} type="button">
              <span>{item}</span>
              <span aria-hidden="true">›</span>
            </MenuButton>
          ))}
        </MenuList>
      </Section>

      <LogoutButton type="button" onClick={handleLogout}>
        로그아웃
      </LogoutButton>
    </Page>
  );
}

const Page = styled.section`
  display: grid;
  gap: 18px;
`;

const ProfileCard = styled.section`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.seasons.winter.background};
`;

const Avatar = styled.div`
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.seasons.winter.primary};
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
`;

const ProfileInfo = styled.div`
  min-width: 0;
  display: grid;
  gap: 4px;
`;

const UserName = styled.h2`
  margin: 0;
  color: #111827;
  font-size: 22px;
`;

const UserEmail = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  word-break: break-all;
`;

const Section = styled.section`
  display: grid;
  gap: 10px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: #111827;
  font-size: 18px;
`;

const PreferenceList = styled.div`
  display: grid;
  gap: 8px;
`;

const PreferenceItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: #ffffff;
`;

const PreferenceLabel = styled.span`
  color: #6b7280;
  font-size: 14px;
`;

const PreferenceValue = styled.strong`
  color: #111827;
  font-size: 14px;
  text-align: right;
`;

const MenuList = styled.div`
  display: grid;
  gap: 8px;
`;

const MenuButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 15px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: #ffffff;
  color: #111827;
  font-size: 15px;
  text-align: left;
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  background: #fff1f2;
  color: #e11d48;
  font-size: 16px;
  font-weight: 700;
`;

export default ProfilePage;
