import React, { useState, useEffect } from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  VStack,
  Box,
  Collapse,
  useDisclosure
} from '@chakra-ui/react';

const API_URL = import.meta.env.VITE_API_URL || 'https://attractive-kindness-rbe-serveurs.up.railway.app';

const FLASH_TYPES = {
  info: 'info',
  warning: 'warning', 
  success: 'success',
  error: 'error'
};

export default function FlashBanner() {
  const [flashes, setFlashes] = useState([]);
  const [dismissedFlashes, setDismissedFlashes] = useState(new Set());

  // Charger les flashs publics
  const fetchFlashes = async () => {
    try {
      const response = await fetch(`${API_URL}/public/flashes`);
      if (response.ok) {
        const data = await response.json();
        setFlashes(data || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des flashs:', error);
    }
  };

  useEffect(() => {
    fetchFlashes();
    // Rafraîchir toutes les 5 minutes
    const interval = setInterval(fetchFlashes, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Récupérer les flashs dismissed du localStorage
  useEffect(() => {
    const dismissed = localStorage.getItem('rbe-dismissed-flashes');
    if (dismissed) {
      try {
        setDismissedFlashes(new Set(JSON.parse(dismissed)));
      } catch (e) {
        console.warn('Erreur parsing dismissed flashes:', e);
      }
    }
  }, []);

  // Dismiss un flash
  const dismissFlash = (flashId) => {
    const newDismissed = new Set([...dismissedFlashes, flashId]);
    setDismissedFlashes(newDismissed);
    localStorage.setItem('rbe-dismissed-flashes', JSON.stringify([...newDismissed]));
  };

  // Filtrer les flashs actifs non dismissed
  const activeFlashes = flashes.filter(flash => 
    flash.active && 
    !dismissedFlashes.has(flash.id) &&
    (!flash.expiresAt || new Date(flash.expiresAt) > new Date())
  );

  if (activeFlashes.length === 0) {
    return null;
  }

  return (
    <Box position="relative" zIndex="banner" bg="transparent">
      <VStack spacing={2} align="stretch">
        {activeFlashes.map((flash) => (
          <Alert
            key={flash.id}
            status={FLASH_TYPES[flash.type] || 'info'}
            variant="left-accent"
            borderRadius="md"
            boxShadow="md"
          >
            <AlertIcon />
            <Box flex="1">
              <AlertDescription fontSize="sm">
                {flash.content}
              </AlertDescription>
            </Box>
            <CloseButton
              alignSelf="flex-start"
              position="relative"
              right={-1}
              top={-1}
              onClick={() => dismissFlash(flash.id)}
            />
          </Alert>
        ))}
      </VStack>
    </Box>
  );
}