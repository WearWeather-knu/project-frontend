import { supabase } from './supabaseClient';

const getOAuthRedirectUrl = () => {
  const configuredRedirectUrl = import.meta.env.VITE_REDIRECT_URL?.trim();

  if (import.meta.env.DEV && typeof window !== 'undefined') {
    return configuredRedirectUrl || window.location.origin;
  }

  return configuredRedirectUrl;
};

export const loginWithKakao = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: getOAuthRedirectUrl(),
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
