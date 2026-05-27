import { useState } from 'react';
import { loginWithKakao } from '../api/auth/auth';
import styled from 'styled-components';
import splashLogo from '@/assets/스플래시 로고.png';

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleKakaoLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await loginWithKakao();
    } catch (err) {
      setError('카카오 로그인에 실패했습니다.');
      console.error('로그인 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Logo src={splashLogo} alt="WearWeather" />
      <BottomArea>
        <KakaoButton
          type="button"
          onClick={handleKakaoLogin}
          disabled={isLoading}
        >
          <KakaoIconWrapper>
            <KakaoIcon />
          </KakaoIconWrapper>
          카카오 로그인
        </KakaoButton>
        {error && <ErrorText role="alert">{error}</ErrorText>}
      </BottomArea>
    </Container>
  );
}

function KakaoIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2C5.582 2 2 4.896 2 8.46c0 2.25 1.484 4.228 3.726 5.372l-.952 3.542c-.083.31.283.557.547.368L9.74 15.06A9.63 9.63 0 0 0 10 15.08c4.418 0 8-2.896 8-6.46C18 4.896 14.418 2 10 2Z"
        fill="#191919"
      />
    </svg>
  );
}

const Container = styled.section`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 40px 40px 80px;
  background: linear-gradient(
    175deg,
    rgba(245, 159, 169, 0.3) 0%,
    rgba(240, 176, 104, 0.1) 25%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(240, 217, 104, 0.1) 77%,
    rgba(163, 221, 242, 0.2) 100%
  );
`;

const Logo = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: max(320px, 50%);
  height: auto;
  object-fit: contain;
`;

const BottomArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const KakaoButton = styled.button`
  position: relative;
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 12px;
  background: #fee500;
  color: #191919;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const KakaoIconWrapper = styled.div`
  position: absolute;
  left: 16px;
  display: flex;
  align-items: center;
`;

const ErrorText = styled.p`
  text-align: center;
  font-size: 13px;
  color: #e53e3e;
`;

export default LoginPage;
