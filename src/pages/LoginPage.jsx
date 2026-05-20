import { loginWithKakao } from '../api/auth/auth';

function LoginPage() {
  const handleLogin = async () => {
    try {
      await loginWithKakao();
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  return session ? undefined : (
    <div>
      로그인
      <button onClick={handleLogin}>카카오로 시작하기</button>
    </div>
  );
}

export default LoginPage;
