import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Box, Container, Heading, Text, Image, VStack, SimpleGrid, Button, Spinner, Flex } from "@chakra-ui/react";
import brandingLogo from "../assets/retromerch_branding.svg";
import { getSiteConfig, getProducts } from "../lib/retromerchService";

export default function RetroMerch() {
  const [pageBlocks, setPageBlocks] = useState([]);
  const [products, setProducts] = useState([]);
  const [theme, setTheme] = useState({
    primaryColor: "#e53e3e",
    secondaryColor: "#2d3748",
    fontFamily: "Inter, sans-serif"
  });
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
      
      if (siteConfig.page_structure) {
        setPageBlocks(siteConfig.page_structure);
      } else {
        // Page par défaut si pas de structure configurée
        setPageBlocks([
          {
            id: "default_hero",
            type: "HERO",
            data: {
              title: "RétroMerch",
              subtitle: "La boutique officielle de l'association RétroBus Essonne",
              backgroundColor: "#f7fafc",
              textColor: "#000000",
              backgroundImage: "",
              height: "400px",
              textAlign: "center"
            }
          },
          {
            id: "default_text",
            type: "TEXT",
            data: {
              title: "À propos",
              content: "Découvrez bientôt notre boutique avec des produits exclusifs pour passionnés.",
              backgroundColor: "#ffffff",
              textColor: "#2d3748",
              fontSize: "16px",
              textAlign: "center",
              padding: "60px"
            }
          }
        ]);
      }
      
      if (siteConfig.theme) {
        setTheme(siteConfig.theme);
      }
      
      setProducts(productList.filter(p => p.active));
    } catch (error) {
      console.error("Erreur chargement RetroMerch:", error);
    } finally {
      setIsLoading(false);
    }
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
        <title>RétroMerch - RétroBus Essonne</title>
        <meta name="description" content="La boutique officielle RétroBus Essonne" />
        <style>{`
          body {
            font-family: ${theme.fontFamily};
          }
        `}</style>
      </Helmet>

      {/* Rendu dynamique des blocs */}
      <Box>
        {pageBlocks.map((block) => (
          <DynamicBlock key={block.id} block={block} products={products} theme={theme} />
        ))}
      </Box>
    </>
  );
}

/**
 * Composant qui rend un bloc selon son type
 */
const DynamicBlock = ({ block, products, theme }) => {
  const { type, data } = block;

  switch (type) {
    case "HERO":
      return (
        <Box
          bg={data.backgroundColor}
          color={data.textColor}
          backgroundImage={data.backgroundImage ? `url(${data.backgroundImage})` : 'none'}
          backgroundSize="cover"
          backgroundPosition="center"
          minH={data.height}
          display="flex"
          alignItems="center"
          justifyContent="center"
          py={12}
          px={6}
        >
          <VStack spacing={4} textAlign={data.textAlign} maxW="1200px">
            <Heading as="h1" size="2xl" fontWeight="700">
              {data.title}
            </Heading>
            <Text fontSize="xl" maxW="800px">
              {data.subtitle}
            </Text>
          </VStack>
        </Box>
      );

    case "TEXT":
      return (
        <Box
          bg={data.backgroundColor}
          color={data.textColor}
          py={data.padding}
          px={6}
        >
          <Container maxW="1200px" textAlign={data.textAlign}>
            {data.title && (
              <Heading as="h2" size="xl" mb={4}>
                {data.title}
              </Heading>
            )}
            <Text fontSize={data.fontSize} whiteSpace="pre-wrap">
              {data.content}
            </Text>
          </Container>
        </Box>
      );

    case "IMAGE":
      return (
        <Container maxW="1200px" py={8}>
          <Flex justify={data.alignment} w="full">
            <Box maxW={data.maxWidth}>
              <Image
                src={data.imageUrl}
                alt={data.alt}
                borderRadius="lg"
                shadow="md"
                w="full"
              />
              {data.caption && (
                <Text fontSize="sm" color="gray.600" mt={2} textAlign="center">
                  {data.caption}
                </Text>
              )}
            </Box>
          </Flex>
        </Container>
      );

    case "TWO_COLUMNS":
      return (
        <Box bg={data.backgroundColor} py={data.padding} px={6}>
          <Container maxW="1200px">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <Box>
                {data.leftImage && (
                  <Image src={data.leftImage} mb={4} borderRadius="lg" w="full" />
                )}
                <Text whiteSpace="pre-wrap">{data.leftContent}</Text>
              </Box>
              <Box>
                {data.rightImage && (
                  <Image src={data.rightImage} mb={4} borderRadius="lg" w="full" />
                )}
                <Text whiteSpace="pre-wrap">{data.rightContent}</Text>
              </Box>
            </SimpleGrid>
          </Container>
        </Box>
      );

    case "CTA":
      return (
        <Box bg={data.backgroundColor} color={data.textColor} py={16} px={6}>
          <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
            <Heading as="h2" size="xl">
              {data.title}
            </Heading>
            <Text fontSize="lg">{data.description}</Text>
            <Button
              as="a"
              href={data.buttonLink}
              bg={data.buttonColor}
              color="white"
              size="lg"
              px={8}
              _hover={{ opacity: 0.9 }}
            >
              {data.buttonText}
            </Button>
          </VStack>
        </Box>
      );

    case "PRODUCTS_GRID":
      const displayedProducts = data.showAllProducts 
        ? products 
        : products.filter(p => data.selectedProductIds.includes(p.id));

      return (
        <Box bg={data.backgroundColor} py={12} px={6} id="products">
          <Container maxW="1400px">
            {data.title && (
              <Heading as="h2" size="xl" textAlign="center" mb={10} color={theme.primaryColor}>
                {data.title}
              </Heading>
            )}
            
            {displayedProducts.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: data.columns }} spacing={8}>
                {displayedProducts.map((product) => (
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
            ) : (
              <Text textAlign="center" color="gray.600">
                Aucun produit disponible pour le moment
              </Text>
            )}
          </Container>
        </Box>
      );

    case "SPACER":
      return (
        <Box bg={data.backgroundColor} h={data.height} />
      );

    default:
      return null;
  }
};
