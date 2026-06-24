import axios from 'axios';
import { supabase } from './auth/supabaseClient';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL?.trim(),
  timeout: 50000,
});

instance.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (token || anonKey) {
    config.headers.Authorization = `Bearer ${token ?? anonKey}`;
  }

  return config;
});

export default instance;
