import React from 'react';
import { Image as ChakraImage } from '@chakra-ui/react';

/**
 * Composant Image compatible qui gère différents formats d'images
 * avec fallback automatique
 */
const CompatImg = ({ 
  path, 
  alt = '', 
  className = '', 
  style = {},
  fallback = '/assets/fallback/_MG_1006.jpg',
  ...props 
}) => {
  const [currentSrc, setCurrentSrc] = React.useState(path);
  
  const handleError = () => {
    if (currentSrc !== fallback && fallback) {
      setCurrentSrc(fallback);
    }
  };

  // Si aucun path fourni, utiliser le fallback
  const imageSrc = currentSrc || fallback;

  return (
    <ChakraImage
      src={imageSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
};

export default CompatImg;