import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Heading,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiArrowRight, FiCalendar, FiUsers } from 'react-icons/fi';
import SEO, { jsonLdSchemas } from '../components/SEO.jsx';
import { actualites } from '../data/actualites.js';
import { fetchPublicNews } from '../lib/news.js';

const formatDate = (date) => new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date(`${date}T12:00:00`));

export default function Actualites() {
  const [articles, setArticles] = useState(actualites);

  useEffect(() => {
    fetchPublicNews()
      .then((news) => {
        if (news.length > 0) setArticles([...news, ...actualites]);
      })
      .catch(() => {
        // The launch article remains available if the API is temporarily unavailable.
      });
  }, []);

  return (
    <>
      <SEO
        title="Actualités - RétroBus Essonne"
        description="Les actualités de RétroBus Essonne : préservation, restauration, rencontres et patrimoine des transports en Île-de-France."
        url="https://www.association-rbe.fr/actualites"
        jsonLd={jsonLdSchemas.itemList(articles.map((actualite) => ({
          name: actualite.title,
          url: `https://www.association-rbe.fr/actualites/${actualite.id || actualite.slug}`,
          image: `https://www.association-rbe.fr${actualite.image}`,
        })), 'Actualités RétroBus Essonne')}
        image="/hero_rentree.jpg"
      />

      <Box minH="calc(100vh - 64px)" py={{ base: 10, md: 12 }}>
        <Container maxW="container.xl">
          <VStack className="page-header" spacing={4} textAlign="center" mb={8}>
            <Heading as="h1" size="2xl" className="page-title">
              Actualités
            </Heading>
            <Text className="page-subtitle">
              Retrouvez les actions, les rencontres et les projets qui font vivre notre patrimoine roulant.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {articles.map((actualite) => (
              <Card
                key={actualite.id || actualite.slug}
                variant="outline"
                overflow="hidden"
                borderColor="gray.200"
                transition="all 0.2s"
                _hover={{ borderColor: 'red.300', boxShadow: 'md', transform: 'translateY(-2px)' }}
              >
                <Image
                  src={actualite.image}
                  alt={actualite.imageAlt}
                  w="full"
                  h="220px"
                  objectFit="cover"
                  loading="lazy"
                />
                <CardBody>
                  <VStack align="stretch" spacing={4} h="full">
                    <HStack justify="space-between" align="start" spacing={3}>
                      <Badge colorScheme="red" variant="subtle">
                        {actualite.category}
                      </Badge>
                      <HStack spacing={1} color="gray.500" fontSize="sm" flexShrink={0}>
                        <Icon as={FiCalendar} />
                        <Text>{formatDate(actualite.publishedAt)}</Text>
                      </HStack>
                    </HStack>
                    <Heading as="h2" size="md" color="gray.800">
                      {actualite.title}
                    </Heading>
                    <Text color="gray.600" lineHeight="tall" flex="1">
                      {actualite.excerpt}
                    </Text>
                    <Button
                      as={RouterLink}
                      to={`/actualites/${actualite.id || actualite.slug}`}
                      alignSelf="start"
                      colorScheme="red"
                      rightIcon={<FiArrowRight />}
                    >
                      Lire l'article
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          <Stack
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'start', md: 'center' }}
            spacing={5}
            mt={{ base: 12, md: 16 }}
            pt={8}
            borderTopWidth="1px"
            borderColor="gray.200"
          >
            <Box maxW="2xl">
              <Heading as="h2" size="lg" mb={2}>Participer à la suite</Heading>
              <Text color="gray.600">
                Consultez les prochains rendez-vous ou contactez-nous pour partager un projet, une archive ou un témoignage.
              </Text>
            </Box>
            <Button as={RouterLink} to="/contact" colorScheme="red" leftIcon={<FiUsers />}>
              Contacter l'association
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
}