import { useEffect, useState } from 'react';
import { Link as RouterLink, Navigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Icon,
  Image,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiArrowLeft, FiArrowRight, FiCalendar } from 'react-icons/fi';
import SEO, { jsonLdSchemas } from '../components/SEO.jsx';
import { actualites } from '../data/actualites.js';
import { fetchPublicNews } from '../lib/news.js';

const formatDate = (date) => new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date(`${date}T12:00:00`));

const PublicArticleImage = ({ title, alt, ...props }) => {
  const width = /^width:(33%|50%|100%)$/.test(title || '') ? title.slice(6) : '100%';
  return <Image {...props} alt={alt || ''} w={width} maxW="100%" mx={width === '100%' ? 0 : 'auto'} />;
};

export default function ActualiteArticle() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicNews()
      .then((news) => setArticle(
        news.find((item) => item.id === slug) || actualites.find((item) => item.slug === slug) || null
      ))
      .catch(() => setArticle(actualites.find((item) => item.slug === slug) || null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return null;

  if (!article) {
    return <Navigate to="/actualites" replace />;
  }

  const url = `https://www.association-rbe.fr/actualites/${article.slug}`;

  return (
    <>
      <SEO
        title={`${article.title} - RétroBus Essonne`}
        description={article.excerpt}
        url={url}
        type="article"
        image={article.image}
        publishedTime={`${article.publishedAt}T12:00:00+02:00`}
        jsonLd={jsonLdSchemas.article({
          title: article.title,
          description: article.excerpt,
          image: `https://www.association-rbe.fr${article.image}`,
          publishedAt: article.publishedAt,
        })}
      />

      <Box minH="calc(100vh - 64px)" py={{ base: 8, md: 12 }} bg="#f8fafc">
        <Container maxW="container.md">
          <Button as={RouterLink} to="/actualites" variant="ghost" color="#9f063a" leftIcon={<FiArrowLeft />} mb={8}>
            Toutes les actualités
          </Button>

          <Box bg="white" borderTop="4px solid" borderColor="#be003c" boxShadow="sm" borderRadius="md" overflow="hidden">
            <Image src={article.image} alt={article.imageAlt} w="full" maxH={{ base: '280px', md: '430px' }} objectFit="cover" />
            <VStack align="stretch" spacing={7} p={{ base: 6, md: 10 }}>
              <HStack spacing={3} wrap="wrap">
                <Badge bg="#f8bfd0" color="#9f063a" px={2.5} py={1} borderRadius="full">{article.category}</Badge>
                <HStack spacing={1.5} color="#475569" fontSize="sm">
                  <Icon as={FiCalendar} />
                  <Text>{formatDate(article.publishedAt)}</Text>
                </HStack>
              </HStack>
              <Heading as="h1" size="xl" color="#1e293b" lineHeight="1.2">{article.title}</Heading>
              <Text fontSize={{ base: 'lg', md: 'xl' }} color="#475569" lineHeight="tall">{article.excerpt}</Text>

              {article.content ? (
                <Box color="#475569" sx={{ '& h1, & h2, & h3': { color: '#d30c4c', marginTop: 6, marginBottom: 3 }, '& p': { marginBottom: 4, lineHeight: 'tall' }, '& img': { maxWidth: '100%', borderRadius: '6px', marginTop: 5, marginBottom: 2 }, '& a': { color: '#be003c', textDecoration: 'underline' } }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ img: PublicArticleImage }}>{article.content}</ReactMarkdown>
                </Box>
              ) : article.sections.map((section) => (
                <Box key={section.title}>
                  <Heading as="h2" size="md" color="#d30c4c" mb={3}>{section.title}</Heading>
                  <VStack align="stretch" spacing={3} color="#475569" lineHeight="tall">
                    {section.paragraphs.map((paragraph) => <Text key={paragraph}>{paragraph}</Text>)}
                  </VStack>
                </Box>
              ))}

              {article.relatedLinks && (
                <Stack direction={{ base: 'column', sm: 'row' }} spacing={3} pt={2}>
                  {article.relatedLinks.map((link) => (
                  <Button key={link.to} as={RouterLink} to={link.to} bg="#be003c" color="white" rightIcon={<FiArrowRight />} _hover={{ bg: '#e40045' }}>
                    {link.label}
                  </Button>
                  ))}
                </Stack>
              )}
            </VStack>
          </Box>
        </Container>
      </Box>
    </>
  );
}