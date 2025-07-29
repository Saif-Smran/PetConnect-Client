// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pet-connect-server-one.vercel.app';

// Helper function to construct API URLs
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  // Ensure base URL doesn't end with slash to avoid double slashes
  const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${cleanBaseUrl}/${cleanEndpoint}`;
};
