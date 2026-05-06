import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Container,
  Heading,
  Text,
  Box,
  Image,
  SimpleGrid,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import vehicleImage1 from "../assets/920_pres.jpg";
import { API_BASE } from '../lib/api';

// Images par défaut pour les véhicules
const defaultImages = {
  "920": [vehicleImage1],
};

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/public/vehicles`);
      if (!response.ok) {
        throw new Error('Impossible de charger les véhicules');
      }
      const data = await response.json();
      setVehicles(data);
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
      <Helmet>
        <title>Véhicules — RétroBus Essonne</title>
        <meta name="description" content="Liste des véhicules de RétroBus Essonne" />
      </Helmet>

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
            >
              <Image
                src={vehicle.thumbnailImage || defaultImages[vehicle.parc]?.[0] || vehicleImage1}
                alt={vehicle.modele}
                objectFit="cover"
                w="100%"
                h="200px"
                mb={4}
                borderRadius="md"
              />
              
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
                    maxW="260px"
                    h="auto"
                    borderRadius="4px"
                    boxShadow="sm"
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
