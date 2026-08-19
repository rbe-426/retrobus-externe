import React from 'react';
import { Box, Container, VStack, HStack, Text, Button, SimpleGrid, Card, CardBody, Image } from '@chakra-ui/react';

// Composant Card optimisé mobile
export const MobileCard = ({ image, title, children, action, ...props }) => (
  <Card className="mobile-card mobile-fade-in" {...props}>
    {image && (
      <Image 
        src={image} 
        alt={title}
        className="mobile-card-image"
      />
    )}
    <CardBody className="mobile-card-content">
      {title && (
        <Text className="mobile-card-title">{title}</Text>
      )}
      <Box className="mobile-card-text">
        {children}
      </Box>
      {action && (
        <Box mt={4}>
          {action}
        </Box>
      )}
    </CardBody>
  </Card>
);

// Composant Section optimisé mobile
export const MobileSection = ({ title, children, ...props }) => (
  <Box className="mobile-section" {...props}>
    {title && (
      <Text className="mobile-section-title">{title}</Text>
    )}
    {children}
  </Box>
);

// Composant Grid responsive
export const MobileGrid = ({ columns = 1, children, ...props }) => (
  <Box 
    className={`mobile-grid ${columns === 2 ? 'mobile-grid-2' : ''}`}
    {...props}
  >
    {children}
  </Box>
);

// Composant Button mobile-friendly
export const MobileButton = ({ variant = 'primary', children, ...props }) => (
  <Button 
    className={`mobile-btn mobile-btn-${variant} mobile-scale-on-tap`}
    {...props}
  >
    {children}
  </Button>
);

// Composant Container mobile avec padding adaptatif
export const MobileContainer = ({ children, ...props }) => (
  <Container 
    maxW="100%" 
    px={{ base: 4, md: 8 }}
    py={{ base: 4, md: 6 }}
    {...props}
  >
    {children}
  </Container>
);

// Hook pour détecter mobile
export const useMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 769);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};