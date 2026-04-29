/**
 * autoDetectEventMode.js
 * 
 * Détecte automatiquement si un événement JEP est actif et configure le mode événement
 */

import { saveEventModeConfig } from './eventModeConfig.js';

// En dev local, l'API est sur le port 8080
const API_URL = import.meta.env.DEV 
  ? 'http://localhost:8080' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:8080');

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
    console.error('❌ Erreur lors de la détection automatique de l\'événement JEP:', error);
  }
}
