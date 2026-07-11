import axiosInstance from './axiosInstance';

export const login = (email, password) =>
  axiosInstance.post('/auth/login', { email, password });

export const register = (name, email, password) =>
  axiosInstance.post('/auth/register', { name, email, password });
