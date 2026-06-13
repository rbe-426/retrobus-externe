import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';

/**
 * Composant Google AdSense
 * 
 * Types d'annonces disponibles :
 * - 'display' : Bannière rectangulaire standard (responsive)
 * - 'in-article' : Annonce intégrée dans le contenu
 * - 'in-feed' : Annonce dans les listes/flux
 * 
 * @param {string} slot - ID du slot AdSense (créé dans votre compte AdSense)
 * @param {string} format - Type d'annonce ('auto', 'rectangle', 'horizontal', 'vertical')
 * @param {string} type - Type de placement ('display', 'in-article', 'in-feed')
 */
export default function AdSense({ 
  slot = 'auto',
  format = 'auto', 
  responsive = true,
  type = 'display',
  style = {}
}) {
  useEffect(() => {
    try {
      // Initialiser AdSense après le montage du composant
      if (window.adsbygoogle && process.env.NODE_ENV !== 'development') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Erreur AdSense:', error);
    }
  }, []);

  // Ne pas afficher les annonces en développement
  if (import.meta.env.DEV) {
    return (
      <Box
        bg="gray.100"
        border="2px dashed"
        borderColor="gray.300"
        p={4}
        textAlign="center"
        color="gray.500"
        fontSize="sm"
        style={style}
      >
        📢 Emplacement publicitaire AdSense
        <br />
        (visible uniquement en production)
      </Box>
    );
  }

  return (
    <Box style={style} textAlign="center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2311147456651142"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        data-ad-layout={type === 'in-article' ? 'in-article' : undefined}
        data-ad-layout-key={type === 'in-feed' ? '-fb+5w+4e-db+86' : undefined}
      />
    </Box>
  );
}

/**
 * Composants pré-configurés pour différents emplacements
 */

// Bannière horizontale (header/footer)
export function AdSenseHorizontal({ style = {} }) {
  return (
    <AdSense 
      format="horizontal" 
      style={{ margin: '20px 0', ...style }}
    />
  );
}

// Rectangle dans la sidebar
export function AdSenseRectangle({ style = {} }) {
  return (
    <AdSense 
      format="rectangle" 
      style={{ margin: '20px 0', ...style }}
    />
  );
}

// Annonce dans un article
export function AdSenseInArticle({ style = {} }) {
  return (
    <AdSense 
      type="in-article"
      format="fluid"
      style={{ margin: '30px 0', ...style }}
    />
  );
}

// Annonce dans un flux/liste
export function AdSenseInFeed({ style = {} }) {
  return (
    <AdSense 
      type="in-feed"
      format="fluid"
      style={{ margin: '20px 0', ...style }}
    />
  );
}
