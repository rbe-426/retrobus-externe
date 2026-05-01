/**
 * eventModeConfig.js (EXTERNE)
 * 
 * Utilitaire pour gérer le mode événement temporaire sur le site public
 * Permet d'afficher une version événementielle du site pendant une période définie
 */

import React from 'react';

const EVENT_MODE_KEY = 'rbe:public-event-mode';

/**
 * Structure de configuration du mode événement
 * {
 *   active: boolean,
 *   startDate: ISO string,
 *   endDate: ISO string,
 *   event: {
 *     id: string (optionnel, ID de l'événement lié),
 *     name: string,
 *     subtitle: string,
 *     description: string,
 *     location: string,
 *     type: 'EXPO' | 'BOURSE' | 'RALLY' | 'MEETING' | 'DEFILE' | 'CUSTOM',
 *     bannerImage: string (URL),
 *     heroImage: string (URL),
 *     color: string (hex color),
 *     secondaryColor: string (hex color),
 *     logo: string (URL)
 *   },
 *   registration: {
 *     enabled: boolean,
 *     eventId: string (ID de l'événement dans la BD),
 *     buttonText: string,
 *     requireAuth: boolean,
 *     isPaid: boolean,
 *     price: number,
 *     currency: string
 *   },
 *   customContent: {
 *     showCountdown: boolean,
 *     showProgramSchedule: boolean,
 *     schedule: [],
 *     highlights: [],
 *     partners: [],
 *     practicalInfo: string (HTML/Markdown)
 *   },
 *   createdAt: ISO string,
 *   updatedAt: ISO string
 * }
 */

/**
 * Récupérer la configuration du mode événement
 */
export function getEventModeConfig() {
  try {
    const raw = localStorage.getItem(EVENT_MODE_KEY);
    if (!raw) return null;
    
    const config = JSON.parse(raw);
    
    // Validation basique
    if (!config || typeof config !== 'object') return null;
    
    return config;
  } catch (error) {
    console.error('❌ Erreur chargement config mode événement:', error);
    return null;
  }
}

/**
 * Vérifier si le mode événement est actuellement actif
 */
export function isEventModeActive() {
  const config = getEventModeConfig();
  
  if (!config || config.enabled === false) return false;
  
  const now = new Date();
  const startDate = new Date(config.startDate);
  const endDate = new Date(config.endDate);
  
  // Vérifier que les dates sont valides
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.warn('⚠️ Dates invalides dans config mode événement');
    return false;
  }
  
  // Activation précoce : 150 jours avant l'événement pour préparer et tester
  const activationStart = new Date(startDate.getTime() - 150 * 24 * 60 * 60 * 1000);
  
  // Vérifier que nous sommes dans la période (60 jours avant → fin événement)
  const isInPeriod = now >= activationStart && now <= endDate;
  
  if (!isInPeriod) {
    console.log('📅 Mode événement inactif (hors période)', {
      now: now.toISOString(),
      activationStart: activationStart.toISOString(),
      eventStart: startDate.toISOString(),
      end: endDate.toISOString()
    });
  }
  
  return isInPeriod;
}

/**
 * Sauvegarder la configuration du mode événement
 */
export function saveEventModeConfig(config) {
  try {
    const configWithTimestamp = {
      ...config,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(EVENT_MODE_KEY, JSON.stringify(configWithTimestamp));
    
    console.log('✅ Configuration mode événement sauvegardée:', configWithTimestamp);
    
    // Broadcast l'événement pour rafraîchir les autres onglets
    window.dispatchEvent(new CustomEvent('eventModeChanged', { detail: configWithTimestamp }));
    
    return true;
  } catch (error) {
    console.error('❌ Erreur sauvegarde config mode événement:', error);
    return false;
  }
}

/**
 * Supprimer la configuration du mode événement
 */
export function clearEventModeConfig() {
  try {
    localStorage.removeItem(EVENT_MODE_KEY);
    console.log('🗑️ Configuration mode événement supprimée');
    
    // Broadcast l'événement
    window.dispatchEvent(new CustomEvent('eventModeChanged', { detail: null }));
    
    return true;
  } catch (error) {
    console.error('❌ Erreur suppression config mode événement:', error);
    return false;
  }
}

/**
 * Créer une configuration par défaut
 */
export function createDefaultEventConfig(overrides = {}) {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return {
    active: true, // Activation du mode dev event
    startDate: tomorrow.toISOString(),
    endDate: nextWeek.toISOString(),
    event: {
      id: null,
      name: 'Événement RétroBus Essonne',
      subtitle: 'Patrimoine Roulant en Fête',
      description: 'Venez découvrir nos véhicules historiques et participer à une journée exceptionnelle dédiée au patrimoine des transports en commun.',
      location: 'À définir',
      type: 'EXPO',
      bannerImage: '',
      heroImage: '',
      color: '#D32F2F',
      secondaryColor: '#FFA000',
      logo: ''
    },
    registration: {
      enabled: true,
      eventId: null,
      buttonText: 'S\'inscrire à l\'événement',
      requireAuth: false,
      isPaid: false,
      price: 0,
      currency: 'EUR'
    },
    customContent: {
      showCountdown: true,
      showProgramSchedule: false,
      schedule: [],
      highlights: [
        { icon: '🚌', title: 'Exposition de véhicules', description: 'Découvrez notre collection' },
        { icon: '🎪', title: 'Animations', description: 'Activités pour toute la famille' },
        { icon: '📸', title: 'Séances photo', description: 'Photos souvenirs avec les bus' },
        { icon: '🍔', title: 'Restauration', description: 'Food trucks sur place' }
      ],
      partners: [],
      practicalInfo: ''
    },
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    ...overrides
  };
}

/**
 * Types d'événements prédéfinis
 */
export const EVENT_TYPES = {
  EXPO: {
    label: 'Exposition',
    color: '#D32F2F',
    icon: '🚌',
    description: 'Exposition de véhicules historiques'
  },
  BOURSE: {
    label: 'Bourse d\'échange',
    color: '#1976D2',
    icon: '🔄',
    description: 'Bourse d\'échange de pièces et accessoires'
  },
  RALLY: {
    label: 'Rallye',
    color: '#388E3C',
    icon: '🏁',
    description: 'Rallye de véhicules anciens'
  },
  DEFILE: {
    label: 'Défilé',
    color: '#F57C00',
    icon: '🎭',
    description: 'Défilé de véhicules historiques'
  },
  MEETING: {
    label: 'Rassemblement',
    color: '#7B1FA2',
    icon: '🤝',
    description: 'Rassemblement de passionnés'
  },
  CUSTOM: {
    label: 'Personnalisé',
    color: '#5E35B1',
    icon: '⭐',
    description: 'Événement personnalisé'
  }
};

/**
 * Hook React pour utiliser le mode événement
 */
export function useEventMode() {
  const [config, setConfig] = React.useState(null);
  const [isActive, setIsActive] = React.useState(false);
  
  React.useEffect(() => {
    const loadConfig = () => {
      const cfg = getEventModeConfig();
      const active = isEventModeActive();
      
      setConfig(cfg);
      setIsActive(active);
      
      console.log('🎪 Mode événement (externe):', active ? 'ACTIF' : 'INACTIF', cfg);
    };
    
    loadConfig();
    
    // Écouter les changements depuis d'autres onglets ou l'admin
    const handleEventModeChange = (e) => {
      console.log('🔄 Mode événement changé:', e.detail);
      loadConfig();
    };
    
    window.addEventListener('eventModeChanged', handleEventModeChange);
    
    // Vérifier toutes les minutes si le mode doit s'activer/désactiver
    const interval = setInterval(loadConfig, 60 * 1000);
    
    return () => {
      window.removeEventListener('eventModeChanged', handleEventModeChange);
      clearInterval(interval);
    };
  }, []);
  
  const updateConfig = (newConfig) => {
    const success = saveEventModeConfig(newConfig);
    if (success) {
      setConfig(newConfig);
      setIsActive(isEventModeActive());
    }
    return success;
  };
  
  const clearConfig = () => {
    const success = clearEventModeConfig();
    if (success) {
      setConfig(null);
      setIsActive(false);
    }
    return success;
  };
  
  return {
    config,
    isActive,
    updateConfig,
    clearConfig
  };
}
