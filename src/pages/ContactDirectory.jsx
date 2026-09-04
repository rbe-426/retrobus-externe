import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiArrowUpRight, FiMail } from 'react-icons/fi';
import { FaDiscord, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import SEO, { jsonLdSchemas } from '../components/SEO.jsx';

const RBE_COLORS = {
  raspberry: '#d30c4c',
  externalRed: '#be003c',
  accent: '#e40045',
  deep: '#9f063a',
  surface: '#f8fafc',
  ink: '#1e293b',
  muted: '#475569',
  raspberryPastel: '#f8bfd0',
};

const contacts = [
  {
    label: 'E-mail',
    description: "Pour une question, un projet, un partenariat ou une demande d'information.",
    value: 'association.rbe@gmail.com',
    href: 'mailto:association.rbe@gmail.com',
    icon: FiMail,
    external: false,
  },
  {
    label: 'Facebook',
    description: "Suivez les publications et les rendez-vous de l'association.",
    value: 'Association RBE',
    href: 'https://www.facebook.com/AssociationRBE/',
    icon: FaFacebook,
    external: true,
  },
  {
    label: 'Instagram',
    description: 'Photos de la collection, des sorties et des coulisses.',
    value: '@asso.rbe',
    href: 'https://www.instagram.com/asso.rbe/',
    icon: FaInstagram,
    external: true,
  },
  {
    label: 'TikTok',
    description: 'Retrouvez les contenus video de RétroBus Essonne.',
    value: '@asso_rbe',
    href: 'https://www.tiktok.com/@asso_rbe',
    icon: FaTiktok,
    external: true,
  },
  {
    label: 'Discord',
    description: 'Echangez avec la communaute et les passionnes de transports.',
    value: 'Serveur RétroBus Essonne',
    href: 'https://discord.com/invite/RbwNrX4rdu',
    icon: FaDiscord,
    external: true,
  },
];

export default function ContactDirectory() {
  return (
    <>
      <SEO
        title="Contactez-nous - RétroBus Essonne"
        description="Contactez RétroBus Essonne par e-mail ou retrouvez l'association sur Facebook, Instagram, TikTok et Discord."
        keywords="contact, RétroBus Essonne, e-mail, Facebook, Instagram, TikTok, Discord, partenariat"
        url="https://www.association-rbe.fr/contact"
        jsonLd={jsonLdSchemas.contactPage}
      />

      <Box minH="calc(100vh - 64px)" py={{ base: 10, md: 12 }} bg={RBE_COLORS.surface}>
        <Container maxW="container.lg">
          <VStack spacing={4} textAlign="center" mb={{ base: 10, md: 12 }}>
            <Badge bg={RBE_COLORS.raspberryPastel} color={RBE_COLORS.deep} fontSize="sm" px={3} py={1} borderRadius="full">
              RétroBus Essonne
            </Badge>
            <Heading as="h1" size="2xl" color={RBE_COLORS.raspberry}>
              Nous contacter
            </Heading>
            <Text fontSize="lg" color={RBE_COLORS.muted} maxW="2xl">
              Une question, un projet ou un témoignage à partager ? Retrouvez les moyens de contacter l'association.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            {contacts.map((contact) => (
              <Card
                key={contact.label}
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderTop="4px solid"
                borderTopColor={RBE_COLORS.externalRed}
                borderRadius="md"
                boxShadow="sm"
                h="full"
                transition="transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease"
                _hover={{ borderColor: RBE_COLORS.raspberryPastel, boxShadow: 'md', transform: 'translateY(-2px)' }}
              >
                <CardBody>
                  <VStack align="start" spacing={4} h="full">
                    <Icon as={contact.icon} boxSize={7} color={RBE_COLORS.raspberry} />
                    <Box>
                      <Heading as="h2" size="md" mb={2} color={RBE_COLORS.ink}>{contact.label}</Heading>
                      <Text color={RBE_COLORS.muted} lineHeight="tall">{contact.description}</Text>
                    </Box>
                    <Button
                      as="a"
                      href={contact.href}
                      target={contact.external ? '_blank' : undefined}
                      rel={contact.external ? 'noopener noreferrer' : undefined}
                      bg={RBE_COLORS.externalRed}
                      color="white"
                      rightIcon={contact.external ? <FiArrowUpRight /> : undefined}
                      mt="auto"
                      _hover={{ bg: RBE_COLORS.accent }}
                      _focusVisible={{ boxShadow: `0 0 0 3px ${RBE_COLORS.raspberryPastel}` }}
                    >
                      {contact.value}
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </>
  );
}