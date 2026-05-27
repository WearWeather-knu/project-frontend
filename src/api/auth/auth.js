import { supabase } from './supabaseClient';

export const loginWithKakao = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: import.meta.env.VITE_REDIRECT_URL,
    },
  });
  if (error) throw error;
};

// };

// export const loginWithRegular = async (email, password) => {
//   const { error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });
//   if (error) throw error;
// };

// export const loginWithKakao = async () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, 1000);
//   });
// };

export const loginWithRegular = async (userId, password) => {
  // 나중에 supabase로 교체
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId === 'test@test.com' && password === '1234') {
        resolve({ user: { id: 1, email: 'test@test.com' } });
      } else {
        reject(new Error('로그인 실패'));
      }
    }, 1000); // 네트워크 딜레이 시뮬레이션
  });
};
