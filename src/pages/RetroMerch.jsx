import { Helmet } from "react-helmet-async";
import { Box, Container, Heading, Text, Image, VStack, Flex } from "@chakra-ui/react";
import brandingLogo from "../assets/retromerch_branding.svg";

export default function RetroMerch() {
  return (
    <>
      <Helmet>
        <title>RétroMerch - La boutique RétroBus Essonne</title>
        <meta name="description" content="Découvrez bientôt la boutique RétroMerch de l'association RétroBus Essonne." />
      </Helmet>

      <Container maxW="container.lg" py={10}>
        <VStack spacing={8} textAlign="center">
          <Flex align="center" justify="center" wrap="wrap">
            <Image 
              src={brandingLogo} 
              alt="Logo" 
              h="10rem"
              mr={4} 
            />
            <Heading as="h1" size="2xl" fontWeight="700">
              RétroMerch
            </Heading>
          </Flex>

          <Text fontSize="xl" color="gray.600" maxW="2xl">
            La boutique officielle de l'association RétroBus Essonne. Bientôt disponible avec une sélection de produits uniques pour les passionnés.
          </Text>
        </VStack>
      </Container>
    </>
  );
}
