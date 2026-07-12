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

// Images par défaut pour les véhicules
const defaultImages = {
  "920": ["/assets/photos/p1-960.jpg"],
};

const ENABLE_ANNIVERSARY_920 = false;

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
        url="https://www.association-rbe.fr/vehicles"
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
          {vehicles.map((vehicle) => (
            <Box
              key={vehicle.parc}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              overflow="hidden"
              p={4}
              bg="white"
              shadow="sm"
              _hover={{ shadow: "md" }}
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
                <Text fontSize="xs" color="gray.500" mb={1} fontWeight="500">
                  {vehicle.marque}
                  {vehicle.type && ` • ${vehicle.type}`}
                </Text>
              )}
              
              <Heading as="h2" size="md" mb={2}>
                {vehicle.modele}
              </Heading>
              
              <Text color="gray.600" fontSize="sm" mb={1}>
                <strong>Parc:</strong> {vehicle.parc}
              </Text>
              
              {vehicle.immat ? (
                <Box mb={3}>
                  <Text fontSize="xs" color="gray.500" mb={1} fontWeight="600">
                    Immatriculation
                  </Text>
                  <Image
                    src={`${API_BASE}/public/plaque/${vehicle.immat.replace(/\s+/g, '-')}`}
                    alt={vehicle.immat}
                    htmlWidth={260}
                    htmlHeight={64}
                    maxW="260px"
                    h="auto"
                    borderRadius="4px"
                    boxShadow="sm"
                    loading="lazy"
                    decoding="async"
                    fallback={
                      <Text color="gray.600" fontSize="sm">
                        {vehicle.immat}
                      </Text>
                    }
                  />
                </Box>
              ) : (
                <Text color="gray.600" fontSize="sm" mb={1}>
                  <strong>Immatriculation:</strong> Non renseignée
                </Text>
              )}
              
              <Text color="gray.600" fontSize="sm" mb={1}>
                <strong>État:</strong> {vehicle.etat}
              </Text>
              
              {vehicle.miseEnCirculation && (
                <Text color="gray.600" fontSize="sm" mb={4}>
                  <strong>Mise en circulation:</strong> {new Date(vehicle.miseEnCirculation).getFullYear()}
                </Text>
              )}

              <Link to={`/vehicles/${vehicle.parc}`}>
                <Button colorScheme="teal" size="sm">
                  Voir les détails
                </Button>
              </Link>
              
              {vehicle.synced_from === 'intranet' && (
                <Text fontSize="xs" color="green.500" mt={2}>
                  🔄 Synchronisé depuis l'intranet
                </Text>
              )}
            </Box>
          ))}
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
