import React from "react";
import { Container, SimpleGrid, Text, Link as CLink, Image, Box, Flex, VStack, HStack } from "@chakra-ui/react";
import { FaFacebook, FaInstagram, FaTiktok, FaDiscord, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="site-footer" style={{ 
      background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
      marginTop: "80px",
      borderTop: "3px solid var(--rbe-red)"
    }}>
      <Container maxW="100%" px={{ base: 4, md: 8 }} py={6}>
        
        {/* Main Footer Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={12}>
          
          {/* About Section */}
          <VStack align="start" spacing={4}>
            <Box>
              <Image 
                src="/assets/rbe_footer.png" 
                alt="RétroBus Essonne Logo"
                maxH="200px"
                maxW="300px"
                mt={-4}
                mb={3}
              />
              <Text fontSize="sm" color="whiteAlpha.800" lineHeight={1.6}>
                RNA : W912016571<br />
                SIRET : 942 506 607 00010<br />
                SIREN : 942 506 607<br />
                Siège social : Corbeil-Essonnes, Essonne, France.<br />
                Collection, préservation et restauration du patrimoine roulant.
              </Text>
            </Box>
            
            {/* Location */}
            <HStack spacing={2} color="whiteAlpha.700" fontSize="sm">
              <FaMapMarkerAlt size={16} color="var(--rbe-red)" />
              <Text>Corbeil-Essonnes, Essonne, France.</Text>
            </HStack>
          </VStack>

          {/* Links Section */}
          <VStack align="start" spacing={3}>
            <Text fontSize="lg" fontWeight={700} color="white" textTransform="uppercase" letterSpacing="1px">
              Ressources
            </Text>
            <VStack align="start" spacing={2} fontSize="sm">
              <CLink 
                href="/" 
                color="whiteAlpha.800"
                _hover={{ color: "var(--rbe-red)", pl: 2, transition: "all 0.2s" }}
                transition="all 0.2s"
              >
                → Accueil
              </CLink>
              <CLink 
                href="/events" 
                color="whiteAlpha.800"
                _hover={{ color: "var(--rbe-red)", pl: 2, transition: "all 0.2s" }}
                transition="all 0.2s"
              >
                → Événements
              </CLink>
              <CLink 
                href="/vehicles" 
                color="whiteAlpha.800"
                _hover={{ color: "var(--rbe-red)", pl: 2, transition: "all 0.2s" }}
                transition="all 0.2s"
              >
                → Véhicules
              </CLink>
              <CLink 
                href="/contact" 
                color="whiteAlpha.800"
                _hover={{ color: "var(--rbe-red)", pl: 2, transition: "all 0.2s" }}
                transition="all 0.2s"
              >
                → Contact
              </CLink>
            </VStack>
          </VStack>

          {/* Legal Section */}
          <VStack align="start" spacing={3}>
            <Text fontSize="lg" fontWeight={700} color="white" textTransform="uppercase" letterSpacing="1px">
              Légal
            </Text>
            <VStack align="start" spacing={2} fontSize="sm">
              <CLink 
                href="/statuts.pdf" 
                color="whiteAlpha.800"
                _hover={{ color: "var(--rbe-red)", pl: 2, transition: "all 0.2s" }}
                transition="all 0.2s"
                target="_blank"
              >
                → Statuts
              </CLink>
              <CLink 
                href="/mentions-legales" 
                color="whiteAlpha.800"
                _hover={{ color: "var(--rbe-red)", pl: 2, transition: "all 0.2s" }}
                transition="all 0.2s"
              >
                → Mentions légales
              </CLink>
              <CLink 
                href="/rgpd" 
                color="whiteAlpha.800"
                _hover={{ color: "var(--rbe-red)", pl: 2, transition: "all 0.2s" }}
                transition="all 0.2s"
              >
                → Politique RGPD
              </CLink>
            </VStack>
          </VStack>

          {/* Contact & Socials */}
          <VStack align="start" spacing={4}>
            <Box>
              <Text fontSize="lg" fontWeight={700} color="white" textTransform="uppercase" letterSpacing="1px" mb={3}>
                Nous Suivre
              </Text>
              <HStack spacing={4}>
                <CLink
                  href="https://www.facebook.com/AssociationRBE/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  _hover={{ color: "var(--rbe-red)", transform: "scale(1.2)" }}
                  transition="all 0.2s"
                >
                  <FaFacebook size={24} color="whiteAlpha.800" />
                </CLink>
                <CLink
                  href="https://www.instagram.com/asso.rbe/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  _hover={{ color: "var(--rbe-red)", transform: "scale(1.2)" }}
                  transition="all 0.2s"
                >
                  <FaInstagram size={24} color="whiteAlpha.800" />
                </CLink>
                <CLink
                  href="https://www.tiktok.com/@asso_rbe"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  _hover={{ color: "var(--rbe-red)", transform: "scale(1.2)" }}
                  transition="all 0.2s"
                >
                  <FaTiktok size={24} color="whiteAlpha.800" />
                </CLink>
                <CLink
                  href="https://discord.com/invite/RbwNrX4rdu"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Discord"
                  _hover={{ color: "var(--rbe-red)", transform: "scale(1.2)" }}
                  transition="all 0.2s"
                >
                  <FaDiscord size={24} color="whiteAlpha.800" />
                </CLink>
              </HStack>
            </Box>

            {/* Email */}
            <HStack spacing={2} color="whiteAlpha.700" fontSize="sm">
              <FaEnvelope size={16} color="var(--rbe-red)" />
              <CLink 
                href="mailto:association.rbe@gmail.com"
                color="whiteAlpha.800"
                _hover={{ color: "var(--rbe-red)" }}
              >
                association.rbe@gmail.com
              </CLink>
            </HStack>
          </VStack>
        </SimpleGrid>

        {/* Supporters Section */}
        <Box 
          py={8} 
          borderTop="1px solid" 
          borderTopColor="whiteAlpha.200"
          mb={8}
        >
          <Text 
            fontSize="sm" 
            fontWeight={700} 
            color="var(--rbe-red)" 
            textTransform="uppercase" 
            letterSpacing="1px"
            mb={4}
          >
            🤝 Nos Partenaires
          </Text>
          <Flex 
            gap={8} 
            align="center"
            wrap="wrap"
          >
            <CLink
              href="https://www.cars-soeur.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="Cars Soeur – Mobilité éco-responsable"
              _hover={{ opacity: 0.8, transform: "translateY(-2px)" }}
              transition="all 0.2s"
            >
              <Image
                src="/supporters/cars-soeur.png"
                alt="Cars Soeur – soutien"
                maxH="80px"
                maxW="250px"
                loading="lazy"
                decoding="async"
                style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,0.4))" }}
                fallback={<Text fontSize="xs" color="whiteAlpha.700">Cars Soeur</Text>}
              />
            </CLink>

            {/* Ajoute tes autres partenaires ici */}
            <CLink
              href="https://www.corbeil-essonnes.fr/"
              target="_blank"
              rel="noopener noreferrer"
              title="Ville de Corbeil-Essonnes"
              _hover={{ opacity: 0.8, transform: "translateY(-2px)" }}
              transition="all 0.2s"
            >
              <Image
                src="/supporters/ville-ce.png"
                alt="Ville de Corbeil-Essonnes"
                maxH="80px"
                maxW="250px"
                loading="lazy"
                decoding="async"
                style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,0.4))" }}
                fallback={<Text fontSize="xs" color="whiteAlpha.700">Ville de Corbeil-Essonnes</Text>}
              />
            </CLink>

            <CLink
              href="https://mabanque.bnpparibas/"
              target="_blank"
              rel="noopener noreferrer"
              title="BNP Paribas"
              _hover={{ opacity: 0.8, transform: "translateY(-2px)" }}
              transition="all 0.2s"
            >
              <Image
                src="/supporters/bnp-paribas.png"
                alt="BNP Paribas"
                maxH="80px"
                maxW="250px"
                loading="lazy"
                decoding="async"
                style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,0.4))" }}
                fallback={<Text fontSize="xs" color="whiteAlpha.700">BNP Paribas</Text>}
              />
            </CLink>

            {/* 
            <CLink
              href="https://example.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="Partenaire 2"
              _hover={{ opacity: 0.8, transform: "translateY(-2px)" }}
              transition="all 0.2s"
            >
              <Image
                src="/supporters/partenaire2.png"
                alt="Partenaire 2"
                maxH="80px"
                maxW="250px"
                loading="lazy"
                decoding="async"
                style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,0.4))" }}
                fallback={<Text fontSize="xs" color="whiteAlpha.700">Partenaire 2</Text>}
              />
            </CLink>
            */}
          </Flex>
        </Box>

        {/* Divider */}
        <Box 
          height="1px" 
          background="linear-gradient(90deg, transparent, var(--rbe-red), transparent)"
          mb={6}
        />

        {/* Bottom Section */}
        <Flex 
          justify="space-between" 
          align="center"
          flexDirection={{ base: "column", md: "row" }}
          gap={4}
        >
          <Text 
            fontSize="xs" 
            color="whiteAlpha.600"
          >
            &copy; {new Date().getFullYear()} <strong>RétroBus Essonne</strong> • Tous droits réservés
          </Text>
          
          <Text 
            fontSize="xs" 
            color="whiteAlpha.500"
          >
            Fait avec ❤️ pour le patrimoine des transports
          </Text>
        </Flex>
      </Container>
    </footer>
  );
}

