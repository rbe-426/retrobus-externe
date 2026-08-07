/**
 * activateDevEventMode.js
 * 
 * Script pour activer le mode événement en développement
 * À exécuter dans la console du navigateur ou au démarrage
 */

import { saveEventModeConfig, createDefaultEventConfig } from './eventModeConfig.js';

/**
 * Configuration événement JEP (Journées Européennes du Patrimoine) pour le dev
 */
export function activateJEPEventMode() {
  // Dates réelles de l'événement JEP 2026 pour le countdown
  const eventStart = new Date('2026-09-20T09:00:00'); // 20 septembre 2026, 9h
  const eventEnd = new Date('2026-09-20T19:00:00');   // 20 septembre 2026, 19h
  
  // En dev, on active toujours le mode événement avec une période étendue pour voir le hero
  const now = new Date();
  const devStart = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000); // Hier
  const devEnd = new Date('2026-09-30T23:59:59'); // Jusqu'à fin septembre

  const config = createDefaultEventConfig({
    active: true,
    startDate: devStart.toISOString(), // Active le mode dès maintenant
    endDate: devEnd.toISOString(),     // Jusqu'à fin septembre
    event: {
      id: 'jep-2026',
      name: 'Journées Européennes du Patrimoine',
      subtitle: 'Découvrez nos véhicules historiques',
      description: 'À l\'occasion des Journées Européennes du Patrimoine, RétroBus Essonne ouvre ses portes et vous invite à découvrir sa collection unique de véhicules historiques. Plongez dans l\'histoire des transports en commun franciliens !',
      location: 'Parking Crété, Corbeil-Essonnes',
      type: 'EXPO',
      bannerImage: '/assets/photos/event-exposition.jpg',
      heroImage: '/assets/photos/ma-photo-hero.jpg',
      color: '#D32F2F',
      secondaryColor: '#FFA000',
      logo: '',
      // Dates réelles de l'événement pour le countdown
      actualStartDate: eventStart.toISOString(),
      actualEndDate: eventEnd.toISOString()
    },
    registration: {
      enabled: true,
      eventId: null, // À remplir avec un vrai ID d'événement
      buttonText: 'Je m\'inscris gratuitement',
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
        { 
          icon: '🚌', 
          title: 'Exposition de véhicules', 
          description: 'Découvrez notre collection de bus historiques' 
        },
        { 
          icon: '📸', 
          title: 'Séances photo', 
          description: 'Photos souvenirs avec les véhicules' 
        },
        { 
          icon: '🤝', 
          title: 'Rencontre entre passionnés', 
          description: 'Échangez avec les membres de l\'association' 
        },
        { 
          icon: '🎪', 
          title: 'Bon moment à partager', 
          description: 'Ambiance conviviale et familiale' 
        }
      ],
      partners: [],
      practicalInfo: `
        <ul>
          <li><strong>Entrée gratuite</strong> pour tous</li>
          <li><strong>Parking disponible</strong> sur place</li>
          <li><strong>Accessible PMR</strong></li>
          <li><strong>Restauration</strong> food trucks sur place</li>
          <li><strong>Boutique souvenir</strong> ouverte</li>
        </ul>
      `
    }
  });

  const success = saveEventModeConfig(config);
  
  if (success) {
    console.log('✅ Mode événement JEP activé pour le développement !');
    console.log('📅 Période:', start.toLocaleDateString(), '-', end.toLocaleDateString());
    console.log('🔄 Rechargez la page pour voir les changements');
    return config;
  } else {
    console.error('❌ Échec de l\'activation du mode événement');
    return null;
  }
}

/**
 * Désactiver le mode événement
 */
export function deactivateEventMode() {
  const config = createDefaultEventConfig({ active: false });
  const success = saveEventModeConfig(config);
  
  if (success) {
    console.log('✅ Mode événement désactivé');
    console.log('🔄 Rechargez la page pour voir les changements');
  } else {
    console.error('❌ Échec de la désactivation du mode événement');
  }
}

// Auto-activation en mode dev si demandé via URL
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  const params = new URLSearchParams(window.location.search);
  
  if (params.get('activateEventMode') === 'true') {
    activateJEPEventMode();
    console.log('🎪 Mode événement auto-activé via URL');
  }
  
  // Exposer les fonctions globalement pour la console
  window.activateJEPEventMode = activateJEPEventMode;
  window.deactivateEventMode = deactivateEventMode;
  
  console.log('💡 Fonctions disponibles dans la console:');
  console.log('   - activateJEPEventMode() : Activer le mode événement JEP');
  console.log('   - deactivateEventMode() : Désactiver le mode événement');
}
