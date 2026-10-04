import React, { useState, useEffect } from "react";
import {
  Container, Heading, Text, VStack, HStack, Card, CardBody, 
  CardHeader, Spinner, Alert, AlertIcon, Box, List, ListItem, ListIcon
} from "@chakra-ui/react";
import { FiCheck } from 'react-icons/fi';
import SEO from "../components/SEO";

const API_BASE = import.meta.env.VITE_API_URL || 'https://attractive-kindness-rbe-serveurs.up.railway.app';

const FALLBACK_CHANGELOG = [
  {
    version: '2.8.0',
    date: '2026-10-04',
    title: 'Parcours public et identité Trilogy',
    changes: [
      'Nouvelle présentation de l’association et de ses missions sur la page À propos.',
      'Page Nous soutenir harmonisée avec la palette Trilogy : dons, adhésion et mécénat dans un parcours plus lisible.',
      'Modes de don et candidature d’adhésion clarifiés dans des fenêtres cohérentes avec l’identité RétroBus.',
      'Actualités publiques accessibles avec des URLs fondées sur le titre, tout en préservant les anciens liens.',
      'Accueil enrichi avec une présentation de l’association et un accès direct aux soutiens possibles.'
    ]
  }
];

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export default function Changelog() {
  const [changelog, setChangelog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChangelog();
  }, []);

  const loadChangelog = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try absolute API first if provided, else relative (rewritten by Vercel)
      const urls = [];
      if (API_BASE) urls.push(`${API_BASE.replace(/\/$/, '')}/changelog`);
      urls.push('/changelog');

      let data = null;
      let lastErr = null;
      for (const url of urls) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            data = await res.json();
            break;
          } else {
            lastErr = new Error(`HTTP ${res.status}`);
          }
        } catch (e) {
          lastErr = e;
        }
      }

      if (!data) throw lastErr || new Error('Changelog indisponible');
      const versions = Array.isArray(data) ? data : data.versions;
      setChangelog(Array.isArray(versions) && versions.length > 0 ? versions : FALLBACK_CHANGELOG);
    } catch (err) {
      console.error('Erreur chargement changelog:', err);
      setChangelog(FALLBACK_CHANGELOG);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Changelog - Historique des Versions | RétroBus Essonne"
        description="Historique complet des versions et mises à jour de l'application RétroBus Essonne : nouvelles fonctionnalités, améliorations et corrections de bugs. Suivez l'évolution de notre plateforme."
        keywords="changelog, historique, versions, mises à jour, nouveautés, améliorations, corrections, release notes, historique versions"
        url="https://www.association-rbe.fr/changelog"
        noIndex={true}
      />

      <Container maxW="container.md" py={10}>
        {/* En-tête */}
        <VStack spacing={6} textAlign="center" mb={10}>
          <Heading as="h1" size="xl" color="var(--rbe-red)">
            📝 Historique des versions
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl">
            Découvrez les dernières fonctionnalités, corrections et améliorations 
            apportées à l'application RétroBus Essonne.
          </Text>
        </VStack>

        {/* Contenu */}
        {loading ? (
          <VStack spacing={4} py={10}>
            <Spinner size="xl" color="var(--rbe-red)" />
            <Text color="gray.600">Chargement de l'historique...</Text>
          </VStack>
        ) : error ? (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold">Erreur de chargement</Text>
              <Text fontSize="sm">{error}</Text>
            </VStack>
          </Alert>
        ) : changelog.length === 0 ? (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold">Aucune version disponible</Text>
              <Text fontSize="sm">L'historique des versions sera bientôt disponible.</Text>
            </VStack>
          </Alert>
        ) : (
          <VStack spacing={4} align="stretch">
            {changelog.map((entry, index) => (
              <Card 
                key={index} 
                variant="outline"
                shadow="sm"
                _hover={{ shadow: "md" }}
                transition="all 0.2s"
              >
                <CardHeader>
                  <HStack justify="space-between" w="full">
                    <Heading size="md" color="gray.800">
                      v{entry.version}{entry.title ? ` - ${entry.title}` : ''}
                    </Heading>
                    <Text fontSize="sm" color="gray.500">
                      {formatDate(entry.date)}
                    </Text>
                  </HStack>
                </CardHeader>
                {Array.isArray(entry.changes) && entry.changes.length > 0 && (
                  <CardBody pt={0}>
                    <List spacing={2} color="gray.700">
                      {entry.changes.map((change) => (
                        <ListItem key={change} display="flex" alignItems="flex-start">
                          <ListIcon as={FiCheck} color="var(--rbe-red)" mt={1} />
                          <Text>{change}</Text>
                        </ListItem>
                      ))}
                    </List>
                  </CardBody>
                )}
              </Card>
            ))}
          </VStack>
        )}

        {/* Footer avec info */}
        {!loading && !error && changelog.length > 0 && (
          <Box mt={10} pt={6} borderTop="1px solid" borderColor="gray.200">
            <VStack spacing={2}>
              <Text fontSize="sm" color="gray.500" textAlign="center">
                {changelog.length} version{changelog.length > 1 ? 's' : ''} disponible{changelog.length > 1 ? 's' : ''}
              </Text>
            </VStack>
          </Box>
        )}
      </Container>
    </>
  );
}