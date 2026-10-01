import React, { useEffect, useState } from 'react';
import { Box, Container, Flex, Heading, Image, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { FiMapPin } from 'react-icons/fi';
import SEO from '../components/SEO';

const journey = [
  { period: '2001 - 2014', operator: 'Cars Bridet puis Transdev Bièvre Bus Mobilités', place: 'Wissous' },
  { period: '2014 - 2020', operator: 'Transdev STRAV', place: 'Limeil-Brévannes' },
  { period: '2021 - 2025', operator: 'Cars Soeur, groupe Nedroma', place: 'Saint-Germain-lès-Corbeil' },
  { period: 'Depuis 2025', operator: 'RétroBus Essonne', place: 'Essonne' },
];

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://attractive-kindness-rbe-serveurs.up.railway.app';

const fallbackSpecifications = [
  ['Le véhicule', 'Mercedes-Benz Citaro'],
  ['Sur la route depuis', 'Juillet 2001'],
  ['Sa taille', 'Autobus urbain de 11,95 m'],
  ['À bord', 'Jusqu’à 96 voyageurs'],
  ['Accessibilité', '1 place pour fauteuil roulant'],
  ['Aujourd’hui', 'Préservé par RétroBus Essonne'],
];

function parseCharacteristics(characteristics) {
  if (Array.isArray(characteristics)) return characteristics;
  if (typeof characteristics !== 'string') return [];

  try {
    const parsed = JSON.parse(characteristics);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function buildPublicSpecifications(vehicle) {
  const entries = parseCharacteristics(vehicle?.caracteristiques);
  const values = new Map(entries.map(({ label, value }) => [String(label).trim(), String(value).trim()]));
  const get = (label, fallback) => values.get(label) || fallback;
  const seatedPlaces = Number.parseInt(get('Places assises', ''), 10);
  const standingPlaces = Number.parseInt(get('Places debout', ''), 10);
  const passengerCapacity = Number.isFinite(seatedPlaces) && Number.isFinite(standingPlaces)
    ? `Jusqu’à ${seatedPlaces + standingPlaces} voyageurs`
    : 'Capacité d’origine à venir';
  const manufacturer = vehicle?.marque || get('Constructeur', 'Mercedes-Benz');
  const model = vehicle?.modele || get('Modèle', 'Citaro');
  const length = get('Longueur', '11,95 m');
  const ufrPlaces = get('UFR', '');

  return [
    ['Le véhicule', `${manufacturer} ${model}`],
    ['Sur la route depuis', get('Mise en circulation', 'Juillet 2001')],
    ['Sa taille', `Autobus urbain de ${length}`],
    ['À bord', passengerCapacity],
    ['Accessibilité', ufrPlaces ? `${ufrPlaces} place pour fauteuil roulant` : 'Information à venir'],
    ['Aujourd’hui', get('Préservé par', '') ? `Préservé par ${get('Préservé par', '')}` : get('Statut', 'Préservé par RétroBus Essonne')],
  ];
}

export default function Vehicle920Test() {
  const [specifications, setSpecifications] = useState(fallbackSpecifications);

  useEffect(() => {
    let active = true;

    fetch(`${API_BASE_URL}/public/vehicles/920`, { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((vehicle) => {
        if (active && vehicle) setSpecifications(buildPublicSpecifications(vehicle));
      })
      .catch(() => {});

    return () => { active = false; };
  }, []);

  return (
    <>
      <SEO title="920 | Fiche véhicule test | RétroBus Essonne" description="Aperçu de la future fiche véhicule modernisée du Mercedes-Benz Citaro 920." url="https://www.association-rbe.fr/vehicles/920-test" />

      <Box
        className="full-bleed"
        bg="#011537"
        color="white"
        overflow="hidden"
        mt={{ base: 0, md: '-24px' }}
      >
        <Box bg="#011537" overflow="hidden">
          <Image
            src="/assets/photos/920-hero.jpg"
            alt="Mercedes-Benz Citaro 920 préservé par RétroBus Essonne"
            w="full"
            h={{ base: '220px', md: '360px' }}
            objectFit="cover"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/assets/photos/p1-960.jpg';
            }}
          />
        </Box>

        <Container maxW="container.xl" py={{ base: 7, md: 10 }}>
          <SimpleGrid columns={{ base: 1, lg: '1.1fr 1fr' }} spacing={{ base: 6, lg: 12 }} alignItems="center">
            <Box>
              <Text color="#d30c4c" fontWeight="700" fontSize="sm" textTransform="uppercase" letterSpacing="0.8px">Une histoire francilienne</Text>
              <Heading as="h2" size="lg" mt={2}>Plus de vingt ans de service</Heading>
              <Text color="gray.300" lineHeight="tall" mt={3}>
                Aujourd’hui préservé par RétroBus Essonne.
              </Text>
            </Box>
            <SimpleGrid columns={2} spacing={0} borderTop="1px solid" borderLeft="1px solid" borderColor="gray.600" alignSelf="start">
              {[
                ['2001', 'Mise en service'],
                ['4', 'Exploitants'],
                ['25 ans', 'De parcours'],
                ['2025', 'Préservation RBE'],
              ].map(([value, label]) => (
                <Box key={label} bg="#162033" borderRight="1px solid" borderBottom="1px solid" borderColor="gray.600" p={{ base: 3, md: 4 }}>
                  <Text color="#d30c4c" fontSize={{ base: 'lg', md: 'xl' }} fontWeight="700">{value}</Text>
                  <Text color="gray.300" fontSize="sm" mt={1}>{label}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </SimpleGrid>
        </Container>

        <Box bg="#011537" borderTop="1px solid" borderBottom="1px solid" borderColor="gray.600">
          <Container maxW="container.xl" py={{ base: 7, md: 10 }}>
            <Flex align="center" gap={4} mb={5}>
              <FiMapPin color="#3b82f6" />
              <Heading as="h2" size="lg">Parcours</Heading>
              <Box h="1px" bg="gray.600" flex="1" />
            </Flex>
            <Stack spacing={0} borderTop="1px solid" borderColor="gray.600">
              {journey.map((step, index) => (
                <Box key={step.period} py={3} borderBottom="1px solid" borderColor="gray.600">
                  <SimpleGrid columns={{ base: 1, md: '180px 1fr 260px' }} spacing={{ base: 1, md: 6 }} alignItems="center">
                    <Text color="#d30c4c" fontWeight="700">{step.period}</Text>
                    <Text fontWeight="700">{step.operator}</Text>
                    <Text color="gray.300" fontSize="sm" display="flex" alignItems="start" gap={2}><FiMapPin color={index === 3 ? '#10b981' : '#3b82f6'} />{step.place}</Text>
                  </SimpleGrid>
                </Box>
              ))}
            </Stack>
          </Container>
        </Box>

        <Container maxW="container.xl" py={{ base: 7, md: 10 }}>
          <SimpleGrid columns={{ base: 1, lg: '0.8fr 1.2fr' }} spacing={{ base: 6, lg: 12 }} alignItems="center">
            <Box>
              <Text color="#10b981" fontWeight="700" fontSize="sm" textTransform="uppercase" letterSpacing="0.8px">Carte d’identité</Text>
              <Heading as="h2" size="lg" mt={2}>L’essentiel du 920</Heading>
              <Text color="gray.300" lineHeight="tall" mt={3}>Les repères utiles, issus de la fiche technique complète.</Text>
            </Box>
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={2}>
              {specifications.map(([label, value]) => (
                <Box key={label} bg="#162033" borderLeft="3px solid" borderColor="#3b82f6" p={3}>
                  <Text color="gray.300" fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="0.7px">{label}</Text>
                  <Text fontWeight="700" mt={1}>{value}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </SimpleGrid>
        </Container>

      </Box>
    </>
  );
}