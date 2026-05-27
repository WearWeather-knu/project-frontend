import { useState } from 'react';
import { loginWithKakao, loginWithRegular } from '../api/auth/auth';
import { useAuthStore } from '../store/AuthStore';

function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const setSession = useAuthStore((s) => s.setSession);

  const handleRegularLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await loginWithRegular(userId, password);
      setSession(result);
    } catch (err) {
      setError('이메일 또는 비밀번호가 잘못되었습니다.');
      console.error('로그인 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await loginWithKakao();
    } catch (err) {
      setError('로그인 또는 비밀번호가 잘못되었습니다.');
      console.error('로그인 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>로그인</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRegularLogin();
        }}
      >
        <div>
          <label htmlFor="user_id">이메일</label>
          <input
            id="user_id"
            required
            type="email"
            inputMode="email"
            value={userId}
            placeholder="이메일을 입력하세요."
            name="email"
            autoComplete="email"
            disabled={isLoading}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="user_password">비밀번호</label>
          <input
            id="user_password"
            required
            type="password"
            value={password}
            placeholder="비밀번호를 입력하세요."
            name="password"
            autoComplete="current-password"
            disabled={isLoading}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          로그인
        </button>
        <button type="button" onClick={handleKakaoLogin} disabled={isLoading}>
          카카오 로그인
        </button>
        {error && <p role="alert">{error}</p>}
      </form>
    </div>
  );
}

export default LoginPage;
