import React, { useCallback, useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiActivity, FiCheckCircle, FiClock, FiExternalLink, FiRefreshCw, FiServer, FiSmartphone, FiWifiOff } from 'react-icons/fi';
import { API_BASE } from '../lib/api';
import SEO from '../components/SEO';

const HEALTH_CHECK_INTERVAL_MS = 60_000;
const URBEX_HEALTH_URL = 'https://www.retrobus-interne.fr/api/health';

const formatCheckedAt = (date) => date?.toLocaleTimeString('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

function ServiceRow({ icon, name, detail, state, latency, href, linkLabel }) {
  const isOperational = state === 'operational';
  const isChecking = state === 'checking';

  return (
    <Flex
      align={{ base: 'flex-start', sm: 'center' }}
      justify="space-between"
      gap={4}
      py={5}
      direction={{ base: 'column', sm: 'row' }}
    >
      <HStack spacing={4} align="flex-start">
        <Flex
          align="center"
          justify="center"
          boxSize="42px"
          borderRadius="6px"
          bg={isOperational ? 'green.50' : isChecking ? 'blue.50' : 'red.50'}
          color={isOperational ? 'green.600' : isChecking ? 'blue.600' : 'red.600'}
          flexShrink={0}
        >
          <Icon as={icon} boxSize={5} />
        </Flex>
        <Box>
          <Heading as="h2" size="sm" color="#14213d">{name}</Heading>
          <Text mt={1} color="gray.600" fontSize="sm">{detail}</Text>
        </Box>
      </HStack>
      <HStack spacing={3} pl={{ base: 14, sm: 0 }}>
        {typeof latency === 'number' && <Text fontSize="sm" color="gray.500">{latency} ms</Text>}
        <Badge
          colorScheme={isOperational ? 'green' : isChecking ? 'blue' : 'red'}
          px={2.5}
          py={1}
          borderRadius="full"
          textTransform="none"
        >
          {isOperational ? 'Opérationnel' : isChecking ? 'Vérification' : 'Indisponible'}
        </Badge>
        {href && (
          <Button as="a" href={href} target="_blank" rel="noopener noreferrer" size="xs" variant="ghost" rightIcon={<FiExternalLink />}>
            {linkLabel}
          </Button>
        )}
      </HStack>
    </Flex>
  );
}

export default function RetroBusStatus() {
  const [apiState, setApiState] = useState('checking');
  const [latency, setLatency] = useState(null);
  const [urbexState, setUrbexState] = useState('checking');
  const [urbexLatency, setUrbexLatency] = useState(null);
  const [checkedAt, setCheckedAt] = useState(null);

  const checkHealth = async (url) => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8_000);
    const startedAt = performance.now();

    try {
      const response = await fetch(url, { cache: 'no-store', signal: controller.signal });
      const payload = await response.json().catch(() => null);
      return { latency: Math.round(performance.now() - startedAt), state: response.ok && payload?.ok === true ? 'operational' : 'unavailable' };
    } catch {
      return { latency: null, state: 'unavailable' };
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const checkApiStatus = useCallback(async () => {
    setApiState('checking');
    setLatency(null);
    setUrbexState('checking');
    setUrbexLatency(null);

    const [apiHealth, urbexHealth] = await Promise.all([
      checkHealth(`${API_BASE.replace(/\/$/, '')}/health`),
      checkHealth(URBEX_HEALTH_URL),
    ]);
    setApiState(apiHealth.state);
    setLatency(apiHealth.latency);
    setUrbexState(urbexHealth.state);
    setUrbexLatency(urbexHealth.latency);
    setCheckedAt(new Date());
  }, []);

  useEffect(() => {
    checkApiStatus();
    const interval = window.setInterval(checkApiStatus, HEALTH_CHECK_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [checkApiStatus]);

  const everythingOperational = apiState === 'operational' && urbexState === 'operational';
  const checking = apiState === 'checking' || urbexState === 'checking';

  return (
    <>
      <SEO
        title="État des services | RétroBus Essonne"
        description="Consultez en temps réel la disponibilité du site et des services RétroBus Essonne."
        url="https://www.association-rbe.fr/retrobus-status"
        noIndex
      />

      <Box minH="calc(100vh - var(--header-h))" bg="#f4f7fa" py={{ base: 8, md: 14 }}>
        <Container maxW="container.md">
          <VStack align="stretch" spacing={8}>
            <Flex justify="space-between" align={{ base: 'flex-start', sm: 'center' }} gap={4} direction={{ base: 'column', sm: 'row' }}>
              <HStack spacing={3}>
                <Flex boxSize="44px" borderRadius="6px" bg="#9f063a" color="white" align="center" justify="center">
                  <Icon as={FiActivity} boxSize={5} />
                </Flex>
                <Box>
                  <Text color="#9f063a" fontWeight="700" fontSize="sm" textTransform="uppercase">RétroBus Essonne</Text>
                  <Heading as="h1" size="lg" color="#14213d">État des services</Heading>
                </Box>
              </HStack>
              <Button
                leftIcon={checking ? <Spinner size="xs" /> : <FiRefreshCw />}
                onClick={checkApiStatus}
                isDisabled={checking}
                variant="outline"
                borderColor="gray.300"
                color="#14213d"
                size="sm"
              >
                Actualiser
              </Button>
            </Flex>

            <Box borderLeft="5px solid" borderColor={everythingOperational ? 'green.400' : checking ? 'blue.400' : 'red.400'} bg="white" px={{ base: 5, md: 7 }} py={6} boxShadow="sm">
              <HStack align="flex-start" spacing={4}>
                <Icon as={everythingOperational ? FiCheckCircle : checking ? FiActivity : FiWifiOff} color={everythingOperational ? 'green.500' : checking ? 'blue.500' : 'red.500'} boxSize={7} mt={1} />
                <Box>
                  <Heading size="md" color="#14213d">
                    {everythingOperational ? 'Tous les services sont opérationnels' : checking ? 'Vérification des services en cours' : 'Un service nécessite votre attention'}
                  </Heading>
                  <Text color="gray.600" mt={1}>
                    {everythingOperational ? 'Les vérifications en direct ne signalent aucune interruption.' : checking ? 'Nous interrogeons les services RétroBus Essonne.' : 'La connexion à l’API RétroBus Essonne a échoué lors de la dernière vérification.'}
                  </Text>
                </Box>
              </HStack>
            </Box>

            <Box bg="white" px={{ base: 5, md: 7 }} boxShadow="sm">
              <ServiceRow icon={FiActivity} name="Site public" detail="association-rbe.fr et ses pages publiques" state="operational" />
              <Divider />
              <ServiceRow icon={FiServer} name="API RétroBus" detail="Données publiques, événements et inscriptions" state={apiState} latency={latency} />
              <Divider />
              <ServiceRow
                icon={FiSmartphone}
                name="URBEX et pointage"
                detail="Espace interne de suivi, de pointage et de gestion du parc"
                state={urbexState}
                latency={urbexLatency}
                href="https://www.retrobus-interne.fr/login"
                linkLabel="Ouvrir URBEX"
              />
            </Box>

            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
              <Box bg="white" p={5} boxShadow="sm">
                <HStack color="gray.500" fontSize="sm" spacing={2}><Icon as={FiClock} /><Text>Dernière vérification</Text></HStack>
                <Text mt={2} fontWeight="700" color="#14213d">{formatCheckedAt(checkedAt) || 'En attente'}</Text>
              </Box>
              <Box bg="white" p={5} boxShadow="sm">
                <Text color="gray.500" fontSize="sm">Surveillance</Text>
                <Text mt={2} fontWeight="700" color="#14213d">Mise à jour automatique chaque minute</Text>
              </Box>
            </SimpleGrid>

            <Stack spacing={1} textAlign="center" color="gray.500" fontSize="sm" pt={2}>
              <Text>Cette page vérifie la disponibilité technique des services publics.</Text>
              <Text>Pour signaler un problème persistant, contactez l’association.</Text>
            </Stack>
          </VStack>
        </Container>
      </Box>
    </>
  );
}