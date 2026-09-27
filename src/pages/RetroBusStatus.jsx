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
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import {
  FiActivity,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDatabase,
  FiGlobe,
  FiRefreshCw,
  FiServer,
  FiSettings,
  FiSmartphone,
} from 'react-icons/fi';
import { API_BASE } from '../lib/api';
import SEO from '../components/SEO';

const HEALTH_CHECK_INTERVAL_MS = 60_000;
const REQUEST_TIMEOUT_MS = 8_000;
const PUBLIC_API_BASE = API_BASE.replace(/\/$/, '');

const apiServices = [
  {
    id: 'health',
    name: 'API RétroBus',
    detail: 'Disponibilité générale des services de données publics',
    icon: FiServer,
    url: `${PUBLIC_API_BASE}/health`,
    requiresHealthPayload: true,
  },
  {
    id: 'configuration',
    name: 'Configuration du site',
    detail: 'Informations et réglages publics du site',
    icon: FiSettings,
    url: `${PUBLIC_API_BASE}/site-config`,
  },
  {
    id: 'vehicles',
    name: 'Catalogue véhicules',
    detail: 'Données publiques du parc RétroBus',
    icon: FiDatabase,
    url: `${PUBLIC_API_BASE}/public/vehicles`,
  },
  {
    id: 'events',
    name: 'Événements',
    detail: 'Programme public et inscriptions aux événements',
    icon: FiCalendar,
    url: `${PUBLIC_API_BASE}/public/events`,
  },
];

const urbexServices = [
  {
    id: 'urbexHealth',
    name: 'Santé d’URBEX',
    detail: 'Disponibilité de l’API opérationnelle RétroBus',
    icon: FiSmartphone,
    url: 'https://www.retrobus-interne.fr/api/health',
    requiresHealthPayload: true,
  },
];

const allServices = [...apiServices, ...urbexServices];

const formatCheckedAt = (date) => date?.toLocaleTimeString('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

const statusLabel = (state) => {
  if (state === 'operational') return 'Opérationnel';
  if (state === 'checking') return 'Vérification';
  return 'Indisponible';
};

function StatusBadge({ state }) {
  const colorScheme = state === 'operational' ? 'green' : state === 'checking' ? 'blue' : 'red';
  return <Badge colorScheme={colorScheme} px={2.5} py={1} borderRadius="full" textTransform="none">{statusLabel(state)}</Badge>;
}

function ApiServiceRow({ service, result }) {
  const state = result?.state || 'checking';
  const isOperational = state === 'operational';
  const isChecking = state === 'checking';
  const color = isOperational ? 'green.600' : isChecking ? 'blue.600' : 'red.600';
  const background = isOperational ? 'green.50' : isChecking ? 'blue.50' : 'red.50';

  return (
    <Flex align={{ base: 'flex-start', sm: 'center' }} justify="space-between" gap={4} py={5} direction={{ base: 'column', sm: 'row' }}>
      <HStack spacing={4} align="flex-start">
        <Flex align="center" justify="center" boxSize="42px" borderRadius="6px" bg={background} color={color} flexShrink={0}>
          <Icon as={service.icon} boxSize={5} />
        </Flex>
        <Box>
          <Heading as="h3" size="sm" color="#14213d">{service.name}</Heading>
          <Text mt={1} color="gray.600" fontSize="sm">{service.detail}</Text>
        </Box>
      </HStack>
      <HStack spacing={3} pl={{ base: 14, sm: 0 }} flexShrink={0}>
        {typeof result?.latency === 'number' && <Text color="gray.500" fontSize="sm">{result.latency} ms</Text>}
        <StatusBadge state={state} />
      </HStack>
    </Flex>
  );
}

export default function RetroBusStatus() {
  const [results, setResults] = useState({});
  const [checkedAt, setCheckedAt] = useState(null);
  const [history, setHistory] = useState([]);

  const checkService = async (service) => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const startedAt = performance.now();

    try {
      const response = await fetch(service.url, { cache: 'no-store', signal: controller.signal });
      const payload = service.requiresHealthPayload ? await response.json().catch(() => null) : null;
      return {
        latency: Math.round(performance.now() - startedAt),
        state: response.ok && (!service.requiresHealthPayload || payload?.ok === true) ? 'operational' : 'unavailable',
      };
    } catch {
      return { latency: null, state: 'unavailable' };
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const checkPublicApi = useCallback(async () => {
    setResults(Object.fromEntries(allServices.map((service) => [service.id, { state: 'checking', latency: null }])));
    const checks = await Promise.all(allServices.map(async (service) => [service.id, await checkService(service)]));
    const nextResults = Object.fromEntries(checks);
    const checkTime = new Date();
    setResults(nextResults);
    setCheckedAt(checkTime);
    setHistory((previous) => [...previous, { checkedAt: checkTime, results: nextResults }].slice(-12));
  }, []);

  useEffect(() => {
    checkPublicApi();
    const interval = window.setInterval(checkPublicApi, HEALTH_CHECK_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [checkPublicApi]);

  const checking = !checkedAt || allServices.some((service) => results[service.id]?.state === 'checking');
  const unavailableServices = allServices.filter((service) => results[service.id]?.state === 'unavailable');
  const allOperational = checkedAt && !checking && unavailableServices.length === 0;

  return (
    <>
      <SEO
        title="État des services publics | RétroBus Essonne"
        description="Consultez la disponibilité des données et services publics de RétroBus Essonne."
        url="https://www.association-rbe.fr/retrobus-status"
        noIndex
      />

      <Box minH="calc(100vh - var(--header-h))" bg="#f4f7fa" py={{ base: 8, md: 14 }}>
        <Container maxW="container.lg">
          <VStack align="stretch" spacing={7}>
            <Flex justify="space-between" align={{ base: 'flex-start', sm: 'center' }} gap={4} direction={{ base: 'column', sm: 'row' }}>
              <HStack spacing={3}>
                <Flex boxSize="44px" borderRadius="6px" bg="#9f063a" color="white" align="center" justify="center"><Icon as={FiActivity} boxSize={5} /></Flex>
                <Box>
                  <Text color="#9f063a" fontWeight="700" fontSize="sm" textTransform="uppercase">RétroBus Essonne</Text>
                  <Heading as="h1" size="lg" color="#14213d">État des services publics</Heading>
                </Box>
              </HStack>
              <Button leftIcon={checking ? <Spinner size="xs" /> : <FiRefreshCw />} onClick={checkPublicApi} isDisabled={checking} variant="outline" borderColor="gray.300" color="#14213d" size="sm">Actualiser</Button>
            </Flex>

            <Box borderLeft="5px solid" borderColor={allOperational ? 'green.400' : checking ? 'blue.400' : 'orange.400'} bg="white" px={{ base: 5, md: 7 }} py={6} boxShadow="sm">
              <HStack align="flex-start" spacing={4}>
                <Icon as={allOperational ? FiCheckCircle : FiActivity} color={allOperational ? 'green.500' : checking ? 'blue.500' : 'orange.500'} boxSize={7} mt={1} />
                <Box>
                  <Heading size="md" color="#14213d">{allOperational ? 'Les données publiques sont disponibles' : checking ? 'Vérification des services publics en cours' : 'Disponibilité partielle des données publiques'}</Heading>
                  <Text color="gray.600" mt={1}>{allOperational ? 'Les vérifications en direct n’indiquent aucune interruption.' : checking ? 'Nous contrôlons les endpoints utilisés par le site public.' : `${unavailableServices.length} composant${unavailableServices.length > 1 ? 's' : ''} de données ne répond${unavailableServices.length > 1 ? 'ent' : ''} pas actuellement.`}</Text>
                </Box>
              </HStack>
            </Box>

            <Box bg="white" boxShadow="sm">
              <Flex px={{ base: 5, md: 7 }} py={5} align="center" gap={3} borderBottom="1px solid" borderColor="gray.100">
                <Flex boxSize="38px" align="center" justify="center" borderRadius="6px" bg="blue.50" color="blue.600"><Icon as={FiGlobe} boxSize={5} /></Flex>
                <Box><Heading as="h2" size="md" color="#14213d">API du site public</Heading><Text color="gray.600" fontSize="sm">Données utilisées par le site association-rbe.fr</Text></Box>
              </Flex>
              <Box px={{ base: 5, md: 7 }}>{apiServices.map((service, index) => <React.Fragment key={service.id}><ApiServiceRow service={service} result={results[service.id]} />{index < apiServices.length - 1 && <Divider />}</React.Fragment>)}</Box>
            </Box>

            <Box bg="white" boxShadow="sm">
              <Flex px={{ base: 5, md: 7 }} py={4} align="center" gap={3} borderBottom="1px solid" borderColor="gray.100">
                <Flex boxSize="34px" align="center" justify="center" borderRadius="6px" bg="gray.50" color="gray.600"><Icon as={FiSmartphone} boxSize={4} /></Flex>
                <Box><Heading as="h2" size="sm" color="#14213d">Santé d’URBEX</Heading><Text color="gray.600" fontSize="sm">API opérationnelle RétroBus</Text></Box>
              </Flex>
              <Box px={{ base: 5, md: 7 }}>{urbexServices.map((service) => <ApiServiceRow key={service.id} service={service} result={results[service.id]} />)}</Box>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box bg="white" p={5} boxShadow="sm"><HStack color="gray.500" fontSize="sm" spacing={2}><Icon as={FiClock} /><Text>Dernière vérification</Text></HStack><Text mt={2} fontWeight="700" color="#14213d">{formatCheckedAt(checkedAt) || 'En attente'}</Text></Box>
              <Box bg="white" p={5} boxShadow="sm"><Text color="gray.500" fontSize="sm">Surveillance</Text><Text mt={2} fontWeight="700" color="#14213d">Mise à jour automatique chaque minute</Text></Box>
            </SimpleGrid>

            <Box bg="white" p={{ base: 5, md: 7 }} boxShadow="sm">
              <Flex align="center" justify="space-between" gap={4} wrap="wrap">
                <Box><Heading size="sm" color="#14213d">Historique de cette session</Heading><Text mt={1} color="gray.600" fontSize="sm">Les 12 dernières vérifications effectuées dans cet onglet.</Text></Box>
                <HStack spacing={1.5} aria-label="Historique des vérifications">{history.length === 0 ? <Text fontSize="sm" color="gray.500">En attente</Text> : history.map((entry) => { const isAvailable = allServices.every((service) => entry.results[service.id]?.state === 'operational'); return <Tooltip key={entry.checkedAt.getTime()} label={`${formatCheckedAt(entry.checkedAt)} - ${isAvailable ? 'APIs disponibles' : 'Disponibilité partielle'}`}><Box boxSize="18px" borderRadius="3px" bg={isAvailable ? 'green.400' : 'orange.400'} /></Tooltip>; })}</HStack>
              </Flex>
            </Box>

            <Stack spacing={1} textAlign="center" color="gray.500" fontSize="sm" pt={2}><Text>Cette page contrôle uniquement des endpoints API accessibles publiquement.</Text><Text>L’historique est conservé uniquement pendant votre session de navigation.</Text></Stack>
          </VStack>
        </Container>
      </Box>
    </>
  );
}