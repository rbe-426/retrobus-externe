/**
 * Team API Service (Externe)
 * Récupère les données d'équipe en mode public (sans contacts)
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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

export default {
  getAllTeamMembers
};
