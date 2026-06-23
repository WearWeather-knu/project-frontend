import { create } from 'zustand';

const DEV_AUTH_STORAGE_KEY = 'wear-weather-dev-session';

export const createDevSession = () => ({
  access_token: 'dev-access-token',
  token_type: 'bearer',
  user: {
    id: 'dev-user',
    email: 'dev@wearweather.local',
  },
});

export const loadDevSession = () => {
  if (!import.meta.env.DEV) return null;

  try {
    const storedSession = window.localStorage.getItem(DEV_AUTH_STORAGE_KEY);
    return storedSession ? JSON.parse(storedSession) : null;
  } catch {
    return null;
  }
};

export const saveDevSession = (session) => {
  if (!import.meta.env.DEV) return;

  window.localStorage.setItem(DEV_AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearDevSession = () => {
  if (!import.meta.env.DEV) return;

  window.localStorage.removeItem(DEV_AUTH_STORAGE_KEY);
};

export const useAuthStore = create((set) => ({
  session: null,
  setSession: (session) => set({ session }),
}));
