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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://attractive-kindness-rbe-serveurs.up.railway.app';

// Fallback global pour les fonds de véhicules
const DEFAULT_VEHICLE_BG = '/assets/fallback/_MG_1006.jpg';

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
  }, [id]);

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
