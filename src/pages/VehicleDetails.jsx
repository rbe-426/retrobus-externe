import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  Image as ChakraImage,
  SimpleGrid,
  Badge,
  Button,
  VStack,
  HStack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Flex,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight, FiArrowLeft } from "react-icons/fi";
import EventBanner from "../components/EventBanner";
import { is920AnniversaryVehiclePageActive } from "../lib/featureFlags";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://attractive-kindness-rbe-serveurs.up.railway.app';

// Fallback global pour les fonds de véhicules
const DEFAULT_VEHICLE_BG = '/assets/fallback/_MG_1006.jpg';

const ANNIVERSARY_920_STORY_SECTIONS = Object.freeze([
  {
    image: '/assets/photos/920-premiere-livree.jpg',
    alt: 'Mercedes Citaro 920 sous sa première livrée Cars Bridet',
    caption: 'Le Citaro sous sa première livrée',
    credit: "© Dam's Labourier - 10 septembre 2005 via tc-infos.fr",
    title: 'De Cars Bridet à Transdev Bièvre Bus Mobilités',
    text: "Avant de devenir La Dame Grise de RétroBus Essonne, le 920 circule sous sa première livrée chez Cars Bridet, devenu ensuite Transdev Bièvre Bus Mobilités. Basé au même dépôt de Wissous, il reste attaché au même territoire de juillet 2001 à 2014.",
    facts: [
      'Exploitant : Cars Bridet, puis Transdev Bièvre Bus Mobilités',
      'Dépôt : Wissous, même site d’exploitation',
      'Période : juillet 2001 - 2014',
    ],
  },
  {
    image: '/assets/photos/920-strav-limeil.jpg',
    fallbackImage: '/assets/photos/back920.jpg',
    alt: 'Mercedes Citaro 920 sous livrée Transdev STRAV à Limeil-Brévannes',
    caption: 'Nouvelle livrée, nouveau territoire',
    credit: "© Dam's Labourier - 10 janvier 2015 via tc-infos.fr",
    title: 'L’étape Transdev STRAV',
    text: "À partir de septembre 2014, le 920 quitte son premier territoire pour rejoindre Transdev STRAV à Limeil-Brévannes. Avec sa nouvelle livrée, il poursuit sa carrière sur un autre réseau jusqu'en août 2020.",
    facts: [
      'Exploitant : Transdev STRAV',
      'Dépôt : Limeil-Brévannes',
      'Période : septembre 2014 - août 2020',
    ],
  },
  {
    image: '/assets/photos/920-cars-soeur.jpg',
    fallbackImage: '/assets/photos/p1-960.jpg',
    alt: 'Mercedes Citaro 920 sous livrée Cars Sœur à Saint-Germain-lès-Corbeil',
    caption: 'Une nouvelle étape chez Cars Sœur',
    credit: '© Claude-Henry Ntari-Soutarson - 07 avril 2021 via tc-infos.fr',
    title: 'L’arrivée chez Cars Sœur',
    text: "En avril 2021, le 920 rejoint Cars Sœur, groupe Nedroma, à Saint-Germain-lès-Corbeil. Cette étape marque sa dernière période d’exploitation régulière avant sa préservation, jusqu’en mai 2025.",
    facts: [
      'Exploitant : Cars Sœur, groupe Nedroma',
      'Dépôt : Saint-Germain-lès-Corbeil',
      'Période : avril 2021 - mai 2025',
    ],
  },
  {
    image: '/assets/photos/_DSC0103.jpg',
    fallbackImage: '/assets/photos/p1-960.jpg',
    alt: 'Mercedes Citaro 920 préservé par RétroBus Essonne',
    caption: 'Terminus, et bonne retraite',
    credit: '© Waiyl BELAIDI - Janvier 2026 - Photo personnelle pour RBE',
    title: 'Une nouvelle vie en préservation',
    text: "Depuis mai 2025, le 920 a quitté l’exploitation commerciale pour rejoindre l’association RétroBus Essonne. Sa route continue autrement : préserver, restaurer et transmettre l’histoire d’un Citaro devenu témoin du patrimoine roulant francilien.",
    facts: [
      'Association : RétroBus Essonne',
      'Statut : véhicule préservé',
      'Période : depuis mai 2025',
    ],
  },
]);

const ANNIVERSARY_920_TECHNICAL_SPECS = Object.freeze([
  { label: 'Constructeur', value: 'Mercedes-Benz' },
  { label: 'Modèle', value: 'Citaro C1' },
  { label: 'Numéro de parc', value: '920' },
  { label: 'Mise en circulation', value: 'Juillet 2001' },
  { label: 'Immatriculation actuelle', value: 'FG-920-RE' },
  { label: 'Ancienne immatriculation', value: '923 CZH 91' },
  { label: 'Type', value: 'Autobus urbain standard' },
  { label: 'Longueur', value: '12 mètres' },
  { label: 'Motorisation', value: 'Diesel' },
  { label: 'État', value: 'Préservé par RétroBus Essonne' },
]);

function Anniversary920VehiclePage() {
  return (
    <Box
      position="relative"
      width="100vw"
      minHeight="calc(100vh - var(--header-h) - var(--nav-h))"
      mt={{ base: "calc(-1 * var(--mobile-header-h))", md: "calc(-1 * (var(--header-h) + var(--nav-h) - 32px))" }}
      marginLeft="calc(-50vw + 50%)"
      marginRight="calc(-50vw + 50%)"
      bg="radial-gradient(circle at 18% 12%, rgba(159,6,58,0.72) 0%, transparent 32%), linear-gradient(135deg, #5b0326 0%, #7d0530 48%, #0f172a 100%)"
      overflow="hidden"
    >
      <Box position="absolute" inset={0} bg="blackAlpha.200" />
      <Container maxW="6xl" position="relative" zIndex={1} px={{ base: 4, md: 6 }} py={{ base: 5, md: 14 }}>
        <Button as={Link} to="/parc" leftIcon={<FiArrowLeft />} mb={{ base: 5, md: 8 }} size={{ base: "sm", md: "md" }} colorScheme="whiteAlpha" variant="solid">
          Retour aux véhicules
        </Button>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 6, lg: 12 }} alignItems="center">
          <VStack align="start" spacing={{ base: 3, md: 5 }} color="white">
            <Badge bg="whiteAlpha.200" color="white" px={3} py={1} borderRadius="full" fontSize={{ base: "xs", md: "sm" }} fontWeight="800">
              Fiche temporaire anniversaire
            </Badge>
            <Heading as="h1" fontSize={{ base: "3xl", sm: "4xl", md: "6xl", lg: "7xl" }} lineHeight={{ base: "1", md: "0.95" }} textShadow="0 2px 0 #5b0326, 0 0 28px rgba(15,23,42,0.65)">
              920 : 25 ans de voyages
            </Heading>
            <Text fontSize={{ base: "md", md: "2xl" }} fontWeight="700" opacity={0.95}>
              Juillet 2001 - juillet 2026
            </Text>
            <Text fontSize={{ base: "sm", md: "lg" }} lineHeight={{ base: "1.65", md: "1.7" }} maxW="620px" opacity={0.95}>
              La Dame Grise célèbre un quart de siècle de service, de souvenirs et de préservation au sein de RétroBus Essonne.
            </Text>
          </VStack>

          <Box>
            <ChakraImage
              src="/assets/photos/p1-960.jpg"
              alt="Mercedes Citaro 920"
              borderRadius="xl"
              boxShadow="0 24px 80px rgba(15,23,42,0.45)"
              border="3px solid rgba(255,255,255,0.72)"
              w="100%"
              h={{ base: "220px", sm: "280px", md: "auto" }}
              objectFit="cover"
            />
          </Box>
        </SimpleGrid>

        <VStack spacing={{ base: 3, md: 5 }} color="white" textAlign="center" maxW="860px" mx="auto" mt={{ base: 9, md: 16 }}>
          <Heading as="h2" fontSize={{ base: "xl", sm: "2xl", md: "4xl" }} lineHeight="1.05">
            Un quart de siècle sur la route
          </Heading>
          <Text fontSize={{ base: "sm", md: "xl" }} lineHeight={{ base: "1.7", md: "1.8" }} opacity={0.94}>
            Depuis 2001, le 920 accompagne les histoires de voyageurs, de conducteurs et de passionnés. Préservé par RétroBus Essonne, ce Mercedes Citaro est aujourd'hui un témoin vivant d'une époque où les lignes régulières, les livrées et les sons du quotidien composaient déjà notre patrimoine commun.
          </Text>
        </VStack>

        <Box position="relative" mt={{ base: 9, md: 20 }} pb={{ base: 2, md: 8 }}>
          <Box
            as="svg"
            aria-hidden="true"
            display={{ base: "none", md: "block" }}
            position="absolute"
            inset="-40px 4% 0 4%"
            width="92%"
            height="100%"
            viewBox="0 0 1000 760"
            preserveAspectRatio="none"
            pointerEvents="none"
            zIndex={0}
            opacity={0.72}
          >
            <defs>
              <linearGradient id="anniversary920Route" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.65)" />
                <stop offset="45%" stopColor="rgba(248,191,208,0.55)" />
                <stop offset="100%" stopColor="rgba(15,23,42,0.45)" />
              </linearGradient>
            </defs>
            <path
              d="M180 105 C420 5 585 205 430 280 C270 356 362 510 586 438 C810 365 872 525 704 650"
              fill="none"
              stroke="url(#anniversary920Route)"
              strokeWidth="24"
              strokeLinecap="round"
            />
            <path
              d="M202 105 C438 28 552 208 444 264 C326 326 390 464 574 410 C752 358 828 490 704 630"
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="18 26"
            />
            <path
              d="M486 275 C560 214 660 294 608 356 C552 424 444 340 506 286"
              fill="none"
              stroke="rgba(255,255,255,0.32)"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </Box>

          <VStack spacing={{ base: 9, md: 28 }} position="relative" zIndex={1}>
            {ANNIVERSARY_920_STORY_SECTIONS.map((section, index) => {
              const imageOrder = { base: 1, md: index % 2 === 0 ? 1 : 2 };
              const copyOrder = { base: 2, md: index % 2 === 0 ? 2 : 1 };

              return (
                <SimpleGrid key={section.title} columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 10 }} alignItems="center" w="100%" mt={index > 0 ? { base: 0, md: 8 } : 0}>
                  <Box order={imageOrder} borderRadius={{ base: "xl", md: "2xl" }} overflow="hidden" boxShadow="0 22px 70px rgba(15,23,42,0.4)" border="2px solid rgba(255,255,255,0.55)" bg="rgba(15,23,42,0.28)">
                    <ChakraImage
                      src={section.image}
                      alt={section.alt}
                      w="100%"
                      h={{ base: "210px", sm: "260px", md: "340px" }}
                      objectFit="cover"
                      onError={(event) => {
                        if (section.fallbackImage && event.currentTarget.src !== section.fallbackImage) {
                          event.currentTarget.src = section.fallbackImage;
                        }
                      }}
                    />
                    {(section.caption || section.credit) && (
                      <Box px={{ base: 3, md: 5 }} py={{ base: 2.5, md: 3 }} color="white">
                        {section.caption && (
                          <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="800">
                            {section.caption}
                          </Text>
                        )}
                        {section.credit && (
                          <Text fontSize={{ base: "2xs", md: "xs" }} color="whiteAlpha.750" mt={1} lineHeight="1.35">
                            {section.credit}
                          </Text>
                        )}
                      </Box>
                    )}
                  </Box>
                  <VStack order={copyOrder} align="start" spacing={{ base: 3, md: 4 }} color="white" bg="rgba(15,23,42,0.34)" border="1px solid rgba(255,255,255,0.22)" borderRadius={{ base: "xl", md: "2xl" }} p={{ base: 4, md: 7 }} boxShadow="0 18px 55px rgba(15,23,42,0.25)" backdropFilter="blur(8px)">
                    <Heading as="h3" fontSize={{ base: "xl", md: "3xl" }} lineHeight="1.08">
                      {section.title}
                    </Heading>
                    <Text fontSize={{ base: "sm", md: "lg" }} lineHeight={{ base: "1.65", md: "1.75" }} opacity={0.94}>
                      {section.text}
                    </Text>
                    {section.facts && (
                      <VStack align="start" spacing={2} pt={1} w="100%">
                        {section.facts.map((fact) => (
                          <Box key={fact} bg="whiteAlpha.200" border="1px solid rgba(255,255,255,0.18)" borderRadius="lg" px={{ base: 2.5, md: 3 }} py={{ base: 2, md: 2 }} w="100%">
                            <Text fontSize={{ base: "xs", md: "md" }} fontWeight="700" lineHeight="1.45">
                              {fact}
                            </Text>
                          </Box>
                        ))}
                      </VStack>
                    )}
                  </VStack>
                </SimpleGrid>
              );
            })}
          </VStack>
        </Box>

        <Box mt={{ base: 10, md: 24 }} color="white">
          <VStack spacing={{ base: 3, md: 4 }} textAlign="center" mb={{ base: 5, md: 8 }}>
            <Badge bg="whiteAlpha.200" color="white" px={3} py={1} borderRadius="full" fontWeight="800">
              Fiche technique
            </Badge>
            <Heading as="h2" fontSize={{ base: "xl", sm: "2xl", md: "4xl" }} lineHeight="1.05">
              Caractéristiques techniques
            </Heading>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 2.5, md: 4 }} bg="rgba(15,23,42,0.34)" border="1px solid rgba(255,255,255,0.22)" borderRadius={{ base: "xl", md: "2xl" }} p={{ base: 4, md: 7 }} boxShadow="0 18px 55px rgba(15,23,42,0.25)" backdropFilter="blur(8px)">
            {ANNIVERSARY_920_TECHNICAL_SPECS.map((spec) => (
              <Flex key={spec.label} direction={{ base: "column", sm: "row" }} justify="space-between" gap={{ base: 1, sm: 4 }} align={{ base: "start", sm: "center" }} bg="whiteAlpha.200" border="1px solid rgba(255,255,255,0.16)" borderRadius="lg" px={{ base: 3, md: 4 }} py={{ base: 2.5, md: 3 }}>
                <Text fontSize={{ base: "xs", md: "md" }} fontWeight="700" color="whiteAlpha.800">
                  {spec.label}
                </Text>
                <Text fontSize={{ base: "sm", md: "md" }} fontWeight="900" textAlign={{ base: "left", sm: "right" }}>
                  {spec.value}
                </Text>
              </Flex>
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
}

// Résolution robuste (assets locaux vs uploads API)
function resolve(src) {
  if (!src) return src;
  if (src.startsWith('data:') || src.startsWith('http')) return src;
  if (src.startsWith('/assets/')) return src;              // assets du site
  if (src.startsWith('/')) return `${API_BASE_URL}${src}`; // /uploads/... -> API
  return `${API_BASE_URL}/${src}`;                         // relatif -> API
}

function toText(v) {
  if (v == null) return '';
  if (Array.isArray(v)) return v.map(toText).join(', ');
  if (typeof v === 'object') return Object.values(v).map(toText).join(', ');
  return String(v);
}

// utilitaire: teste si une image charge bien
function testImage(url) {
  return new Promise((resolveOk) => {
    if (typeof window === 'undefined' || !window.Image) {
      // En environnement non-browser, ne bloque pas
      resolveOk(true);
      return;
    }
    const img = new window.Image();
    img.onload = () => resolveOk(true);
    img.onerror = () => resolveOk(false);
    img.src = url;
  });
}

export default function VehicleDetails() {
  const { id } = useParams();
  const is920AnniversaryVehiclePage = id === '920' && is920AnniversaryVehiclePageActive();
  const [vehicle, setVehicle] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [heroBg, setHeroBg] = useState(null);       // URL choisie qui charge vraiment
  const [heroProbe, setHeroProbe] = useState(false); // terminé de sonder
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Always run hooks before any conditional return
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let abort = false;
    setLoading(true);

    if (is920AnniversaryVehiclePage) {
      setVehicle({ modele: '920', gallery: ['/assets/photos/p1-960.jpg'] });
      setEvents([]);
      setError(null);
      setLoading(false);
      return () => { abort = true; };
    }

    const fetchVehicle = fetch(`${API_BASE_URL}/public/vehicles/${id}`, { cache: 'no-store' })
      .then(r => { if (!r.ok) throw new Error('Vehicle not found'); return r.json(); });

    const fetchEvents = fetch(`${API_BASE_URL}/public/vehicles/${id}/events`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : [])
      .then(data => data.sort((a,b) => new Date(b.date) - new Date(a.date)))
      .catch(() => []);

    Promise.all([fetchVehicle, fetchEvents])
      .then(([vehicleData, eventsData]) => {
        if (abort) return;
        setVehicle(vehicleData);
        setEvents(eventsData);
      })
      .catch(e => {
        if (!abort) setError(e.message);
      })
      .finally(() => !abort && setLoading(false));

    return () => { abort = true; };
  }, [id, is920AnniversaryVehiclePage]);

  // Safe normalization
  const galleryArrayTop = Array.isArray(vehicle?.gallery) ? vehicle.gallery : [];
  const resolvedGalleryTop = galleryArrayTop.map(resolve);

  // Build hero candidates (inclut le fallback à la fin)
  const heroCandidates = useMemo(() => {
    const candidates = Array.from(new Set([
      resolve(vehicle?.backgroundImage || ''),
      ...resolvedGalleryTop,
      DEFAULT_VEHICLE_BG,
    ].filter(Boolean)));
    // debug éventuel...
    return candidates;
  }, [id, vehicle?.backgroundImage, JSON.stringify(resolvedGalleryTop)]);
  
  // Stable key for probe effect
  const heroKey = useMemo(() => JSON.stringify(heroCandidates), [heroCandidates]);

  // Hero probe effect
  useEffect(() => {
    let stop = false;
    (async () => {
      setHeroProbe(false);
      if (heroCandidates.length === 0) {
        setHeroBg(null);
        setHeroProbe(true);
        return;
      }
      for (const url of heroCandidates) {
        const ok = await testImage(url);
        if (stop) return;
        if (ok) {
          setHeroBg(url);
          setHeroProbe(true);
          return;
        }
      }
      setHeroBg(null);
      setHeroProbe(true);
    })();
    return () => { stop = true; };
  }, [heroKey]);

  // Guards loading/error/not found
  if (loading) {
    return <Center h="60vh"><Spinner size="xl" color="blue.400" /></Center>;
  }
  
  if (error) {
    return (
      <Center h="60vh">
        <VStack spacing={4}>
          <Heading size="md">Erreur de chargement</Heading>
          <Text>{String(error)}</Text>
          <Button as={Link} to="/parc" leftIcon={<FiArrowLeft />}>Retour aux véhicules</Button>
        </VStack>
      </Center>
    );
  }
  
  if (!vehicle) {
    return (
      <Box
        position="relative"
        width="100vw"
        height="calc(100vh - var(--header-h) - var(--nav-h))"
        marginLeft="calc(-50vw + 50%)"
        marginRight="calc(-50vw + 50%)"
        backgroundImage={`url("${DEFAULT_VEHICLE_BG}")`}
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box bg="blackAlpha.700" borderRadius="lg" p={8} textAlign="center">
          <Button as={Link} to="/parc" leftIcon={<FiArrowLeft />} mb={6} colorScheme="white" variant="outline">
            Retour aux véhicules
          </Button>
          <Heading as="h1" size="2xl" mb={4} color="white">
            Véhicule non trouvé
          </Heading>
          <Text fontSize="lg" color="white">Le véhicule demandé n'existe pas.</Text>
        </Box>
      </Box>
    );
  }

  if (is920AnniversaryVehiclePage) {
    return <Anniversary920VehiclePage />;
  }

  // From here, vehicle is defined
  const hasExplicitBg = !!(vehicle && vehicle.backgroundImage);
  const fallbackBg = resolve(
    vehicle.backgroundImage || resolvedGalleryTop[0] || DEFAULT_VEHICLE_BG
  );
  const backgroundPosition = vehicle.backgroundPosition || 'center';

  // AJOUT: logique simplifiée qui force l'affichage
  const displayBg = vehicle?.backgroundImage 
    ? resolve(vehicle.backgroundImage)
    : resolvedGalleryTop.length > 0 
      ? resolvedGalleryTop[0]
      : DEFAULT_VEHICLE_BG;
  
  // Gallery: if background is explicit, show all; otherwise drop the first (used as bg)
  const galleryImages = hasExplicitBg ? resolvedGalleryTop : resolvedGalleryTop.slice(1);

  const fullTitle = vehicle.marque ? `${vehicle.marque} ${vehicle.modele}` : vehicle.modele;
  const regYear = vehicle.miseEnCirculation ? new Date(vehicle.miseEnCirculation).getFullYear() : null;

  // Navigation
  const prevImage = () => {
    if (!galleryImages.length) return;
    setSelectedImage(i => (i - 1 + galleryImages.length) % galleryImages.length);
  };
  const nextImage = () => {
    if (!galleryImages.length) return;
    setSelectedImage(i => (i + 1) % galleryImages.length);
  };

  return (
    <Box
      className="vehicle-detail-landing"
      position="relative"
      width="100vw"
      minHeight="calc(100vh - var(--header-h) - var(--nav-h))"
      marginLeft="calc(-50vw + 50%)"
      marginRight="calc(-50vw + 50%)"
      style={{
        backgroundImage: `url("${displayBg}")`,
        backgroundSize: 'cover',
        backgroundPosition: backgroundPosition,
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* overlay sombre au-dessus du fond */}
      <Box position="absolute" inset={0} bg="blackAlpha.600" zIndex={1} />

      {/* Contenu par-dessus l'overlay */}
      <Box position="relative" zIndex={2} py={8}>
        <Container maxW="7xl">
          {/* Navigation */}
          <Button
            as={Link}
            to="/parc"
            leftIcon={<FiArrowLeft />}
            mb={6}
            colorScheme="whiteAlpha"
            variant="solid"
            bg="whiteAlpha.200"
            _hover={{ bg: "whiteAlpha.300" }}
            color="white"
          >
            Retour aux véhicules
          </Button>

          {/* Banderole d'événement */}
          <EventBanner events={events} />

          {/* En-tête directement sur l'image de fond */}
          <VStack align="start" spacing={4} mb={6}>
            <HStack>
              {/* 2) Utiliser regYear au lieu de miseEnCirc */}
              {regYear && (
                <Badge colorScheme="blue" fontSize="md" px={3} py={1} bg="blue.500" color="white">
                  {regYear}
                </Badge>
              )}
              {vehicle.immat && (
                <Box>
                  <ChakraImage
                    src={`${API_BASE_URL}/public/plaque/${vehicle.immat.replace(/\s+/g, '-')}`}
                    alt={vehicle.immat}
                    maxH="45px"
                    h="auto"
                    borderRadius="4px"
                    boxShadow="md"
                    fallback={
                      <Badge colorScheme="green" fontSize="md" px={3} py={1} bg="green.500" color="white">
                        {vehicle.immat}
                      </Badge>
                    }
                  />
                </Box>
              )}
              {vehicle.etat && (
                <Badge colorScheme="orange" fontSize="md" px={3} py={1} bg="orange.500" color="white">
                  {vehicle.etat}
                </Badge>
              )}
            </HStack>
            <Heading as="h1" size="2xl" color="white" textShadow="2px 2px 4px rgba(0,0,0,0.8)">
              {fullTitle}
            </Heading>
            {vehicle.subtitle && (
              <Text fontSize="xl" color="white" fontWeight="medium" textShadow="1px 1px 2px rgba(0,0,0,0.8)">
                {vehicle.subtitle}
              </Text>
            )}
          </VStack>

          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
            {/* Galerie photos compacte */}
            <Box>
              <Heading as="h2" size="lg" mb={4} color="white" textShadow="2px 2px 4px rgba(0,0,0,0.8)">
                Photos
              </Heading>
              
              {/* Image principale réduite */}
              {galleryImages.length > 0 && (
                <Box position="relative" mb={3}>
                  <ChakraImage
                    src={galleryImages[selectedImage]}
                    alt={`${fullTitle} - Photo ${selectedImage + 1}`}
                    borderRadius="md"
                    width="100%"
                    height="200px"
                    objectFit="cover"
                    cursor="pointer"
                    onClick={onOpen}
                    transition="transform 0.2s"
                    _hover={{ transform: "scale(1.02)" }}
                    border="2px solid white"
                    onError={(e) => {
                      if (e.currentTarget.src !== DEFAULT_VEHICLE_BG) {
                        e.currentTarget.src = DEFAULT_VEHICLE_BG;
                      }
                    }}
                  />
                  
                  {/* Navigation des images */}
                  {galleryImages.length > 1 && (
                    <>
                      <IconButton
                        position="absolute"
                        left={2}
                        top="50%"
                        transform="translateY(-50%)"
                        icon={<FiChevronLeft />}
                        onClick={prevImage}
                        bg="blackAlpha.600"
                        color="white"
                        _hover={{ bg: "blackAlpha.800" }}
                        size="sm"
                        aria-label="Image précédente"
                      />
                      <IconButton
                        position="absolute"
                        right={2}
                        top="50%"
                        transform="translateY(-50%)"
                        icon={<FiChevronRight />}
                        onClick={nextImage}
                        bg="blackAlpha.600"
                        color="white"
                        _hover={{ bg: "blackAlpha.800" }}
                        size="sm"
                        aria-label="Image suivante"
                      />
                    </>
                  )}
                </Box>
              )}

              {/* Miniatures compactes */}
              <SimpleGrid columns={3} spacing={1}>
                {galleryImages.map((src, index) => (
                  <ChakraImage
                    key={index}
                    src={src}
                    alt={`Miniature ${index + 1}`}
                    borderRadius="md"
                    height="40px"
                    objectFit="cover"
                    cursor="pointer"
                    border={selectedImage === index ? "2px solid" : "1px solid"}
                    borderColor={selectedImage === index ? "blue.300" : "white"}
                    onClick={() => setSelectedImage(index)}
                    transition="all 0.2s"
                    _hover={{ borderColor: "blue.300" }}
                    onError={(e) => {
                      if (e.currentTarget.src !== DEFAULT_VEHICLE_BG) {
                        e.currentTarget.src = DEFAULT_VEHICLE_BG;
                      }
                    }}
                  />
                ))}
              </SimpleGrid>
            </Box>

            {/* Caractéristiques techniques - plus d'espace */}
            <Box gridColumn={{ base: "1", lg: "2 / 4" }}>
              <Heading as="h2" size="lg" mb={4} color="white" textShadow="2px 2px 4px rgba(0,0,0,0.8)">
                Caractéristiques techniques
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                {Array.isArray(vehicle.caracteristiques) && vehicle.caracteristiques.map((carac, index) => (
                  <Flex key={index} justify="space-between" py={2} bg="blackAlpha.300" px={4} borderRadius="md">
                    <Text fontWeight="medium" color="white" textShadow="1px 1px 2px rgba(0,0,0,0.8)" fontSize="sm">
                      {toText(carac.label)}
                    </Text>
                    <Text color="white" fontWeight="semibold" textShadow="1px 1px 2px rgba(0,0,0,0.8)" fontSize="sm">
                      {toText(carac.value)}
                    </Text>
                  </Flex>
                ))}
              </SimpleGrid>
            </Box>
          </SimpleGrid>

          {/* Description et histoire en dessous */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mt={8}>
            {vehicle.description && (
              <Box>
                <Heading as="h2" size="lg" mb={4} color="white" textShadow="2px 2px 4px rgba(0,0,0,0.8)">
                  Description
                </Heading>
                <Box bg="blackAlpha.300" p={6} borderRadius="md">
                  <Text fontSize="md" lineHeight="tall" color="white" textShadow="1px 1px 2px rgba(0,0,0,0.8)">
                    {vehicle.description}
                  </Text>
                </Box>
              </Box>
            )}

            {vehicle.history && (
              <Box>
                <Heading as="h2" size="lg" mb={4} color="white" textShadow="2px 2px 4px rgba(0,0,0,0.8)">
                  Histoire
                </Heading>
                <Box bg="blackAlpha.300" p={6} borderRadius="md">
                  <Text fontSize="md" lineHeight="tall" color="white" textShadow="1px 1px 2px rgba(0,0,0,0.8)">
                    {vehicle.history}
                  </Text>
                </Box>
              </Box>
            )}
          </SimpleGrid>

          {/* Modal plein écran */}
          <Modal isOpen={isOpen} onClose={onClose} size="6xl">
            <ModalOverlay bg="blackAlpha.800" />
            <ModalContent bg="transparent" shadow="none">
              <ModalCloseButton color="white" size="lg" />
              <ModalBody p={0}>
                {galleryImages[selectedImage] && (
                  <ChakraImage
                    src={galleryImages[selectedImage]}
                    alt={`${fullTitle} - Photo agrandie`}
                    width="100%"
                    height="auto"
                    maxH="90vh"
                    objectFit="contain"
                    onError={(e) => {
                      if (e.currentTarget.src !== DEFAULT_VEHICLE_BG) {
                        e.currentTarget.src = DEFAULT_VEHICLE_BG;
                      }
                    }}
                  />
                )}
              </ModalBody>
            </ModalContent>
          </Modal>

        </Container>
      </Box>
    </Box>
  );
}
