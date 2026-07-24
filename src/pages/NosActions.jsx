import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Badge,
  Box,
  Container,
  Divider,
  Heading,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiArchive, FiBookOpen, FiMapPin, FiTool, FiUsers } from 'react-icons/fi';

const actions = [
  {
    date: '2026',
    category: 'Transmission',
    title: 'Faire vivre la mémoire des réseaux',
    description: 'Nos contenus, archives et récits donnent une place durable aux véhicules, aux lignes et aux personnes qui ont marqué le transport francilien.',
    image: '/assets/photos/ma-photo-hero-1600.jpg',
    icon: FiBookOpen,
  },
  {
    date: '2026',
    category: 'Patrimoine',
    title: 'Préserver les véhicules qui racontent une époque',
    description: 'Chaque action de sauvegarde commence par l observation, la documentation et le soin apporté aux détails qui font l identité d un autobus historique.',
    image: '/assets/photos/920-cars-soeur.jpg',
    icon: FiArchive,
  },
  {
    date: '2025 - aujourd hui',
    category: 'Technique',
    title: 'Entretenir, restaurer, remettre en valeur',
    description: 'Les interventions techniques accompagnent les véhicules sur la durée afin de les conserver, les présenter et les faire découvrir dans de bonnes conditions.',
    image: '/assets/photos/920-premiere-livree.jpg',
    icon: FiTool,
  },
  {
    date: 'Au fil de l annee',
    category: 'Partage',
    title: 'Aller a la rencontre du public',
    description: 'Sorties, expositions et temps d échange permettent de rapprocher les passionnés, les curieux et les générations qui ont connu ces réseaux.',
    image: '/assets/photos/920-strav-limeil.jpg',
    icon: FiUsers,
  },
];

const themes = [
  { label: 'Sauvegarder', detail: 'documenter et conserver', icon: FiArchive },
  { label: 'Restaurer', detail: 'faire durer les véhicules', icon: FiTool },
  { label: 'Partager', detail: 'raconter au plus grand nombre', icon: FiUsers },
  { label: 'Faire circuler', detail: 'créer des rencontres', icon: FiMapPin },
];

export default function NosActions() {
  return (
    <>
      <Helmet>
        <title>Nos Actions - RétroBus Essonne</title>
        <meta name="description" content="Carnet de route des actions menées par RétroBus Essonne pour préserver et transmettre le patrimoine des transports." />
      </Helmet>

      <Box bg="white" minH="100vh">
        <Box
          minH={{ base: '430px', md: '560px' }}
          display="flex"
          alignItems="flex-end"
          position="relative"
          bgImage="url('/assets/photos/ma-photo-hero-1600.jpg')"
          bgPosition="center"
          bgSize="cover"
          color="white"
        >
          <Box position="absolute" inset={0} bg="blackAlpha.700" />
          <Container maxW="7xl" position="relative" py={{ base: 12, md: 20 }}>
            <VStack align="start" spacing={5} maxW="3xl">
              <Badge bg="white" color="red.700" px={3} py={1} borderRadius="sm" fontWeight="700">
                Aperçu local
              </Badge>
              <Heading as="h1" fontSize={{ base: '4xl', md: '6xl' }} lineHeight="1.05" letterSpacing={0}>
                Nos Actions
              </Heading>
              <Text fontSize={{ base: 'lg', md: '2xl' }} lineHeight="tall" color="whiteAlpha.900">
                Le carnet de route de RétroBus Essonne : les projets, les gestes et les rencontres qui font avancer notre patrimoine.
              </Text>
            </VStack>
          </Container>
        </Box>

        <Container maxW="7xl" py={{ base: 12, md: 20 }}>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={0} borderTopWidth="1px" borderLeftWidth={{ base: 0, md: '1px' }} borderColor="gray.200" mb={{ base: 14, md: 20 }}>
            {themes.map((theme) => (
              <HStack key={theme.label} spacing={4} py={5} px={{ base: 0, md: 5 }} borderBottomWidth="1px" borderRightWidth={{ base: 0, md: '1px' }} borderColor="gray.200">
                <Icon as={theme.icon} boxSize={6} color="red.600" />
                <Box>
                  <Text fontWeight="700">{theme.label}</Text>
                  <Text fontSize="sm" color="gray.600">{theme.detail}</Text>
                </Box>
              </HStack>
            ))}
          </SimpleGrid>

          <Stack direction={{ base: 'column', lg: 'row' }} align={{ base: 'start', lg: 'end' }} justify="space-between" spacing={6} mb={12}>
            <Box maxW="2xl">
              <Text color="red.600" fontSize="sm" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" mb={3}>Chronologie</Text>
              <Heading as="h2" size="xl" mb={3}>Les actions qui construisent notre histoire</Heading>
              <Text color="gray.600" fontSize="lg" lineHeight="tall">
                Cette page est pensée comme un journal de bord : elle rassemble les avancées, les temps forts et les chantiers qui jalonnent la vie de l association.
              </Text>
            </Box>
            <Text fontSize="sm" color="gray.500" maxW="sm">Les contenus de cette prévisualisation locale peuvent être enrichis à mesure que de nouvelles actions sont menées.</Text>
          </Stack>

          <VStack align="stretch" spacing={{ base: 12, md: 16 }}>
            {actions.map((action, index) => (
              <Box key={action.title} position="relative">
                <SimpleGrid columns={{ base: 1, md: 12 }} spacing={{ base: 5, md: 10 }} alignItems="center">
                  <Box gridColumn={{ md: index % 2 === 0 ? '1 / span 5' : '8 / span 5' }} gridRow={{ md: 1 }}>
                    <Image src={action.image} alt="" w="full" h={{ base: '250px', md: '330px' }} objectFit="cover" />
                  </Box>
                  <Box gridColumn={{ md: index % 2 === 0 ? '7 / span 5' : '1 / span 5' }} gridRow={{ md: 1 }}>
                    <HStack spacing={3} mb={4}>
                      <Text color="red.600" fontWeight="800" fontSize="sm">{action.date}</Text>
                      <Divider orientation="vertical" h={4} borderColor="gray.300" />
                      <HStack spacing={2} color="gray.600">
                        <Icon as={action.icon} boxSize={4} />
                        <Text fontSize="sm" fontWeight="600">{action.category}</Text>
                      </HStack>
                    </HStack>
                    <Heading as="h3" size="lg" mb={4}>{action.title}</Heading>
                    <Text color="gray.600" fontSize="lg" lineHeight="tall">{action.description}</Text>
                  </Box>
                </SimpleGrid>
              </Box>
            ))}
          </VStack>
        </Container>
      </Box>
    </>
  );
}
