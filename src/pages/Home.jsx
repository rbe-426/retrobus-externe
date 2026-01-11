import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import {
  Box, Button, Container, Heading, SimpleGrid, Stack, Text, Image, VStack, HStack, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure
} from "@chakra-ui/react";
import { useState } from "react";
import pageBg from "../assets/logo_arriere_plan.svg";
import heroImg from "../assets/photos/ma-photo-hero.jpg";

const photos = [
  "/assets/photos/p1.jpg",
  "/assets/photos/p2.jpg",
  "/assets/photos/p3.jpg",
  "/assets/photos/p4.jpg",
  "/assets/photos/p5.jpg",
  "/assets/photos/p6.jpg",
  "/assets/photos/p7.jpg",
  "/assets/photos/p8.jpg",
];

const vehicles = [
  {
    id: 1,
    src: "/assets/photos/p1.jpg",
    marque: "Mercedes",
    modele: "Citaro",
    surnom: "La Dame Grise, numéro 920",
    description: "L'ouverture moderne d'une longue série d'autobus Citaro au monde. il est également climatisé ! ❄️",
    particularite: "Le plus vieux Citaro préservé en France !"
  }];

export default function Home() {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Helmet>
        <title>Association RétroBus Essonne - Patrimoine Transport Francilien | Accueil</title>
        <meta
          name="description"
          content="Association RétroBus Essonne : préservation, restauration et mise en valeur des autobus historiques franciliens. Découvrez notre collection, nos sorties et notre passion pour le patrimoine des transports RATP."
        />
        <meta 
          name="keywords" 
          content="RétroBus Essonne, patrimoine transport, autobus historique, RATP vintage, Mercedes Citaro, transport francilien, restauration véhicules, sorties patrimoine, association 1901, bus collection"
        />
        
        {/* Open Graph */}
        <meta property="og:title" content="Association RétroBus Essonne - Patrimoine Transport Francilien" />
        <meta property="og:description" content="Préservation et restauration des autobus historiques franciliens. Découvrez notre collection et rejoignez nos sorties patrimoine." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://retrobus-essonne.fr" />
        <meta property="og:image" content="https://retrobus-essonne.fr/assets/photos/ma-photo-hero.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:title" content="Association RétroBus Essonne - Patrimoine Transport" />
        <meta name="twitter:description" content="Préservation des autobus historiques franciliens. Collection, restauration et sorties patrimoine." />
        <meta name="twitter:image" content="https://retrobus-essonne.fr/assets/photos/ma-photo-hero.jpg" />
        
        {/* Schema.org pour la page d'accueil */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Accueil - Association RétroBus Essonne",
              "description": "Association de préservation du patrimoine des transports en commun franciliens",
              "url": "https://retrobus-essonne.fr",
              "mainEntity": {
                "@type": "Organization",
                "name": "Association RétroBus Essonne",
                "foundingDate": "1998",
                "description": "Préservation, restauration et mise en valeur des autobus historiques franciliens",
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "Services de l'association",
                  "itemListElement": [
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "Restauration de véhicules historiques",
                        "description": "Restauration complète d'autobus vintage"
                      }
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "Sorties patrimoine",
                        "description": "Balades et expositions avec nos véhicules historiques"
                      }
                    }
                  ]
                }
              }
            }
          `}
        </script>
      </Helmet>

      <Box
        className="page-with-mark home-landing"   // ← ajout de la classe home-landing
        style={{
          "--page-mark": `url(${pageBg})`,
          "--mark-size": "560px",
          "--mark-opacity": "0.06",
          "--mark-blend": "normal",
        }}
        data-pos-x="left"
        data-pos-y="bottom"
      >
        {/* HERO: full-width with optional dev image picker (visible in dev) */}
        <Box
          as="section"
          className="full-bleed hero"
          style={{
            backgroundImage: `url(${heroImg})`,
            '--hero-pos-y': '0%',
          }}
        >
          <div className="hero-content">
            <div className="hero-box">
              <Heading as="h1" size="2xl" lineHeight="1.05">
                Préserver & partager le patrimoine autobus en Essonne
              </Heading>
              <Text mt={4} fontSize="lg" color="whiteAlpha.800">
                RétroBus Essonne restaure des autobus emblématiques, organise des sorties et des
                animations pour faire découvrir l'histoire des transports.
              </Text>
              <Stack 
                direction="column"
                spacing={4} 
                mt={6} 
                alignItems="flex-end"
              >
                <Button
                  as={RouterLink}
                  to="/parc"
                  size="lg"
                  bg="var(--rbe-red)"
                  color="white"
                  _hover={{ opacity: 0.9 }}
                >
                  Découvrir nos véhicules
                </Button>

                <Button
                  as={RouterLink}
                  to="/contact"
                  size="lg"
                  variant="outline"
                  color="white"
                  _hover={{ bg: "whiteAlpha.200" }}
                >
                  Nous contacter
                </Button>
              </Stack>
            </div>
          </div>
        </Box>

        {/* DISCORD + COLLECTION SECTION */}
        <Box bg="white" py={16}>
          <Container maxW="7xl">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={12} align="start">
              {/* LEFT: NOTRE COLLECTION */}
              <VStack spacing={6} align="stretch" ml={-48} w="calc(100% + 96px)">
                <VStack spacing={2} align="start">
                  <Heading as="h2" size="lg">Notre collection</Heading>
                  <Text color="gray.600" fontSize="sm">
                    Notre véhicule phare, un Mercedes Citaro de première génération, est le témoin vivant de l'évolution des transports en commun en Île-de-France. Découvrez-le ci-dessous ainsi que d'autres trésors de notre collection.
                  </Text>
                </VStack>

                {/* FEATURED VEHICLE - Horizontal Layout */}
                <HStack spacing={8} align="flex-start">
                  <Box w="100%" flexShrink={0}>
                    <Image
                      src={vehicles[0].src}
                      alt={`${vehicles[0].marque} ${vehicles[0].modele}`}
                      w="100%"
                      borderRadius="xl"
                      boxShadow="lg"
                      loading="lazy"
                    />
                  </Box>

                  <VStack spacing={5} align="stretch" flex={1}>
                    <VStack spacing={2} align="start">
                      <Heading as="h3" size="xl" color="var(--rbe-red)">
                        {vehicles[0].marque} {vehicles[0].modele}
                      </Heading>
                      <Text fontSize="lg" color="gray.600" fontWeight="500">
                        {vehicles[0].surnom}
                      </Text>
                    </VStack>

                    <Text fontSize="lg" color="gray.700" lineHeight="tall">
                      {vehicles[0].description}
                    </Text>

                    <Box 
                      p={4} 
                      border="2px solid" 
                      borderColor="var(--rbe-red)"
                      borderRadius="lg"
                      bg="white"
                    >
                      <Text fontSize="base" color="var(--rbe-red)" fontWeight="bold" mb={2}>✨ POINT FORT</Text>
                      <Text fontSize="base" color="gray.800" fontWeight="500">
                        {vehicles[0].particularite}
                      </Text>
                    </Box>

                    <Button 
                      as={RouterLink}
                      to="/parc" 
                      size="lg" 
                      bg="var(--rbe-red)" 
                      color="white"
                      _hover={{ opacity: 0.9, transform: "translateY(-2px)" }}
                      w="full"
                    >
                      Explorer notre parc complet
                    </Button>
                  </VStack>
                </HStack>
              </VStack>

              {/* RIGHT: DISCORD WIDGET */}
              <VStack spacing={4} align="flex-end" justify="flex-start" w="135%">
                <VStack spacing={2} textAlign="center" align="center" maxW="400px" ml="auto" pr={4}>
                  <Heading as="h3" size="md" color="var(--rbe-red)">Rejoignez notre Serveur Discord</Heading>
                  <Text color="gray.600" fontSize="sm">
                    Partageons avec la communauté : discussions, événements, et découvertes !
                  </Text>
                </VStack>
                <Box 
                  as="iframe"
                  src="https://discord.com/widget?id=1078513042599444582&theme=dark"
                  width="100%"
                  height="500"
                  border="none"
                  loading="lazy"
                  maxW="400px"
                  ml="auto"
                  sx={{
                    "@media (max-width: 768px)": {
                      height: "auto",
                    }
                  }}
                />
              </VStack>
            </SimpleGrid>
          </Container>
        </Box>

        {/* QUI SOMMES-NOUS */}
        <Box bg="gray.50" py={16}>
          <Container maxW="7xl">
            <Heading as="h2" size="xl" mb={12} textAlign="center">À propos de nous</Heading>
            <VStack spacing={10} align="stretch">
              <Text fontSize="lg" color="gray.700" lineHeight="tall" textAlign="center" maxW="3xl" mx="auto">
                <strong>L'Association RétroBus Essonne</strong> est une association à but non lucratif régie par la loi 1901, 
                fondée par des passionnés de transport en commun et du patrimoine roulant historique.
              </Text>
              
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mt={6}>
                <Box 
                  p={8} 
                  bg="white" 
                  borderRadius="xl" 
                  boxShadow="sm"
                  transition="all 0.3s ease"
                  _hover={{
                    boxShadow: "lg",
                    transform: "translateY(-4px)"
                  }}
                  borderTop="4px solid"
                  borderTopColor="var(--rbe-red)"
                >
                  <Box fontSize="3xl" mb={4}>🎯</Box>
                  <Heading as="h3" size="sm" mb={3} color="var(--rbe-red)">Mission</Heading>
                  <Text fontSize="sm">
                    Préserver, restaurer et faire revivre le patrimoine des transports publics franciliens à travers nos véhicules.
                  </Text>
                </Box>
                
                <Box 
                  p={8} 
                  bg="white" 
                  borderRadius="xl" 
                  boxShadow="sm"
                  transition="all 0.3s ease"
                  _hover={{
                    boxShadow: "lg",
                    transform: "translateY(-4px)"
                  }}
                  borderTop="4px solid"
                  borderTopColor="var(--rbe-red)"
                >
                  <Box fontSize="3xl" mb={4}>🚍</Box>
                  <Heading as="h3" size="sm" mb={3} color="var(--rbe-red)">Passion</Heading>
                  <Text fontSize="sm">
                    Sauvegarder des autobus emblématiques qui ont marqué l'histoire des transports en Île-de-France.
                  </Text>
                </Box>
                
                <Box 
                  p={8} 
                  bg="white" 
                  borderRadius="xl" 
                  boxShadow="sm"
                  transition="all 0.3s ease"
                  _hover={{
                    boxShadow: "lg",
                    transform: "translateY(-4px)"
                  }}
                  borderTop="4px solid"
                  borderTopColor="var(--rbe-red)"
                >
                  <Box fontSize="3xl" mb={4}>👥</Box>
                  <Heading as="h3" size="sm" mb={3} color="var(--rbe-red)">Équipe</Heading>
                  <Text fontSize="sm">
                    Une équipe de passionnés automobile derrière toute l'association !
                  </Text>
                </Box>
                
                <Box 
                  p={8} 
                  bg="white" 
                  borderRadius="xl" 
                  boxShadow="sm"
                  transition="all 0.3s ease"
                  _hover={{
                    boxShadow: "lg",
                    transform: "translateY(-4px)"
                  }}
                  borderTop="4px solid"
                  borderTopColor="var(--rbe-red)"
                >
                  <Box fontSize="3xl" mb={4}>🌟</Box>
                  <Heading as="h3" size="sm" mb={3} color="var(--rbe-red)">Engagement</Heading>
                  <Text fontSize="sm">
                    Transmettre la mémoire des transports aux générations futures.
                  </Text>
                </Box>
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>

        {/* NOS ACTIVITÉS - SECTION PRINCIPALE */}
        <Container maxW="7xl" py={16}>
          <Heading as="h2" size="xl" textAlign="center" mb={2}>Ce que nous faisons</Heading>
          <Text textAlign="center" color="gray.600" mb={12} fontSize="md">
            Trois piliers fondamentaux pour l'amour du patrimoine
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            <Box 
              position="relative"
              p={8}
              bg="linear-gradient(135deg, rgba(220, 38, 38, 0.05), rgba(220, 38, 38, 0.02))"
              border="1px solid"
              borderColor="blackAlpha.100"
              borderRadius="xl"
              transition="all 0.3s ease"
              _hover={{
                borderColor: "var(--rbe-red)",
                boxShadow: "0 10px 40px rgba(220, 38, 38, 0.1)"
              }}
            >
              <Box fontSize="4xl" mb={4}>🔧</Box>
              <Heading as="h3" size="md" mb={4} color="var(--rbe-red)">Restauration</Heading>
              <Text lineHeight="tall">
                Restauration complète et entretien méticuleux de véhicules emblématiques. Chaque détail compte pour ramener nos autobus à leur ancienne gloire.
              </Text>
            </Box>

            <Box 
              position="relative"
              p={8}
              bg="linear-gradient(135deg, rgba(220, 38, 38, 0.05), rgba(220, 38, 38, 0.02))"
              border="1px solid"
              borderColor="blackAlpha.100"
              borderRadius="xl"
              transition="all 0.3s ease"
              _hover={{
                borderColor: "var(--rbe-red)",
                boxShadow: "0 10px 40px rgba(220, 38, 38, 0.1)"
              }}
            >
              <Box fontSize="4xl" mb={4}>🚌</Box>
              <Heading as="h3" size="md" mb={4} color="var(--rbe-red)">Événements</Heading>
              <Text lineHeight="tall">
                Sorties patrimoine, expositions publiques et balades touristiques. Faire découvrir notre passion au plus grand nombre.
              </Text>
            </Box>

            <Box 
              position="relative"
              p={8}
              bg="linear-gradient(135deg, rgba(220, 38, 38, 0.05), rgba(220, 38, 38, 0.02))"
              border="1px solid"
              borderColor="blackAlpha.100"
              borderRadius="xl"
              transition="all 0.3s ease"
              _hover={{
                borderColor: "var(--rbe-red)",
                boxShadow: "0 10px 40px rgba(220, 38, 38, 0.1)"
              }}
            >
              <Box fontSize="4xl" mb={4}>📚</Box>
              <Heading as="h3" size="md" mb={4} color="var(--rbe-red)">Mémoire</Heading>
              <Text lineHeight="tall">
                Collecte de témoignages, photothèque et sauvegarde des documents techniques. Préserver l'histoire pour demain.
              </Text>
            </Box>
          </SimpleGrid>
        </Container>

        {/* APPELS À L'ACTION */}
        <Box bg="var(--rbe-red)" py={16}>
          <Container maxW="7xl">
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <VStack spacing={4} align="center" textAlign="center" color="white">
                <Box fontSize="3xl">📋</Box>
                <Heading as="h3" size="md" color="white">Rejoignez-nous</Heading>
                <Text>Bénévoles, supporters, passionnés — ensemble, faisons vivre ce patrimoine.</Text>
                <Button 
                  as={RouterLink}
                  to="/contact"
                  bg="white"
                  color="var(--rbe-red)"
                  _hover={{ opacity: 0.9 }}
                  mt={2}
                >
                  Nous contacter
                </Button>
              </VStack>

              <VStack spacing={4} align="center" textAlign="center" color="white">
                <Box fontSize="3xl">📅</Box>
                <Heading as="h3" size="md" color="white">Prochains événements</Heading>
                <Text>Sorties, expositions et animations tout au long de l'année.</Text>
                <Button 
                  as={RouterLink}
                  to="/evenements"
                  bg="white"
                  color="var(--rbe-red)"
                  _hover={{ opacity: 0.9 }}
                  mt={2}
                >
                  Voir l'agenda
                </Button>
              </VStack>

              <VStack spacing={4} align="center" textAlign="center" color="white">
                <Box fontSize="3xl">❤️</Box>
                <Heading as="h3" size="md" color="white">Nous soutenir</Heading>
                <Text>Vos dons nous aident à financer la restauration et l'entretien.</Text>
                <Button 
                  as={RouterLink}
                  to="/donate"
                  bg="white"
                  color="var(--rbe-red)"
                  _hover={{ opacity: 0.9 }}
                  mt={2}
                >
                  Faire un don
                </Button>
              </VStack>
            </SimpleGrid>
          </Container>
        </Box>
      </Box>
    </>
  );
}
