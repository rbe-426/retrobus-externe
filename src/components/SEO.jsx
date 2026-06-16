import { Helmet } from 'react-helmet-async';

/**
 * Composant SEO complet pour améliorer le référencement
 * 
 * @param {string} title - Titre de la page
 * @param {string} description - Description de la page (150-160 caractères recommandé)
 * @param {string} keywords - Mots-clés séparés par des virgules
 * @param {string} image - URL de l'image pour Open Graph/Twitter (absolue)
 * @param {string} url - URL canonique de la page (absolue)
 * @param {string} type - Type Open Graph (website, article, etc.)
 * @param {object} jsonLd - Données structurées JSON-LD
 * @param {string} locale - Langue du contenu (fr_FR par défaut)
 * @param {string} siteName - Nom du site
 * @param {boolean} noIndex - Si true, empêche l'indexation de la page
 * @param {string} author - Auteur du contenu
 * @param {string} publishedTime - Date de publication (format ISO)
 * @param {string} modifiedTime - Date de modification (format ISO)
 */
export default function SEO({
  title = "RétroBus Essonne",
  description = "Association de préservation du patrimoine automobile en Île-de-France. Découvrez notre collection unique de bus historiques, participez à nos événements et soutenez la sauvegarde du patrimoine routier.",
  keywords = "bus anciens, autobus historiques, patrimoine automobile, Essonne, RétroBus, collection bus, véhicules de collection, transports en commun anciens, musée bus, association automobile",
  image = "https://www.association-rbe.fr/assets/photos/ma-photo-hero.jpg",
  url = "https://www.association-rbe.fr",
  type = "website",
  jsonLd = null,
  locale = "fr_FR",
  siteName = "RétroBus Essonne - Association de préservation du patrimoine automobile",
  noIndex = false,
  author = "RétroBus Essonne",
  publishedTime,
  modifiedTime
}) {
  // Assurer que l'URL de l'image est absolue
  const fullImageUrl = image.startsWith('http') 
    ? image 
    : `https://www.association-rbe.fr${image}`;
  
  // Assurer que l'URL est absolue
  const canonicalUrl = url.startsWith('http') 
    ? url 
    : `https://www.association-rbe.fr${url}`;

  // JSON-LD par défaut (Organisation)
  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RétroBus Essonne",
    "alternateName": "RBE",
    "url": "https://www.association-rbe.fr",
    "logo": "https://www.association-rbe.fr/favicon_rbe.png",
    "description": "Association loi 1901 de préservation et valorisation du patrimoine automobile en Île-de-France, spécialisée dans les bus et autocars historiques.",
    "foundingDate": "2025",
    "email": "contact@association-rbe.fr",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Île-de-France",
      "addressCountry": "FR"
    },
    "sameAs": [
      "https://www.facebook.com/RetrobusEssonne",
      "https://www.instagram.com/retrobus_essonne",
      "https://www.youtube.com/@RetrobusEssonne"
    ],
    "memberOf": {
      "@type": "Organization",
      "name": "Associations de préservation du patrimoine français"
    }
  };

  const structuredData = jsonLd || defaultJsonLd;

  return (
    <Helmet>
      {/* Balises Meta de base */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Langue et localisation */}
      <html lang="fr" />
      <meta property="og:locale" content={locale} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />}
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      {/* Open Graph (Facebook, LinkedIn) */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:secure_url" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@RetrobusEssonne" />
      <meta name="twitter:creator" content="@RetrobusEssonne" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Thème */}
      <meta name="theme-color" content="#D32F2F" />
      <meta name="msapplication-TileColor" content="#D32F2F" />
      
      {/* Données structurées JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}

/**
 * Données structurées prédéfinies pour différents types de pages
 */
export const jsonLdSchemas = {
  /**
   * Page À propos / Organisation
   */
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RétroBus Essonne",
    "alternateName": "RBE",
    "url": "https://www.association-rbe.fr",
    "logo": "https://www.association-rbe.fr/favicon_rbe.png",
    "description": "Association loi 1901 de préservation et valorisation du patrimoine automobile en Île-de-France, spécialisée dans les bus et autocars historiques.",
    "foundingDate": "2025",
    "email": "contact@association-rbe.fr",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Île-de-France",
      "addressCountry": "FR"
    }
  },

  /**
   * Page Événement
   */
  event: (eventData) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    "name": eventData.title,
    "description": eventData.description,
    "startDate": eventData.date,
    "endDate": eventData.date,
    "location": {
      "@type": "Place",
      "name": eventData.location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": eventData.location,
        "addressRegion": "Île-de-France",
        "addressCountry": "FR"
      }
    },
    "image": eventData.image || "https://www.association-rbe.fr/assets/photos/ma-photo-hero.jpg",
    "organizer": {
      "@type": "Organization",
      "name": "RétroBus Essonne",
      "url": "https://www.association-rbe.fr"
    },
    "offers": eventData.adultPrice ? {
      "@type": "Offer",
      "price": eventData.adultPrice,
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "url": eventData.helloAssoUrl || "https://www.association-rbe.fr/events"
    } : undefined
  }),

  /**
   * Page Véhicule (Produit de collection)
   */
  vehicle: (vehicleData) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${vehicleData.marque} ${vehicleData.modele}`,
    "description": vehicleData.description,
    "image": vehicleData.thumbnailImage || vehicleData.backgroundImage,
    "brand": {
      "@type": "Brand",
      "name": vehicleData.marque
    },
    "category": "Véhicule de collection",
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/PreOrder",
      "itemCondition": "https://schema.org/UsedCondition"
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Mise en circulation",
        "value": vehicleData.miseEnCirculation
      },
      {
        "@type": "PropertyValue",
        "name": "Énergie",
        "value": vehicleData.energie
      },
      {
        "@type": "PropertyValue",
        "name": "Immatriculation",
        "value": vehicleData.immat
      }
    ]
  }),

  /**
   * Page Contact
   */
  contactPage: {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact RétroBus Essonne",
    "description": "Contactez l'association RétroBus Essonne pour toute question ou demande d'information.",
    "url": "https://www.association-rbe.fr/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "RétroBus Essonne",
      "email": "contact@association-rbe.fr"
    }
  },

  /**
   * Article de blog / Actualité
   */
  article: (articleData) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": articleData.title,
    "description": articleData.description,
    "image": articleData.image,
    "datePublished": articleData.publishedAt,
    "dateModified": articleData.updatedAt || articleData.publishedAt,
    "author": {
      "@type": "Organization",
      "name": "RétroBus Essonne"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RétroBus Essonne",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.association-rbe.fr/favicon_rbe.png"
      }
    }
  }),

  /**
   * Collection d'articles (Liste d'événements, galerie)
   */
  itemList: (items, listName) => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": listName,
    "numberOfItems": items.length,
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Thing",
        "name": item.name,
        "url": item.url,
        "image": item.image
      }
    }))
  })
};
