export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Base fetch client that adds authorization headers and handles 401 unauth session expiry.
 */
export async function fetchClient(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: 'include',
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Session token expired or invalid - auto logout & clear storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || 'An error occurred during the request.');
  }

  return data;
}
