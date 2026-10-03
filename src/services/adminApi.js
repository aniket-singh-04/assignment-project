import { fetchClient } from './api';

export const fetchAdminDashboard = async () => {
  const res = await fetchClient('/admin/dashboard');
  const data = res.data || res;
  return {
    totalUsers: data.usersCount ?? data.totalUsers ?? 0,
    totalStores: data.storesCount ?? data.totalStores ?? 0,
    totalRatings: data.ratingsCount ?? data.totalRatings ?? 0,
  };
};

export const fetchUsers = async (params = {}) => {
  // Support both object params and legacy arg signature
  let queryObj = {};
  if (typeof params === 'object') {
    queryObj = { ...params };
  }
  const cleanParams = {};
  Object.keys(queryObj).forEach(k => {
    if (queryObj[k] !== undefined && queryObj[k] !== null && queryObj[k] !== '') {
      cleanParams[k] = queryObj[k];
    }
  });
  const query = new URLSearchParams(cleanParams).toString();
  return await fetchClient(`/admin/users?${query}`);
};

export const createUser = async (userData) => {
  return await fetchClient('/admin/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const fetchAdminStores = async (params = {}) => {
  let queryObj = {};
  if (typeof params === 'object') {
    queryObj = { ...params };
  }
  const cleanParams = {};
  Object.keys(queryObj).forEach(k => {
    if (queryObj[k] !== undefined && queryObj[k] !== null && queryObj[k] !== '') {
      cleanParams[k] = queryObj[k];
    }
  });
  const query = new URLSearchParams(cleanParams).toString();
  return await fetchClient(`/admin/stores?${query}`);
};

export const createStore = async (storeData) => {
  return await fetchClient('/admin/stores', {
    method: 'POST',
    body: JSON.stringify(storeData),
  });
};

export const fetchUserDetails = async (userId) => {
  return await fetchClient(`/admin/users/${userId}`);
};
