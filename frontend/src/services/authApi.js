import { fetchClient } from './api';

export const loginUser = async (credentials) => {
  return await fetchClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const registerUser = async (userData) => {
  return await fetchClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const changePassword = async (data) => {
  return await fetchClient('/auth/password', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const updateProfile = async (data) => {
  return await fetchClient('/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const logoutUser = async () => {
  return await fetchClient('/auth/logout', {
    method: 'POST',
  });
};
