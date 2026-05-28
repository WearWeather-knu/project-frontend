import axios from 'axios';
import { supabase } from './auth/supabaseClient';

const backendInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
});

backendInstance.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default backendInstance;
