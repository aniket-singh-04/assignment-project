import { fetchClient } from './api';

export const fetchStores = async (params) => {
  const query = new URLSearchParams(params).toString();
  return await fetchClient(`/stores?${query}`);
};

export const submitRating = async (storeId, rating, review) => {
  return await fetchClient(`/stores/${storeId}/ratings`, {
    method: 'POST',
    body: JSON.stringify({ rating, review }),
  });
};

export const updateRating = async (storeId, rating, review) => {
  return await fetchClient(`/stores/${storeId}/ratings`, {
    method: 'PATCH',
    body: JSON.stringify({ rating, review }),
  });
};
