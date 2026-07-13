import { Link as RouterLink } from "react-router-dom";
import {
  Box, Button, Container, Heading, SimpleGrid, Stack, Text, Image, VStack, HStack, 
  Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Show, Hide, Badge
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import pageBg from "../assets/logo_arriere_plan.svg";
import heroImg from "../assets/photos/ma-photo-hero.jpg";
import SEO, { jsonLdSchemas } from "../components/SEO";
import { ENABLE_TEMPORARY_ANNIVERSARY_920 } from "../lib/featureFlags";

const HERO_IMAGE_URL = "/assets/photos/ma-photo-hero.jpg";
const ANNIVERSARY_HERO_BUS_IMAGE = "/assets/bus-25-ans.png";
const ANNIVERSARY_CARD_LOGO_IMAGE = "/assets/RBE%20CLASSIQUE%20FULL%20BLANC.png";

// Bloc temporaire pour l'anniversaire des 25 ans : ajuster ici la disposition du titre hero.
const ANNIVERSARY_HERO_LAYOUT = Object.freeze({
  desktop: {
    titleFontSize: { md: "7xl", lg: "8xl" },
    titleShiftX: "-28px",
    imageHeight: { md: "1.1em", lg: "1.2em" },
    imageGap: 4,
    imageVerticalAlign: "middle",
  },
  mobile: {
    titleFontSize: { base: "4xl", sm: "5xl" },
    imageHeight: { base: "1.05em", sm: "1.15em" },
    imageGap: 2,
    imageVerticalAlign: "middle",
  },
});

const vehicles = [
  {
    id: 1,
    src: "/assets/photos/p1-960.jpg",
    marque: "Mercedes",
    modele: "Citaro",
    surnom: "La Dame Grise, numéro 920",
    description: "L'ouverture moderne d'une longue série d'autobus Citaro au monde. il est également climatisé ! ❄️",
    particularite: "Le plus vieux Citaro préservé en France !"
  }];

const ANNIVERSARY_920_LAYOUT = Object.freeze({
  desktopCardMinHeight: "590px",
  desktopImageMinHeight: "360px",
  desktopWidth: "calc(100% + 480px)",
});

const ENABLE_ANNIVERSARY_920 = ENABLE_TEMPORARY_ANNIVERSARY_920;

const ANNIVERSARY_920_COPY = Object.freeze({
  period: "Juillet 2001 - juillet 2026",
  title: "Le 920 fête ses 25 ans",
  subtitle: '"La Dame Grise" - Mercedes Citaro',
  description: "Un quart de siècle pour ce Citaro devenu véhicule référence de RétroBus Essonne, aujourd'hui préservé comme témoin du patrimoine roulant francilien.",
  primaryAction: "Voir la fiche du 920",
  secondaryAction: "Galerie photos",
});

function Anniversary920Card({ compact = false }) {
  return (
    <Box
      bg="linear-gradient(135deg, #df2857 0%, #d7194e 100%)"
      color="white"
      borderRadius="xl"
      p={{ base: 4, md: compact ? 5 : 8 }}
      boxShadow="lg"
      position="relative"
      overflow="hidden"
      minH={{ base: "auto", md: compact ? "auto" : ANNIVERSARY_920_LAYOUT.desktopCardMinHeight }}
      display="flex"
      alignItems="stretch"
      w="100%"
    >
      <Image
        src={ANNIVERSARY_CARD_LOGO_IMAGE}
        alt="RétroBus Essonne"
        position="absolute"
        top={{ base: 4, md: compact ? 5 : 6 }}
        right={{ base: 4, md: compact ? 5 : 6 }}
        h={{ base: "34px", md: compact ? "40px" : "52px" }}
        w="auto"
        maxW={{ base: "130px", md: compact ? "150px" : "190px" }}
        objectFit="contain"
        zIndex={2}
        pointerEvents="none"
      />
      <VStack align="stretch" spacing={{ base: 4, md: compact ? 5 : 7 }} position="relative" zIndex={1} flex={1}>
        <Badge
          alignSelf="flex-start"
          bg="yellow.100"
          color="#8a3a00"
          borderRadius="full"
          px={3}
          py={1}
          fontSize="xs"
          fontWeight="800"
        >
          🎂 Anniversaire spécial
        </Badge>

        <SimpleGrid
          columns={{ base: 1, md: compact ? 1 : 2 }}
          spacing={{ base: 4, md: compact ? 5 : 8 }}
          alignItems="stretch"
          flex={1}
        >
          <VStack align="stretch" spacing={{ base: 3, md: compact ? 3 : 5 }} justify="space-between">
            <HStack align="baseline" spacing={2} flexWrap="wrap">
              <Text
                as="span"
                fontSize={{ base: "3xl", sm: "5xl", md: compact ? "5xl" : "7xl" }}
                lineHeight="0.9"
                fontWeight="900"
                letterSpacing="0"
                textShadow="0 2px 0 #5b0326, 0 0 10px rgba(211,12,76,0.72), 0 0 24px rgba(193,7,68,0.62), 0 0 42px rgba(159,6,58,0.58), 0 0 68px rgba(15,23,42,0.68)"
              >
                25 ANS
              </Text>
              <Text as="span" fontSize={{ base: "xs", md: "sm" }} fontWeight="900">
                DU CITARO 920
              </Text>
            </HStack>

            <Box position="relative" flex={1} minH={{ base: "190px", md: compact ? "230px" : ANNIVERSARY_920_LAYOUT.desktopImageMinHeight }}>
              <Image
                src="/assets/photos/p1-960.jpg"
                alt="Mercedes Citaro 920 - 25 ans"
                htmlWidth={960}
                htmlHeight={640}
                w="100%"
                h="100%"
                objectFit="cover"
                borderRadius="lg"
                boxShadow="md"
                loading="lazy"
                decoding="async"
              />
              <Badge
                position="absolute"
                top={{ base: 2, md: 3 }}
                right={{ base: 2, md: compact ? 3 : 1 }}
                bg="yellow.300"
                color="black"
                borderRadius="full"
                px={{ base: 2.5, md: compact ? 3 : 3.5 }}
                py={{ base: 1, md: compact ? 1 : 1.5 }}
                fontSize={{ base: "2xs", md: compact ? "xs" : "sm" }}
                fontWeight="900"
                boxShadow="lg"
                transform="rotate(8deg)"
                transformOrigin="center"
                lineHeight="1"
              >
                🎉 25 ans
              </Badge>
            </Box>
          </VStack>

          <VStack
            align="start"
            spacing={{ base: 2, md: compact ? 2 : 4 }}
            justify={{ base: "start", md: compact ? "start" : "center" }}
            h="100%"
            pt={0}
          >
            <Text fontSize={{ base: "md", md: compact ? "lg" : "xl" }} fontWeight="600">
              {ANNIVERSARY_920_COPY.period}
            </Text>
            <Heading as="h2" fontSize={{ base: "2xl", md: compact ? "3xl" : "4xl" }} lineHeight="1" color="white">
              {ANNIVERSARY_920_COPY.title}
            </Heading>
            <Text fontSize={{ base: "sm", md: compact ? "md" : "lg" }} fontWeight="700">
              {ANNIVERSARY_920_COPY.subtitle}
            </Text>
            <Text fontSize={{ base: "sm", md: compact ? "md" : "lg" }} lineHeight="1.4" fontWeight="600" opacity={0.96}>
              {ANNIVERSARY_920_COPY.description}
            </Text>

            <Stack direction={{ base: "column", sm: "row" }} spacing={3} pt={2} w="100%">
              <Button
                as={RouterLink}
                to="/vehicles/920"
                size={compact ? "sm" : "md"}
                bg="white"
                color="var(--rbe-red)"
                fontWeight="800"
                _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                minW={{ base: "auto", sm: compact ? "auto" : "170px" }}
                w={{ base: "full", sm: "auto" }}
              >
                {ANNIVERSARY_920_COPY.primaryAction}
              </Button>
              <Button
                as={RouterLink}
                to="/photos"
                size={compact ? "sm" : "md"}
                variant="outline"
                borderColor="whiteAlpha.700"
                color="white"
                fontWeight="800"
                _hover={{ bg: "whiteAlpha.200" }}
                minW={{ base: "auto", sm: compact ? "auto" : "140px" }}
                w={{ base: "full", sm: "auto" }}
              >
                {ANNIVERSARY_920_COPY.secondaryAction}
              </Button>
            </Stack>
          </VStack>
        </SimpleGrid>
      </VStack>

      <Box
        position="absolute"
        right="-36px"
        bottom="-42px"
        fontSize="160px"
        lineHeight="1"
        fontWeight="900"
        opacity={0.08}
        pointerEvents="none"
      >
        25
      </Box>
    </Box>
  );
}

export default function Home() {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Force le mode événement UNIQUEMENT en dev local (localhost)
  // En production, le mode événement sera activé par publication depuis l'interface interne
  useEffect(() => {
    const isLocalDev = false; // ⚠️ DÉSACTIVÉ - Mettre à true pour activer en local
    
    // const isLocalDev = window.location.hostname === 'localhost' || 
    //                    window.location.hostname === '127.0.0.1' ||
    //                    window.location.hostname.includes('local');
    
    // Ne forcer la config QUE si on est en dev local
    if (!isLocalDev) {
      console.log('🌐 Mode production - Mode événement géré par API');
      return;
    }

    // Config DEV LOCAL uniquement
    const eventStart = new Date('2026-09-20T10:00:00');
    const eventEnd = new Date('2026-09-20T18:00:00');
    
    const config = {
      active: true, // Mode DEV LOCAL uniquement
      startDate: eventStart.toISOString(),
      endDate: eventEnd.toISOString(),
      event: {
        id: 'dev-jep-2026',
        name: 'Journées Européennes du Patrimoine 2026',
        subtitle: 'Patrimoine Roulant en Fête',
        description: 'Venez découvrir nos véhicules historiques et participer à une journée exceptionnelle dédiée au patrimoine des transports en commun.',
        location: 'Parking Crété, Corbeil-Essonnes',
        type: 'EXPO',
        bannerImage: '',
        heroImage: '',
        color: '#D32F2F',
        secondaryColor: '#FFA000',
        logo: '',
        actualStartDate: eventStart.toISOString(),
        actualEndDate: eventEnd.toISOString()
      },
      registration: {
        enabled: true,
        eventId: 'dev-jep-2026',
        buttonText: "S'inscrire à l'événement",
        requireAuth: false,
        isPaid: false,
        price: 0,
        currency: 'EUR'
      },
      customContent: {
        showCountdown: true,
        showProgramSchedule: false,
        schedule: [],
        highlights: [],
        partners: [],
        practicalInfo: ''
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('rbe:public-event-mode', JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('eventModeChanged', { detail: config }));
    console.log('✅ Mode événement DEV LOCAL activé - JEP 2026 (20 sept.)');
  }, []);

  return (
    <>
      <SEO 
        title="RétroBus Essonne - Patrimoine Automobile & Bus Historiques en Île-de-France"
        description="Association de préservation du patrimoine automobile en Île-de-France. Découvrez notre collection unique de bus et autocars historiques, participez à nos événements et soutenez la sauvegarde du patrimoine routier français."
        keywords="bus anciens, autobus historiques, patrimoine automobile, Essonne, Île-de-France, RétroBus, collection bus, véhicules de collection, transports en commun anciens, musée bus, association automobile, Mercedes Citaro, RATP vintage, restauration véhicules, sorties patrimoine, association 1901"
        url="https://www.association-rbe.fr/"
        image={HERO_IMAGE_URL}
        type="website"
        jsonLd={jsonLdSchemas.organization}
      />

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
        {/* HERO SECTION - Desktop original + adaptation mobile */}
        
        {/* Version Desktop - Design original */}
        <Hide below="md">
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
                {ENABLE_ANNIVERSARY_920 ? (
                  <Heading as="h1" fontSize={ANNIVERSARY_HERO_LAYOUT.desktop.titleFontSize} lineHeight="0.9" textAlign="right" whiteSpace="nowrap" transform={`translateX(${ANNIVERSARY_HERO_LAYOUT.desktop.titleShiftX})`} textShadow="0 0 16px rgba(255,255,255,0.9), 0 0 36px rgba(255,216,77,0.85), 0 0 72px rgba(255,76,120,0.7)">
                    25 ANS
                    <Image
                      src={ANNIVERSARY_HERO_BUS_IMAGE}
                      alt="Bus RétroBus Essonne"
                      display="inline-block"
                      h={ANNIVERSARY_HERO_LAYOUT.desktop.imageHeight}
                      w="auto"
                      ml={ANNIVERSARY_HERO_LAYOUT.desktop.imageGap}
                      verticalAlign={ANNIVERSARY_HERO_LAYOUT.desktop.imageVerticalAlign}
                    />
                  </Heading>
                ) : (
                  <>
                    <Heading as="h1" size="2xl" lineHeight="1.05">
                      Préserver & partager le patrimoine automobile en Essonne
                    </Heading>
                    <Text mt={4} fontSize="lg" color="whiteAlpha.800">
                      L'association RétroBus Essonne est une association régie par la Loi 1901 qui préserve et partage le patrimoine automobile en Essonne.
                    </Text>
                    <Stack direction="column" spacing={4} mt={6} alignItems="flex-end">
                      <Button as={RouterLink} to="/parc" size="lg" bg="var(--rbe-red)" color="white" _hover={{ opacity: 0.9 }}>
                        Découvrir notre collection
                      </Button>
                      <Button as={RouterLink} to="/contact" size="lg" variant="outline" color="white" _hover={{ bg: "whiteAlpha.200" }}>
                        Nous contacter
                      </Button>
                    </Stack>
                  </>
                )}
              </div>
            </div>
          </Box>
        </Hide>

        {/* Version Mobile - Adaptée */}
        <Show below="md">
          <Box
            as="section"
            position="relative"
            width="100vw"
            left="50%"
            ml="-50vw"
            minH="60vh"
            backgroundImage={`url(${heroImg})`}
            backgroundPosition="center"
            backgroundSize="cover"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _before={{
              content: '""',
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)",
              zIndex: 0,
            }}
          >
            <Container position="relative" zIndex={1} px={4}>
              <VStack align="center" spacing={4} textAlign="center">
                {ENABLE_ANNIVERSARY_920 ? (
                  <Heading as="h1" fontSize={ANNIVERSARY_HERO_LAYOUT.mobile.titleFontSize} lineHeight="0.9" color="white" whiteSpace="nowrap" textShadow="0 0 14px rgba(255,255,255,0.9), 0 0 28px rgba(255,216,77,0.85), 0 0 52px rgba(255,76,120,0.7)">
                    25 ANS
                    <Image
                      src={ANNIVERSARY_HERO_BUS_IMAGE}
                      alt="Bus RétroBus Essonne"
                      display="inline-block"
                      h={ANNIVERSARY_HERO_LAYOUT.mobile.imageHeight}
                      w="auto"
                      ml={ANNIVERSARY_HERO_LAYOUT.mobile.imageGap}
                      verticalAlign={ANNIVERSARY_HERO_LAYOUT.mobile.imageVerticalAlign}
                    />
                  </Heading>
                ) : (
                  <>
                    <Heading as="h1" fontSize="2xl" lineHeight="1.1" color="white" textShadow="0 2px 20px rgba(0,0,0,0.5)">
                      Préserver & partager le patrimoine automobile en Essonne
                    </Heading>
                    <Text fontSize="md" color="whiteAlpha.900" textShadow="0 1px 10px rgba(0,0,0,0.5)">
                      L'association RétroBus Essonne est une association régie par la Loi 1901 qui préserve et partage le patrimoine automobile en Essonne.
                    </Text>
                    <Stack direction="column" spacing={3} width="full" mt={4}>
                      <Button as={RouterLink} to="/parc" size="md" bg="var(--rbe-red)" color="white" width="full" _hover={{ opacity: 0.9 }}>
                        Découvrir notre collection
                      </Button>
                      <Button as={RouterLink} to="/contact" size="md" variant="outline" color="white" borderColor="white" width="full" _hover={{ bg: "whiteAlpha.300" }}>
                        Nous contacter
                      </Button>
                    </Stack>
                  </>
                )}
              </VStack>
            </Container>
          </Box>
        </Show>

        {/* COLLECTION & DISCORD SECTION */}
        <Box bg="white" py={16}>
          <Container maxW="7xl">
            
            {/* Version Desktop - Design original avec débordements */}
            <Hide below="lg">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={12} align="start">
                {ENABLE_ANNIVERSARY_920 ? (
                  <Box ml={-48} w={ANNIVERSARY_920_LAYOUT.desktopWidth}>
                    <Anniversary920Card />
                  </Box>
                ) : (
                  <VStack spacing={6} align="stretch" ml={-48} w="calc(100% + 96px)">
                    <VStack spacing={2} align="start">
                      <Heading as="h2" size="lg">Notre collection</Heading>
                      <Text color="gray.600" fontSize="sm">
                        Découvrez un condensé de notre collection de véhicules historiques, témoins de l'évolution des transports en commun en Île-de-France. Chaque véhicule a une histoire unique à raconter !
                      </Text>
                    </VStack>

                    <HStack spacing={8} align="flex-start">
                      <Box w="100%" flexShrink={0}>
                        <Image
                          src={vehicles[0].src}
                          alt={`${vehicles[0].marque} ${vehicles[0].modele}`}
                          htmlWidth={960}
                          htmlHeight={640}
                          w="100%"
                          borderRadius="xl"
                          boxShadow="lg"
                          loading="lazy"
                          decoding="async"
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
                )}

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
                    title="Serveur Discord RétroBus Essonne"
                    width="100%"
                    height="500"
                    border="none"
                    loading="lazy"
                    maxW="400px"
                    ml="auto"
                  />
                </VStack>
              </SimpleGrid>
            </Hide>

            {/* Version Mobile/Tablette - Sans débordements */}
            <Show below="lg">
              <VStack spacing={12} align="stretch">
                {ENABLE_ANNIVERSARY_920 ? (
                  <Anniversary920Card compact />
                ) : (
                  <VStack spacing={6} align="stretch">
                    <VStack spacing={2} align="start">
                      <Heading as="h2" fontSize={{ base: "xl", md: "2xl" }}>Notre collection</Heading>
                      <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                        Découvrez un condensé de notre collection de véhicules historiques, témoins de l'évolution des transports en commun en Île-de-France.
                      </Text>
                    </VStack>

                    <VStack spacing={5} align="stretch">
                      <Image
                        src={vehicles[0].src}
                        alt={`${vehicles[0].marque} ${vehicles[0].modele}`}
                        htmlWidth={960}
                        htmlHeight={640}
                        w="100%"
                        borderRadius="xl"
                        boxShadow="xl"
                        loading="lazy"
                        decoding="async"
                      />

                      <VStack spacing={3} align="stretch">
                        <Heading as="h3" fontSize={{ base: "lg", md: "xl" }} color="var(--rbe-red)">
                          {vehicles[0].marque} {vehicles[0].modele}
                        </Heading>
                        <Text fontSize={{ base: "sm", md: "md" }} color="gray.600" fontWeight="500">
                          {vehicles[0].surnom}
                        </Text>
                        <Text fontSize={{ base: "sm", md: "md" }} color="gray.700" lineHeight="tall">
                          {vehicles[0].description}
                        </Text>

                        <Box 
                          p={3}
                          border="2px solid" 
                          borderColor="var(--rbe-red)"
                          borderRadius="lg"
                          bg="red.50"
                        >
                          <Text fontSize="xs" color="var(--rbe-red)" fontWeight="bold" mb={1}>
                            ✨ POINT FORT
                          </Text>
                          <Text fontSize="sm" color="gray.800" fontWeight="500">
                            {vehicles[0].particularite}
                          </Text>
                        </Box>

                        <Button 
                          as={RouterLink}
                          to="/parc" 
                          size="md"
                          bg="var(--rbe-red)" 
                          color="white"
                          _hover={{ opacity: 0.9 }}
                          width="full"
                        >
                          Explorer notre parc complet
                        </Button>
                      </VStack>
                    </VStack>
                  </VStack>
                )}

                {/* DISCORD WIDGET */}
                <VStack spacing={4} align="stretch">
                  <VStack spacing={2} align="start">
                    <Heading as="h3" fontSize={{ base: "lg", md: "xl" }} color="var(--rbe-red)">
                      Rejoignez notre Serveur Discord
                    </Heading>
                    <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                      Partageons avec la communauté : discussions, événements, et découvertes !
                    </Text>
                  </VStack>
                  <Box 
                    as="iframe"
                    src="https://discord.com/widget?id=1078513042599444582&theme=dark"
                    title="Serveur Discord RétroBus Essonne"
                    width="100%"
                    height="400"
                    border="none"
                    borderRadius="lg"
                    loading="lazy"
                  />
                </VStack>
              </VStack>
            </Show>

          </Container>
        </Box>

        {/* QUI SOMMES-NOUS - Desktop original */}
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
                    Préserver, restaurer et faire revivre le patrimoine automobile à travers nos véhicules.
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
                    Sauvegarder des véhicules emblématiques qui ont marqué l'histoire des mobilités partout dans le monde.
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
