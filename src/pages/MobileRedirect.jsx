import React, { useEffect } from 'react';
import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

const DEFAULT_INTRANET_BASE = 'https://app.retrobus-essonne.fr';

export default function MobileRedirect() {
  const { parc } = useParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const intranetBase = (import.meta.env.VITE_INTRANET_BASE || DEFAULT_INTRANET_BASE).replace(/\/+$/, '');
    const target = `${intranetBase}/mobile/v/${encodeURIComponent(parc || '')}${window.location.search || ''}`;

    window.location.replace(target);
  }, [parc]);

  const intranetBase = (import.meta.env.VITE_INTRANET_BASE || DEFAULT_INTRANET_BASE).replace(/\/+$/, '');
  const fallbackHref = `${intranetBase}/mobile/v/${encodeURIComponent(parc || '')}`;

  return (
    <Box py={16}>
      <Container maxW="container.md">
        <VStack spacing={4} textAlign="center">
          <Heading size="md">Redirection vers l'espace mobile...</Heading>
          <Text color="gray.600">Si la redirection ne se lance pas automatiquement, utilisez le bouton ci-dessous.</Text>
          <Button as="a" href={fallbackHref} colorScheme="red">
            Ouvrir la fiche mobile
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}
