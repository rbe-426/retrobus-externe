import React, { useState, useEffect } from "react";
import SEO, { jsonLdSchemas } from "../components/SEO";
import {
  Container,
  Heading,
  Text,
  Box,
  Image,
  SimpleGrid,
  Button,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { API_BASE } from '../lib/api';
import { ENABLE_TEMPORARY_ANNIVERSARY_920 } from "../lib/featureFlags";

// Images par défaut pour les véhicules
const defaultImages = {
  "920": ["/assets/photos/p1-960.jpg"],
};

const ENABLE_ANNIVERSARY_920 = ENABLE_TEMPORARY_ANNIVERSARY_920;

function createLicensePlateImage(value) {
  const safeValue = String(value || '').replace(/[<>&"']/g, '');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="520" height="110" viewBox="0 0 520 110" role="img" aria-label="Immatriculation ${safeValue}">
      <rect x="2" y="2" width="516" height="106" rx="8" fill="#ffffff" stroke="#151515" stroke-width="3"/>
      <rect x="2" y="2" width="50" height="106" rx="5" fill="#003399"/>
      <path d="M48 2h1v106h-1z" fill="#000000" opacity="0.25"/>
      <g fill="#ffcc00" transform="translate(25 29)">
        <circle r="2.15" transform="rotate(0) translate(0 -14)"/><circle r="2.15" transform="rotate(30) translate(0 -14)"/>
        <circle r="2.15" transform="rotate(60) translate(0 -14)"/><circle r="2.15" transform="rotate(90) translate(0 -14)"/>
        <circle r="2.15" transform="rotate(120) translate(0 -14)"/><circle r="2.15" transform="rotate(150) translate(0 -14)"/>
        <circle r="2.15" transform="rotate(180) translate(0 -14)"/><circle r="2.15" transform="rotate(210) translate(0 -14)"/>
        <circle r="2.15" transform="rotate(240) translate(0 -14)"/><circle r="2.15" transform="rotate(270) translate(0 -14)"/>
        <circle r="2.15" transform="rotate(300) translate(0 -14)"/><circle r="2.15" transform="rotate(330) translate(0 -14)"/>
      </g>
      <text x="25" y="88" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#ffffff">F</text>
      <rect x="472" y="2" width="46" height="106" rx="6" fill="#003399"/>
      <path d="M471 2h1v106h-1z" fill="#000000" opacity="0.25"/>
      <text x="495" y="44" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#ffffff">FR</text>
      <text x="495" y="78" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="#ffffff">91</text>
      <text x="260" y="76" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="60" font-weight="700" letter-spacing="0.2" textLength="380" lengthAdjust="spacingAndGlyphs" fill="#111111">${safeValue}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function LicensePlatePreview({ value }) {
  return (
    <Image
      src={createLicensePlateImage(value)}
      alt={`Plaque d'immatriculation ${value}`}
      htmlWidth={520}
      htmlHeight={110}
      maxW={{ base: "155px", sm: "180px" }}
      h="auto"
      borderRadius="5px"
      boxShadow="xs"
      loading="lazy"
      decoding="async"
    />
  );
}

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CACHE_KEY = "rbe:public:vehicles";
  const CACHE_TTL_MS = 10 * 60 * 1000;

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    // Affichage immédiat depuis cache pour limiter le temps de perception
    try {
      const cachedRaw = sessionStorage.getItem(CACHE_KEY);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        if (cached?.timestamp && Array.isArray(cached?.data)) {
          const isFresh = Date.now() - cached.timestamp < CACHE_TTL_MS;
          if (isFresh && cached.data.length > 0) {
            setVehicles(cached.data);
            setLoading(false);
          }
        }
      }
    } catch {
      // ignore cache errors
    }

    try {
      if (vehicles.length === 0) {
        setLoading(true);
      }
      const response = await fetch(`${API_BASE}/public/vehicles`);
      if (!response.ok) {
        throw new Error('Impossible de charger les véhicules');
      }
      const data = await response.json();
      setVehicles(data);

      try {
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), data })
        );
      } catch {
        // ignore cache write errors
      }
    } catch (err) {
      console.error('Erreur chargement véhicules:', err);
      setError(err.message);
      // fallback statique
      setVehicles([
        {
          parc: "920",
          immat: "FG-920-RE",
          modele: "Mercedes-Benz Citaro",
          type: "Bus",
          etat: "Préservé",
          miseEnCirculation: "2001-07-01"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxW="6xl" py={{ base: 6, md: 10 }} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Chargement des véhicules...</Text>
      </Container>
    );
  }

  return (
    <>
      <SEO 
        title="Notre Flotte de Véhicules Historiques - RétroBus Essonne"
        description="Découvrez notre collection unique de bus et autocars historiques : Mercedes Citaro, véhicules RATP vintage et autres pièces du patrimoine automobile français. Histoire, caractéristiques techniques et photos de chaque véhicule."
        keywords="flotte véhicules, bus historiques, autocars collection, Mercedes Citaro, RATP vintage, véhicules anciens, patrimoine transport, collection bus, véhicules restaurés"
        url="https://www.association-rbe.fr/parc"
        image="/assets/920_pres.jpg"
        jsonLd={jsonLdSchemas.itemList([], "Collection de véhicules historiques RétroBus Essonne")}
      />

      <Container maxW="6xl" py={{ base: 6, md: 10 }}>
        <VStack className="page-header" spacing={4} mb={8} textAlign="center">
          <Heading as="h1" size="2xl" className="page-title">
            Nos Véhicules
          </Heading>
          <Text className="page-subtitle">
            Découvrez notre collection et l’histoire des transports franciliens.
          </Text>
        </VStack>

        {error && (
          <Alert status="warning" mb={6}>
            <AlertIcon />
            Données en mode hors ligne. {error}
          </Alert>
        )}

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {vehicles.map((vehicle) => {
            const isAnniversary920 = ENABLE_ANNIVERSARY_920 && vehicle.parc === "920";

            return (
            <Box
              key={vehicle.parc}
              border="1px solid"
              borderColor={isAnniversary920 ? "rgba(255,255,255,0.24)" : "gray.200"}
              borderRadius="md"
              overflow="hidden"
              p={4}
              bg={isAnniversary920 ? "linear-gradient(135deg, #7d0530 0%, #9f063a 54%, #5b0326 100%)" : "white"}
              color={isAnniversary920 ? "white" : "inherit"}
              shadow={isAnniversary920 ? "xl" : "sm"}
              _hover={{ shadow: isAnniversary920 ? "2xl" : "md", transform: isAnniversary920 ? "translateY(-2px)" : "none" }}
              transition="all 0.2s"
              position="relative"
            >
              <Box position="relative">
                <Image
                  src={vehicle.thumbnailImage || defaultImages[vehicle.parc]?.[0] || "/assets/photos/p1-960.jpg"}
                  alt={vehicle.modele}
                  htmlWidth={960}
                  htmlHeight={640}
                  objectFit="cover"
                  w="100%"
                  h="200px"
                  mb={4}
                  borderRadius="md"
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Badge 25 ans pour le 920 */}
                {ENABLE_ANNIVERSARY_920 && vehicle.parc === "920" && (
                  <Badge
                    position="absolute"
                    top={2}
                    right={2}
                    bg="gold"
                    color="black"
                    fontSize="sm"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontWeight="bold"
                    boxShadow="lg"
                  >
                    🎉 25 ANS
                  </Badge>
                )}
              </Box>
              
              {vehicle.marque && (
                <Text fontSize="xs" color={isAnniversary920 ? "whiteAlpha.800" : "gray.500"} mb={1} fontWeight="500">
                  {vehicle.marque}
                  {vehicle.type && ` • ${vehicle.type}`}
                </Text>
              )}
              
              <Heading as="h2" size="md" mb={2}>
                {vehicle.modele}
              </Heading>
              
              <Text color={isAnniversary920 ? "whiteAlpha.900" : "gray.600"} fontSize="sm" mb={1}>
                <strong>Parc :</strong> {vehicle.parc}
              </Text>
              
              {vehicle.immat ? (
                <Box mb={3}>
                  <Text color={isAnniversary920 ? "whiteAlpha.900" : "gray.600"} fontSize="sm" mb={1} fontWeight="bold">
                    Immatriculation :
                  </Text>
                  <LicensePlatePreview value={vehicle.immat} />
                </Box>
              ) : (
                <Text color={isAnniversary920 ? "whiteAlpha.900" : "gray.600"} fontSize="sm" mb={1}>
                  <strong>Immatriculation :</strong> Non renseignée
                </Text>
              )}
              
              <Text color={isAnniversary920 ? "whiteAlpha.900" : "gray.600"} fontSize="sm" mb={1}>
                <strong>État :</strong> {vehicle.etat}
              </Text>
              
              {vehicle.miseEnCirculation && (
                <Text color={isAnniversary920 ? "whiteAlpha.900" : "gray.600"} fontSize="sm" mb={4}>
                  <strong>Mise en circulation :</strong> {new Date(vehicle.miseEnCirculation).getFullYear()}
                </Text>
              )}

              <Link to={`/vehicles/${vehicle.parc}`}>
                <Button colorScheme={isAnniversary920 ? "whiteAlpha" : "teal"} bg={isAnniversary920 ? "white" : undefined} color={isAnniversary920 ? "#7d0530" : undefined} size="sm">
                  Voir les détails
                </Button>
              </Link>
              
              {vehicle.synced_from === 'intranet' && (
                <Text fontSize="xs" color="green.500" mt={2}>
                  🔄 Synchronisé depuis l'intranet
                </Text>
              )}
            </Box>
            );
          })}
        </SimpleGrid>

        {vehicles.length === 0 && !loading && (
          <Text textAlign="center" color="gray.500" py={8}>
            Aucun véhicule disponible pour le moment.
          </Text>
        )}
      </Container>
    </>
  );
}
