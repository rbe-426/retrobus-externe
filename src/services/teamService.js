/**
 * Team API Service (Externe)
 * Récupère les données d'équipe en mode public (sans contacts)
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const readToken = () => {
  if (typeof window === 'undefined') return null;
  return (
    window.localStorage.getItem('token')
    || window.sessionStorage.getItem('token')
    || null
  );
};

const fetchCsrfToken = async () => {
  const candidates = [
    `${API_BASE}/api/csrf-token`,
    `${API_BASE}/csrf-token`
  ];

  for (const url of candidates) {
    try {
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) continue;
      const data = await response.json();
      if (data?.csrfToken) return data.csrfToken;
    } catch {
      // noop: essayer le prochain endpoint
    }
  }

  return null;
};

const updateMemberImageWithEndpoint = async ({ memberId, image, endpoint, csrfToken }) => {
  const token = readToken();
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  const response = await fetch(endpoint, {
    method: 'PUT',
    headers,
    credentials: 'include',
    body: JSON.stringify({ image })
  });

  const data = await response.json().catch(() => ({}));

  if (response.ok) {
    return data;
  }

  const err = new Error(data?.error || data?.message || 'Erreur mise à jour photo équipe');
  err.status = response.status;
  err.code = data?.code;
  throw err;
};

/**
 * Récupère tous les membres de l'équipe (mode public)
 */
export const getAllTeamMembers = async () => {
  try {
    const response = await fetch(`${API_BASE}/team?public=true`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de l\'équipe');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur API team:', error);
    throw error;
  }
};

/**
 * Met à jour l'image d'un membre (avec métadonnées de cadrage/zoom)
 */
export const updateTeamMemberImage = async (memberId, image) => {
  const endpoints = [
    `${API_BASE}/api/team/${memberId}`,
    `${API_BASE}/team/${memberId}`
  ];

  let csrfToken = await fetchCsrfToken();
  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      return await updateMemberImageWithEndpoint({ memberId, image, endpoint, csrfToken });
    } catch (error) {
      lastError = error;
      const isCsrfIssue = error.status === 403 && (error.code === 'CSRF_INVALID' || error.code === 'CSRF_MISSING');
      if (isCsrfIssue) {
        csrfToken = await fetchCsrfToken();
        try {
          return await updateMemberImageWithEndpoint({ memberId, image, endpoint, csrfToken });
        } catch (retryError) {
          lastError = retryError;
        }
      }
    }
  }

  throw lastError || new Error('Impossible de sauvegarder la photo sur le serveur');
};

export default {
  getAllTeamMembers,
  updateTeamMemberImage
};
