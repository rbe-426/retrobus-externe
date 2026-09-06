/**
 * autoDetectEventMode.js
 * 
 * Détecte automatiquement si un événement JEP est actif et configure le mode événement
 */

import { saveEventModeConfig } from './eventModeConfig.js';

// URL de l'API depuis les variables d'environnement
const API_URL = import.meta.env.VITE_API_URL || 'https://attractive-kindness-rbe-serveurs.up.railway.app';

/**
 * Vérifie auprès de l'API si un événement JEP est actif
 * et configure automatiquement le mode événement si nécessaire
 */
export async function autoDetectAndActivateEventMode() {
  try {
    console.log('🔍 Vérification de l\'événement JEP actif...');
    
    const response = await fetch(`${API_URL}/public/events/active/jep`);
    if (!response.ok) {
      console.warn('⚠️ Impossible de vérifier l\'événement JEP:', response.statusText);
      return;
    }
    
    const data = await response.json();
    
    if (data.active && data.eventConfig) {
      console.log('✅ Événement JEP actif détecté:', data.eventConfig.event.name);
      saveEventModeConfig(data.eventConfig);
      console.log('🎪 Mode événement JEP activé automatiquement');
    } else {
      console.log('ℹ️ Aucun événement JEP actif');
      // Nettoyer le localStorage si aucun événement actif
      localStorage.removeItem('rbe:public-event-mode');
    }
  } catch (error) {
    const isLocalApi = /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(API_URL);
    if (isLocalApi) {
      console.info('ℹ️ API locale indisponible : le mode événement JEP reste désactivé.');
      return;
    }
    console.error('❌ Erreur lors de la détection automatique de l\'événement JEP:', error);
  }
}
