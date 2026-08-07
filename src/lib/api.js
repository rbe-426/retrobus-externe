export const API_BASE = import.meta.env.VITE_API_URL || 'https://attractive-kindness-rbe-serveurs.up.railway.app';
export const apiUrl = (path = '') => `${API_BASE}${path}`;