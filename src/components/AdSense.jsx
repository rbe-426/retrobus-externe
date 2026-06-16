import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';

let adsScriptPromise = null;

function loadAdSenseScript() {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.adsbygoogle) return Promise.resolve();
  if (adsScriptPromise) return adsScriptPromise;

  adsScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-rbe-adsense="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('AdSense script load failed')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2311147456651142';
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-rbe-adsense', 'true');
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('AdSense script load failed'));
    document.head.appendChild(script);
  });

  return adsScriptPromise;
}

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
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (import.meta.env.DEV) return;
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (import.meta.env.DEV || !isVisible) return;

    loadAdSenseScript()
      .then(() => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          console.error('Erreur AdSense:', error);
        }
      })
      .catch((error) => {
        console.error('Erreur chargement script AdSense:', error);
      });
  }, [isVisible]);

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
    <Box ref={containerRef} style={style} textAlign="center" minH="90px">
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
