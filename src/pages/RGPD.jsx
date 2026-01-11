import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Box, Container, Heading, Text, VStack, Link as CLink, List, ListItem, ListIcon } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

export default function RGPD() {
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Politique RGPD & Confidentialité - RétroBus Essonne</title>
        <meta name="description" content="Politique de confidentialité et RGPD de l'association RétroBus Essonne" />
      </Helmet>

      <Container maxW="800px" py={12} px={4}>
        <VStack align="start" spacing={6}>
          <Box>
            <Heading as="h1" size="xl" color="var(--rbe-red)" mb={4}>
              Politique de Confidentialité & RGPD
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </Text>
          </Box>

          {/* Introduction */}
          <Box>
            <Heading as="h2" size="md" color="var(--rbe-red)" mb={3}>
              1. Introduction
            </Heading>
            <Text fontSize="sm">
              L'association RétroBus Essonne s'engage à protéger votre vie privée. Cette politique explique comment nous collectons, 
              utilisons, conservons et protégeons vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD).
            </Text>
          </Box>

          {/* Données collectées */}
          <Box>
            <Heading as="h2" size="md" color="var(--rbe-red)" mb={3}>
              2. Données Personnelles Collectées
            </Heading>
            <Text fontSize="sm" mb={3}>
              Nous collectons les données personnelles suivantes :
            </Text>
            <List spacing={2}>
              <ListItem fontSize="sm">
                <ListIcon as={FaCheckCircle} color="var(--rbe-red)" />
                <strong>Formulaire de contact :</strong> Nom, email, sujet et message
              </ListItem>
              <ListItem fontSize="sm">
                <ListIcon as={FaCheckCircle} color="var(--rbe-red)" />
                <strong>Inscription aux événements :</strong> Nom, prénom, email, téléphone
              </ListItem>
              <ListItem fontSize="sm">
                <ListIcon as={FaCheckCircle} color="var(--rbe-red)" />
                <strong>Newsletter :</strong> Email
              </ListItem>
              <ListItem fontSize="sm">
                <ListIcon as={FaCheckCircle} color="var(--rbe-red)" />
                <strong>Données de navigation :</strong> Adresse IP, type de navigateur, pages visitées (via analytics)
              </ListItem>
              <ListItem fontSize="sm">
                <ListIcon as={FaCheckCircle} color="var(--rbe-red)" />
                <strong>Compte utilisateur :</strong> Identifiant, données de profil pour les adhérents
              </ListItem>
            </List>
          </Box>

          {/* Base légale */}
          <Box>
            <Heading as="h2" size="md" color="var(--rbe-red)" mb={3}>
              3. Base Légale du Traitement
            </Heading>
            <VStack align="start" spacing={2} fontSize="sm">
              <Text>
                <strong>Consentement :</strong> Vous acceptez explicitement que vos données soient traitées
              </Text>
              <Text>
                <strong>Exécution d'un contrat :</strong> Pour les inscriptions aux événements
              </Text>
              <Text>
                <strong>Obligations légales :</strong> Respect de la législation française et européenne
              </Text>
              <Text>
                <strong>Intérêts légitimes :</strong> Communication et amélioration de nos services
              </Text>
            </VStack>
          </Box>

          {/* Utilisation des données */}
          <Box>
            <Heading as="h2" size="md" color="var(--rbe-red)" mb={3}>
              4. Utilisation de Vos Données
            </Heading>
            <VStack align="start" spacing={2} fontSize="sm">
              <Text>Nous utilisons vos données pour :</Text>
              <List spacing={1}>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="var(--rbe-red)" />
                  Répondre à vos demandes de contact
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="var(--rbe-red)" />
                  Gérer les inscriptions aux événements
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="var(--rbe-red)" />
                  Envoyer des informations et actualités (si consentement)
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="var(--rbe-red)" />
                  Analyser les statistiques de visite du site
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="var(--rbe-red)" />
                  Améliorer nos services et contenu
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="var(--rbe-red)" />
                  Respecter les obligations légales
                </ListItem>
              </List>
            </VStack>
          </Box>

          {/* Partage des données */}
          <Box>
            <Heading as="h2" size="md" color="var(--rbe-red)" mb={3}>
              5. Partage de Vos Données
            </Heading>
            <VStack align="start" spacing={2} fontSize="sm">
              <Text>
                <strong>Pas de vente :</strong> Nous ne vendons jamais vos données personnelles à des tiers.
              </Text>
              <Text>
                <strong>Prestataires :</strong> Nous pouvons partager vos données avec nos prestataires techniques 
                (hébergement, email) qui respectent des obligations de confidentialité.
              </Text>
              <Text>
                <strong>Obligations légales :</strong> Nous pouvons divulguer vos données si exigé par la loi.
              </Text>
            </VStack>
          </Box>

          {/* Conservation */}
          <Box>
            <Heading as="h2" size="md" color="var(--rbe-red)" mb={3}>
              6. Durée de Conservation
            </Heading>
            <VStack align="start" spacing={2} fontSize="sm">
              <Text>
                <strong>Formulaires de contact :</strong> 3 ans maximum
              </Text>
              <Text>
                <strong>Inscriptions aux événements :</strong> Durée de l'événement + 1 an
              </Text>
              <Text>
                <strong>Newsletter :</strong> Jusqu'à désinscription
              </Text>
              <Text>
                <strong>Données de navigation :</strong> 13 mois maximum
              </Text>
            </VStack>
          </Box>

          {/* Droits RGPD */}
          <Box>
            <Heading as="h2" size="md" color="var(--rbe-red)" mb={3}>
              7. Vos Droits RGPD
            </Heading>
            <Text fontSize="sm" mb={3}>
              Vous disposez des droits suivants :
            </Text>
            <List spacing={2}>
              <ListItem fontSize="sm">
                <ListIcon as={FaCheckCircle} color="var(--rbe-red)" />
                <strong>Droit d'accès :</strong> Obtenir une copie de vos données
              </ListItem>
              <ListItem fontSize="sm">
                <ListIcon as={FaCheckCircle} color="var(--rbe-red)" />
                <strong>Droit de rectification :</strong> Corriger vos données inexactes
              </ListItem>
              <ListItem fontSize="sm">
                <ListIcon as={FaCheckCircle} color="var(--rbe-red)" />
                <strong>Droit à l'oubli :</strong> Demander la suppression de vos données
              </ListItem>
              <ListItem fontSize="sm">
                <ListIcon as={FaCheckCircle} color="var(--rbe-red)" />
                <strong>Droit à la limitation :</strong> Limiter le traitement de vos données
              </ListItem>
              <ListItem fontSize="sm">
                <ListIcon as={FaCheckCircle} color="var(--rbe-red)" />
                <strong>Droit à la portabilité :</strong> Récupérer vos données dans un format courant
              </ListItem>
              <ListItem fontSize="sm">
                <ListIcon as={FaCheckCircle} color="var(--rbe-red)" />
                <strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données
              </ListItem>
            </List>
          </Box>

          {/* Exercer vos droits */}
          <Box>
            <Heading as="h2" size="md" color="var(--rbe-red)" mb={3}>
              8. Comment Exercer Vos Droits
            </Heading>
            <Text fontSize="sm">
              Pour exercer l'un de ces droits, veuillez nous contacter à :{" "}
              <CLink href="mailto:association.rbe@gmail.com" color="var(--rbe-red)">
                association.rbe@gmail.com
              </CLink>
            </Text>
            <Text fontSize="sm" mt={2}>
              Nous traiterons votre demande dans un délai de 30 jours maximum.
            </Text>
          </Box>

          {/* Sécurité */}
          <Box>
            <Heading as="h2" size="md" color="var(--rbe-red)" mb={3}>
              9. Sécurité des Données
            </Heading>
            <VStack align="start" spacing={2} fontSize="sm">
              <Text>
                Nous mettons en place des mesures de sécurité appropriées pour protéger vos données contre 
                l'accès non autorisé, la modification ou la suppression.
              </Text>
              <Text>
                Cependant, aucun système n'est absolument sécurisé. Nous encourageons les utilisateurs à protéger 
                leurs mots de passe et à nous signaler toute activité suspecte.
              </Text>
            </VStack>
          </Box>

          {/* Cookies */}
          <Box>
            <Heading as="h2" size="md" color="var(--rbe-red)" mb={3}>
              10. Cookies
            </Heading>
            <VStack align="start" spacing={2} fontSize="sm">
              <Text>
                Notre site utilise des cookies pour améliorer votre expérience utilisateur et analyser le trafic.
              </Text>
              <Text>
                Vous pouvez désactiver les cookies dans les paramètres de votre navigateur, 
                bien que cela puisse affecter votre expérience sur le site.
              </Text>
            </VStack>
          </Box>

          {/* Contact et plaintes */}
          <Box>
            <Heading as="h2" size="md" color="var(--rbe-red)" mb={3}>
              11. Contact et Plaintes
            </Heading>
            <VStack align="start" spacing={2} fontSize="sm">
              <Text>
                Pour toute question concernant cette politique RGPD, veuillez nous contacter :{" "}
                <CLink href="mailto:association.rbe@gmail.com" color="var(--rbe-red)">
                  association.rbe@gmail.com
                </CLink>
              </Text>
              <Text>
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une plainte 
                auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) :
              </Text>
              <Text>
                <CLink href="https://www.cnil.fr" target="_blank" color="var(--rbe-red)">
                  www.cnil.fr
                </CLink>
              </Text>
            </VStack>
          </Box>

          {/* Modifications */}
          <Box borderTop="1px solid" borderTopColor="gray.200" pt={4} w="100%">
            <Text fontSize="sm" color="gray.600">
              Cette politique peut être modifiée à tout moment. Les modifications seront publiées sur cette page 
              et entreront en vigueur immédiatement.
            </Text>
          </Box>
        </VStack>
      </Container>
    </>
  );
}
