// import { supabase } from './supabaseClient';
//
// export const loginWithKakao = async () => {
//   const { error } = await supabase.auth.signInWithOAuth({
//     provider: 'kakao',
//     options: {
//       redirectTo: import.meta.env.VITE_REDIRECT_URL,
//     },
//   });
//
//   if (error) throw error;
// };

export const loginWithKakao = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};
