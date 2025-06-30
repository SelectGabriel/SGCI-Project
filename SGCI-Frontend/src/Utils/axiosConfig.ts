import axios, { AxiosRequestHeaders } from 'axios';
import { authService } from '../Service/authService';

axios.interceptors.request.use((config) => {
  const token = authService.getToken();

  const publicEndpoints = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot'
  ];

  const isPublic = publicEndpoints.some(endpoint =>
    config.url?.includes(endpoint)
  );

  if (!isPublic && token) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
    } as AxiosRequestHeaders;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      authService.clearAuthData();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);