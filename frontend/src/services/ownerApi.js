import { fetchClient } from './api';

export const fetchOwnerDashboard = async () => {
  return await fetchClient('/owner/dashboard');
};

export const fetchOwnerRatings = async () => {
  return await fetchClient('/owner/ratings');
};
