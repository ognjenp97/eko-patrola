import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('ekoPatrolaToken', token);
  } else {
    localStorage.removeItem('ekoPatrolaToken');
  }
}

export function getAuthToken() {
  return localStorage.getItem('ekoPatrolaToken');
}

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
