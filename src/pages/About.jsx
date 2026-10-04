import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Container, Divider, Heading, Image, SimpleGrid, Stack, Text, VStack } from "@chakra-ui/react";
import SEO, { jsonLdSchemas } from "../components/SEO";

const commitments = [
  ["Préserver", "Identifier, conserver et restaurer des véhicules qui racontent l’histoire des transports collectifs."],
  ["Transmettre", "Partager les savoir-faire, les archives et les récits liés au patrimoine roulant avec tous les publics."],
  ["Faire vivre", "Présenter les véhicules, participer aux rencontres et réunir une communauté autour d’un patrimoine vivant."],
];

export default function About(){
  return (
    <>
      <SEO
        title="À propos de RétroBus Essonne - Notre mission"
        description="RétroBus Essonne est une association loi 1901 qui préserve, restaure et partage le patrimoine roulant des transports en commun en Île-de-France."
        keywords="RétroBus Essonne, association, patrimoine roulant, bus historiques, restauration, Essonne, Île-de-France"
        url="https://www.association-rbe.fr/about"
        image="/assets/photos/p1-960.jpg"
        jsonLd={jsonLdSchemas.organization}
      />

      <Box as="section" position="relative" minH={{ base: "440px", md: "520px" }} overflow="hidden" display="flex" alignItems="end" bg="gray.900">
        <Image src="/assets/photos/p1-960.jpg" alt="Bus préservé par RétroBus Essonne" position="absolute" inset={0} w="full" h="full" objectFit="cover" opacity={0.72} />
        <Box position="absolute" inset={0} bg="blackAlpha.600" />
        <Container position="relative" maxW="7xl" pb={{ base: 12, md: 16 }}>
          <VStack align="start" spacing={4} maxW="3xl" color="white">
            <Text fontWeight="700" fontSize="sm" textTransform="uppercase">RétroBus Essonne</Text>
            <Heading as="h1" size={{ base: "xl", md: "2xl" }}>Préserver les transports qui ont fait nos territoires</Heading>
            <Text fontSize={{ base: "md", md: "xl" }} lineHeight="tall" color="whiteAlpha.900">
              Association loi 1901, nous réunissons des passionnés pour sauvegarder et faire découvrir le patrimoine roulant de l’Essonne et de l’Île-de-France.
            </Text>
          </VStack>
        </Container>
      </Box>

      <Box as="section" bg="white" py={{ base: 12, md: 20 }}>
        <Container maxW="6xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 10, lg: 20 }} alignItems="start">
            <VStack align="start" spacing={5}>
              <Text color="var(--rbe-red)" fontWeight="700" textTransform="uppercase" fontSize="sm">Notre association</Text>
              <Heading as="h2" size="xl">Un patrimoine à entretenir, raconter et partager</Heading>
              <Text color="gray.700" fontSize="lg" lineHeight="tall">
                Un bus ancien n’est pas seulement un véhicule. Il porte les souvenirs de lignes, de quartiers, de trajets quotidiens et de générations d’usagers. RétroBus Essonne s’attache à conserver cette mémoire, avec exigence et enthousiasme.
              </Text>
              <Text color="gray.700" fontSize="lg" lineHeight="tall">
                Notre travail combine recherche historique, entretien, restauration, documentation et rencontres publiques. Chaque projet avance grâce à l’engagement de bénévoles, de membres et de partenaires qui partagent le goût du patrimoine des transports.
              </Text>
            </VStack>
            <Box borderLeft={{ lg: "4px solid" }} borderColor="var(--rbe-red)" pl={{ lg: 8 }}>
              <Text color="gray.500" fontSize="sm" textTransform="uppercase" fontWeight="700" mb={3}>Notre terrain d’action</Text>
              <Heading as="h2" size="lg" mb={4}>Essonne et Île-de-France</Heading>
              <Text color="gray.700" lineHeight="tall">
                Nous nous intéressons aux autobus, autocars et matériels qui ont circulé sur le territoire francilien, à leur histoire technique comme à leur place dans la vie locale. La collection et les projets évoluent au fil des opportunités de sauvegarde.
              </Text>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      <Box as="section" bg="gray.50" py={{ base: 12, md: 18 }}>
        <Container maxW="6xl">
          <VStack align="start" spacing={3} mb={10} maxW="3xl">
            <Text color="var(--rbe-red)" fontWeight="700" textTransform="uppercase" fontSize="sm">Nos engagements</Text>
            <Heading as="h2" size="xl">Ce qui guide nos projets</Heading>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={0} borderTopWidth="1px" borderLeftWidth={{ md: "1px" }} borderColor="gray.200">
            {commitments.map(([title, copy]) => <Box key={title} p={{ base: 6, md: 8 }} bg="white" borderRightWidth={{ md: "1px" }} borderBottomWidth="1px" borderColor="gray.200"><Heading as="h3" size="md" color="var(--rbe-red)" mb={3}>{title}</Heading><Text color="gray.700" lineHeight="tall">{copy}</Text></Box>)}
          </SimpleGrid>
        </Container>
      </Box>

      <Box as="section" bg="white" py={{ base: 12, md: 18 }}>
        <Container maxW="6xl">
          <Stack direction={{ base: "column", lg: "row" }} justify="space-between" align={{ lg: "end" }} spacing={8}>
            <VStack align="start" spacing={4} maxW="3xl">
              <Text color="var(--rbe-red)" fontWeight="700" textTransform="uppercase" fontSize="sm">Prendre part au projet</Text>
              <Heading as="h2" size="xl">Découvrir, soutenir, participer</Heading>
              <Text color="gray.700" fontSize="lg" lineHeight="tall">Parcourez les véhicules, suivez les actualités de l’association ou contactez-nous pour contribuer à la sauvegarde de ce patrimoine.</Text>
            </VStack>
            <Stack direction={{ base: "column", sm: "row" }} spacing={3} flexShrink={0}>
              <Button as={RouterLink} to="/parc" bg="var(--rbe-red)" color="white" _hover={{ bg: "var(--rbe-accent)" }}>Explorer le parc</Button>
              <Button as={RouterLink} to="/contact" variant="outline" borderColor="var(--rbe-red)" color="var(--rbe-red)" _hover={{ bg: "red.50" }}>Nous contacter</Button>
            </Stack>
          </Stack>
          <Divider mt={12} mb={6} />
          <Text fontSize="sm" color="gray.600">Association RétroBus Essonne, association loi 1901. Pour toute question institutionnelle, contactez-nous via la page dédiée.</Text>
        </Container>
      </Box>
    </>
  );
}
