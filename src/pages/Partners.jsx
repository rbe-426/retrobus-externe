import { Box, Button, Container, Flex, Heading, Icon, Image, SimpleGrid, Stack, Text, VStack } from '@chakra-ui/react';
import { FiArrowUpRight, FiBriefcase, FiMapPin, FiTool, FiTruck } from 'react-icons/fi';
import SEO from '../components/SEO';

const partnerGroups = [
  {
    title: 'Partenaires institutionnels',
    accent: '#10b981',
    partners: [
      { name: 'Ville de Corbeil-Essonnes', domain: 'Collectivité territoriale', partnership: 'Partenaire institutionnel', actions: 'Accompagne les projets portés par l’association.', logo: '/supporters/page partenaire/corbeil_partenaire.webp', url: 'https://www.corbeil-essonnes.fr/' },
    ],
  },
  {
    title: 'Transport et mobilité',
    accent: '#3b82f6',
    partners: [
      { name: 'Groupe Nedroma', domain: 'Transport et mobilité', partnership: 'Partenaire de RétroBus Essonne', actions: 'Projet de préservation du Citaro à travers sa filiale Cars Soeur.', logo: '/supporters/page partenaire/logo_nedroma_color_small-n-294w.png', url: 'https://www.nedroma.fr/' },
      { name: 'Cars Soeur', domain: 'Mobilité et transport de voyageurs', partnership: 'Partenaire de RétroBus Essonne', actions: 'Assistance et mise à disposition technique.', logo: '/supporters/page partenaire/cars soeur logo.png', url: 'https://www.cars-soeur.com/' },
    ],
  },
  {
    title: 'Entreprises et mécènes',
    accent: '#d30c4c',
    partners: [
      { name: 'BNP Paribas', domain: 'Banque et services financiers', partnership: 'Partenaire de RétroBus Essonne', actions: 'Finances et compte bancaire.', logo: '/supporters/page partenaire/bnp_partenaire.png', url: 'https://mabanque.bnpparibas/' },
    ],
  },
  {
    title: 'Partenaires techniques',
    accent: '#f59e0b',
    partners: [
      { name: 'Contrôle Plus', domain: 'Contrôle technique de véhicules', partnership: 'Partenaire technique', actions: 'Contrôles techniques.', logo: '/supporters/page partenaire/controleplus_partenaire.png', url: 'https://controleplus.fr/' },
    ],
  },
];

const impactProjects = [
  { icon: FiTruck, title: 'Préservation des véhicules', text: 'Les soutiens reçus contribuent à faire vivre les projets de conservation et de restauration du parc.' },
  { icon: FiMapPin, title: 'Événements et sorties', text: 'Ils accompagnent la rencontre entre le public, les véhicules historiques et leur territoire.' },
  { icon: FiTool, title: 'Transmission des savoir-faire', text: 'Ils renforcent une démarche associative tournée vers la mémoire des transports et les générations futures.' },
];

function PartnerCard({ partner, accent }) {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderTop="3px solid"
      borderTopColor={accent}
      transition="border-color 0.2s, box-shadow 0.2s"
      _hover={{ borderColor: accent, boxShadow: 'md' }}
    >
      <Flex direction={{ base: 'column', sm: 'row' }} minH={{ sm: '220px' }}>
        <Flex w={{ base: 'full', sm: '230px' }} minH={{ base: '130px', sm: 'auto' }} p={6} bg="gray.50" align="center" justify="center" borderBottom={{ base: '1px solid', sm: 'none' }} borderRight={{ base: 'none', sm: '1px solid' }} borderColor="gray.200" flexShrink={0}>
          <Image src={partner.logo} alt={partner.name} maxH="100px" maxW="190px" w="auto" objectFit="contain" />
        </Flex>
        <Box p={6} flex="1">
          <Heading as="h3" size="md" color="#0f172a">{partner.name}</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mt={5}>
            <Box borderLeft="3px solid" borderColor="#3b82f6" pl={3}>
              <Text color="#3b82f6" fontSize="xs" fontWeight="700" letterSpacing="0.8px" textTransform="uppercase">Domaine</Text>
              <Text mt={1} color="gray.600" fontSize="sm">{partner.domain}</Text>
            </Box>
            <Box borderLeft="3px solid" borderColor="#d30c4c" pl={3}>
              <Text color="#d30c4c" fontSize="xs" fontWeight="700" letterSpacing="0.8px" textTransform="uppercase">Partenariat</Text>
              <Text mt={1} color="gray.600" fontSize="sm">{partner.partnership}</Text>
            </Box>
            <Box borderLeft="3px solid" borderColor="#10b981" pl={3}>
              <Text color="#10b981" fontSize="xs" fontWeight="700" letterSpacing="0.8px" textTransform="uppercase">Actions</Text>
              <Text mt={1} color="gray.600" fontSize="sm">{partner.actions}</Text>
            </Box>
          </SimpleGrid>
          <Button as="a" href={partner.url} target="_blank" rel="noopener noreferrer" mt={5} variant="link" color="#d30c4c" rightIcon={<FiArrowUpRight />} fontSize="sm">
            Leur Site web
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}

export default function Partners() {
  return (
    <>
      <SEO title="Nos partenaires | RétroBus Essonne" description="Découvrez les partenaires qui accompagnent RétroBus Essonne dans la préservation du patrimoine roulant." keywords="partenaires, mécénat, soutien, RétroBus Essonne, patrimoine, véhicules historiques" url="https://www.association-rbe.fr/partenaires" />

      <Box bg="#f4f7fa">
        <Box bg="#0f172a" color="white" overflow="hidden">
          <Container maxW="container.xl" py={{ base: 9, md: 12 }} position="relative">
            <Box position="absolute" right={{ base: '-160px', md: '-80px' }} top={{ base: '-210px', md: '-260px' }} boxSize={{ base: '390px', md: '520px' }} border="1px solid" borderColor="whiteAlpha.300" borderRadius="full" opacity={0.7} />
            <Box position="absolute" right={{ base: '-80px', md: '90px' }} top={{ base: '-110px', md: '-140px' }} boxSize={{ base: '230px', md: '320px' }} border="1px solid" borderColor="whiteAlpha.300" borderRadius="full" opacity={0.5} />
            <VStack align="start" spacing={4} maxW="3xl" position="relative">
              <Heading as="h1" size={{ base: 'xl', md: '2xl' }} lineHeight="short">Nos partenaires</Heading>
              <Text fontSize={{ base: 'lg', md: 'xl' }} color="whiteAlpha.900" lineHeight="tall">Celles et ceux qui font avancer RétroBus Essonne.</Text>
              <Text maxW="2xl" color="whiteAlpha.700" lineHeight="tall">La préservation du patrimoine des transports est un projet collectif. Découvrez les entreprises, collectivités et acteurs qui accompagnent l’association dans ses projets.</Text>
            </VStack>
          </Container>
        </Box>

        <Container maxW="container.xl" py={{ base: 10, md: 14 }}>
          <SimpleGrid columns={{ base: 2, md: 4 }} borderTop="1px solid" borderLeft="1px solid" borderColor="gray.200">
            {[
              ['5', 'Partenaires'],
              ['4', 'Entreprises'],
              ['1', 'Collectivité'],
              ['1', 'Territoire'],
            ].map(([value, label]) => (
              <Box key={label} bg="white" borderRight="1px solid" borderBottom="1px solid" borderColor="gray.200" p={{ base: 5, md: 7 }}>
                <Text color="#d30c4c" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700">{value}</Text>
                <Text mt={1} color="gray.600" fontSize="sm">{label}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>

        <Container maxW="container.xl" pb={{ base: 12, md: 20 }}>
          <Stack spacing={{ base: 12, md: 16 }}>
            {partnerGroups.map((group) => (
              <Box key={group.title}>
                <Flex align="center" gap={4} mb={6}>
                  <Box boxSize="12px" borderRadius="full" bg={group.accent} />
                  <Heading as="h2" size="lg" color="#0f172a">{group.title}</Heading>
                  <Box h="1px" bg="gray.300" flex="1" />
                </Flex>
                <Stack spacing={5}>
                  {group.partners.map((partner) => <PartnerCard key={partner.name} partner={partner} accent={group.accent} />)}
                </Stack>
              </Box>
            ))}

            <Box borderTop="1px solid" borderColor="gray.200" pt={{ base: 10, md: 14 }}>
              <VStack align="start" spacing={4} maxW="3xl" mb={8}>
                <Text color="#d30c4c" fontWeight="700" fontSize="sm" letterSpacing="1px" textTransform="uppercase">Des projets concrets</Text>
                <Heading as="h2" size="xl" color="#0f172a">Nos partenaires rendent ces projets possibles</Heading>
                <Text color="gray.600" lineHeight="tall">Leur présence renforce les moyens de l’association et accompagne la mise en valeur d’un patrimoine roulant vivant.</Text>
              </VStack>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                {impactProjects.map((project) => (
                  <Box key={project.title} borderTop="3px solid" borderColor="#d30c4c" pt={5}>
                    <Icon as={project.icon} boxSize={6} color="#3b82f6" />
                    <Heading as="h3" size="md" mt={4} color="#0f172a">{project.title}</Heading>
                    <Text mt={2} color="gray.600" lineHeight="tall">{project.text}</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </Stack>
        </Container>

        <Box bg="#9f063a" color="white">
          <Container maxW="container.xl" py={{ base: 10, md: 14 }}>
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} gap={7}>
              <Box maxW="2xl">
                <Text color="whiteAlpha.800" fontWeight="700" fontSize="sm" letterSpacing="1px" textTransform="uppercase">Rejoindre l’aventure</Text>
                <Heading as="h2" size="xl" mt={2}>Vous souhaitez devenir partenaire de RBE ?</Heading>
                <Text mt={3} color="whiteAlpha.900" lineHeight="tall">Entreprise, collectivité, association ou professionnel : accompagnez la préservation du patrimoine des transports.</Text>
              </Box>
              <Button as="a" href="/contact" leftIcon={<FiBriefcase />} rightIcon={<FiArrowUpRight />} bg="white" color="#9f063a" _hover={{ bg: 'gray.100' }} size="lg">Devenir partenaire de RBE</Button>
            </Flex>
          </Container>
        </Box>
      </Box>
    </>
  );
}