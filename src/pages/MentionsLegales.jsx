import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Box, Container, Heading, Text, VStack, Link as CLink } from "@chakra-ui/react";

export default function MentionsLegales() {
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Mentions Légales - RétroBus Essonne</title>
        <meta name="description" content="Mentions légales et informations de l'association RétroBus Essonne" />
      </Helmet>

      <Container maxW="800px" py={12} px={4}>
        <VStack align="start" spacing={6}>
          <Box>
            <Heading as="h1" size="xl" color="var(--rbe-red)" mb={4}>
              Mentions Légales
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </Text>
          </Box>

          {/* Informations générales */}
          <Box>
            <Heading as="h2" size="md" color="var(--rbe-red)" mb={3}>
              1. Informations Générales
            </Heading>
            <VStack align="start" spacing={2} fontSize="sm">
              <Text>
                <strong>Nom de l'association :</strong> Association RétroBus Essonne
              </Text>
              <Text>
                <strong>RNA (Répertoire National des Associations) :</strong> W912016571
              </Text>
              <Text>
                <strong>SIREN :</strong> 942 506 607 00010
              </Text>
              <Text>
                <strong>Siège social :</strong> Essonne, France
              </Text>
              <Text>
                <strong>Email :</strong>{" "}
                <CLink href="mailto:association.rbe@gmail.com" color="var(--rbe-red)">
                  association.rbe@gmail.com
                </CLink>
              </Text>
              <Text>
                <strong>Représentant légal :</strong> Président de l'association
              </Text>
            </VStack>
          </Box>

          {/* Responsable de publication */}
          <Box>
            <Heading as="h2" size="md" color="var(--rbe-red)" mb={3}>
              2. Responsable de Publication
            </Heading>
            <Text fontSize="sm">
              Le site est édité par l'association RétroBus Essonne. Le responsable de la publication est le Président de l'association.
            </Text>
          </Box>

          {/* Hébergement */}
          <Box>
            <Heading as="h2" size="md" color="var(--rbe-red)" mb={3}>
              3. Hébergement
            </Heading>
            <VStack align="start" spacing={2} fontSize="sm">
              <Text>
                <strong>Hébergeur :</strong> Railway
              </Text>
              <Text>
                <strong>Adresse :</strong> Cloud hosting provider
              </Text>
              <Text>
                <strong>Site web :</strong>{" "}
                <CLink href="https://railway.app" target="_blank" color="var(--rbe-red)">
                  https://railway.app
                </CLink>
              </Text>
            </VStack>
          </Box>

          {/* Propriété intellectuelle */}
          <Box>
            <Heading as="h2" size="md" color="var(--rbe-red)" mb={3}>
              4. Propriété Intellectuelle
            </Heading>
            <VStack align="start" spacing={2} fontSize="sm">
              <Text>
                L'ensemble des contenus (textes, images, graphiques, logo, icônes, sons, vidéos) présents sur le site www.association-rbe.fr
                sont la propriété exclusive de l'association RétroBus Essonne ou de ses partenaires.
              </Text>
              <Text>
                Toute reproduction, représentation ou diffusion, intégrale ou partielle, est interdite sans l'autorisation préalable écrite 
                de l'association RétroBus Essonne.
              </Text>
              <Text>
                Les utilisateurs s'engagent à respecter les droits d'auteur, de marque et tous autres droits de propriété intellectuelle.
              </Text>
            </VStack>
          </Box>

          {/* Limitation de responsabilité */}
          <Box>
            <Heading as="h2" size="md" color="var(--rbe-red)" mb={3}>
              5. Limitation de Responsabilité
            </Heading>
            <VStack align="start" spacing={2} fontSize="sm">
              <Text>
                L'association RétroBus Essonne s'efforce de fournir des informations exactes et à jour sur le site. Cependant,
                elle ne peut garantir l'exactitude, la complétude ou l'absence d'erreur des contenus.
              </Text>
              <Text>
                L'association décline toute responsabilité en cas de dommages directs ou indirects résultant de l'accès ou de 
                l'utilisation du site.
              </Text>
            </VStack>
          </Box>

          {/* Liens externes */}
          <Box>
            <Heading as="h2" size="md" color="var(--rbe-red)" mb={3}>
              6. Liens Externes
            </Heading>
            <Text fontSize="sm">
              Le site peut contenir des liens vers d'autres sites. L'association RétroBus Essonne n'est pas responsable 
              du contenu de ces sites externes.
            </Text>
          </Box>

          {/* Modifications */}
          <Box>
            <Heading as="h2" size="md" color="var(--rbe-red)" mb={3}>
              7. Modifications
            </Heading>
            <Text fontSize="sm">
              L'association RétroBus Essonne se réserve le droit de modifier les présentes mentions légales à tout moment 
              sans notification préalable.
            </Text>
          </Box>

          {/* Droit applicable */}
          <Box>
            <Heading as="h2" size="md" color="var(--rbe-red)" mb={3}>
              8. Droit Applicable
            </Heading>
            <Text fontSize="sm">
              Les présentes mentions légales sont soumises à la loi française. 
              Tout litige sera de la compétence exclusive des tribunaux français.
            </Text>
          </Box>

          {/* Contact */}
          <Box borderTop="1px solid" borderTopColor="gray.200" pt={4} w="100%">
            <Text fontSize="sm" color="gray.600">
              Pour toute question concernant ces mentions légales, veuillez nous contacter à :{" "}
              <CLink href="mailto:association.rbe@gmail.com" color="var(--rbe-red)">
                association.rbe@gmail.com
              </CLink>
            </Text>
          </Box>
        </VStack>
      </Container>
    </>
  );
}
