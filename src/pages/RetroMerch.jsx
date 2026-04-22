import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Box, Container, Heading, Text, Image, VStack, Flex, Spinner, SimpleGrid, Button } from "@chakra-ui/react";
import brandingLogo from "../assets/retromerch_branding.svg";
import { getSiteConfig, getProducts } from "../lib/retromerchService";

export default function RetroMerch() {
  const [config, setConfig] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const [siteConfig, productList] = await Promise.all([
        getSiteConfig().catch(() => ({})),
        getProducts().catch(() => [])
      ]);
      
      setConfig(siteConfig);
      setProducts(productList);
    } catch (error) {
      console.error("Erreur chargement RetroMerch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Valeurs par défaut si pas de config
  const heroSection = config?.hero_section || {
    title: "RétroMerch",
    subtitle: "La boutique officielle de l'association RétroBus Essonne",
    backgroundColor: "#f7fafc",
    textColor: "#000000",
    backgroundImage: ""
  };

  const aboutSection = config?.about_section || {
    enabled: true,
    title: "À propos",
    description: "Découvrez bientôt la boutique RétroMerch de l'association RétroBus Essonne.",
    image: ""
  };

  const theme = config?.theme || {
    primaryColor: "#e53e3e",
    secondaryColor: "#2d3748",
    fontFamily: "Inter, sans-serif"
  };

  if (isLoading) {
    return (
      <Container maxW="container.lg" py={20} textAlign="center">
        <Spinner size="xl" color="red.500" />
        <Text mt={4} color="gray.600">Chargement...</Text>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>{heroSection.title} - RétroBus Essonne</title>
        <meta name="description" content={heroSection.subtitle} />
        <style>{`
          body {
            font-family: ${theme.fontFamily};
          }
        `}</style>
      </Helmet>

      {/* HERO SECTION */}
      <Box
        bg={heroSection.backgroundColor}
        color={heroSection.textColor}
        backgroundImage={heroSection.backgroundImage ? `url(${heroSection.backgroundImage})` : 'none'}
        backgroundSize="cover"
        backgroundPosition="center"
        py={20}
      >
        <Container maxW="container.lg">
          <VStack spacing={8} textAlign="center">
            <Flex align="center" justify="center" wrap="wrap">
              <Image 
                src={brandingLogo} 
                alt="Logo RetroMerch" 
                h="10rem"
                mr={4} 
              />
              <Heading as="h1" size="2xl" fontWeight="700">
                {heroSection.title}
              </Heading>
            </Flex>

            <Text fontSize="xl" maxW="2xl">
              {heroSection.subtitle}
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* ABOUT SECTION */}
      {aboutSection.enabled && (
        <Container maxW="container.lg" py={16}>
          <VStack spacing={6} textAlign="center">
            <Heading as="h2" size="xl" color={theme.primaryColor}>
              {aboutSection.title}
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              {aboutSection.description}
            </Text>
            {aboutSection.image && (
              <Image 
                src={aboutSection.image} 
                alt={aboutSection.title}
                maxW="600px"
                borderRadius="lg"
                shadow="md"
              />
            )}
          </VStack>
        </Container>
      )}

      {/* PRODUCTS SECTION */}
      {products.length > 0 && (
        <Box bg="gray.50" py={16}>
          <Container maxW="container.xl">
            <Heading as="h2" size="xl" textAlign="center" mb={10} color={theme.primaryColor}>
              Nos produits
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {products.filter(p => p.active).map((product) => (
                <Box
                  key={product.id}
                  bg="white"
                  borderRadius="lg"
                  overflow="hidden"
                  shadow="md"
                  transition="transform 0.2s"
                  _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    w="full"
                    h="250px"
                    objectFit="cover"
                    fallbackSrc="https://via.placeholder.com/250?text=Produit"
                  />
                  <Box p={6}>
                    <Heading size="md" mb={2}>{product.name}</Heading>
                    {product.description && (
                      <Text fontSize="sm" color="gray.600" mb={4} noOfLines={2}>
                        {product.description}
                      </Text>
                    )}
                    <Flex justify="space-between" align="center">
                      <Text fontSize="2xl" fontWeight="bold" color={theme.primaryColor}>
                        {product.price}€
                      </Text>
                      <Button
                        bg={theme.primaryColor}
                        color="white"
                        size="sm"
                        _hover={{ opacity: 0.8 }}
                      >
                        Commander
                      </Button>
                    </Flex>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </Container>
        </Box>
      )}
    </>
  );
}
