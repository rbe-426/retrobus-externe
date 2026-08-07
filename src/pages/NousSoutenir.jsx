import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  Button,
  Icon,
  useColorModeValue,
  HStack,
  Badge,
  List,
  ListItem,
  ListIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Alert,
  AlertIcon,
  Grid,
  GridItem,
  useDisclosure,
} from '@chakra-ui/react';
import { FiHeart, FiUsers, FiTruck, FiCheckCircle, FiExternalLink, FiCreditCard, FiMail, FiDollarSign } from 'react-icons/fi';
import { apiUrl } from '../lib/api';

const CSRF_STORAGE_KEY = 'EXTERNE_CSRF_TOKEN';

const readStoredCsrfToken = () => {
  try {
    return sessionStorage.getItem(CSRF_STORAGE_KEY);
  } catch {
    return null;
  }
};

const storeCsrfToken = (token) => {
  try {
    if (token) {
      sessionStorage.setItem(CSRF_STORAGE_KEY, token);
    }
  } catch {
    // sessionStorage may be unavailable in restrictive browser contexts.
  }
};

const fetchCsrfToken = async (forceRefresh = false) => {
  if (!forceRefresh) {
    const cached = readStoredCsrfToken();
    if (cached) return cached;
  }

  const response = await fetch(apiUrl('/api/csrf-token'), {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Impossible de recuperer le token de securite.');
  }

  const data = await response.json().catch(() => ({}));
  const token = data?.csrfToken;
  if (!token) {
    throw new Error('Token de securite indisponible.');
  }

  storeCsrfToken(token);
  return token;
};

export default function NousSoutenir() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { isOpen: isDonationModalOpen, onOpen: onDonationModalOpen, onClose: onDonationModalClose } = useDisclosure();
  const { isOpen: isAdhesionModalOpen, onOpen: onAdhesionModalOpen, onClose: onAdhesionModalClose } = useDisclosure();
  const [selectedDonationMethod, setSelectedDonationMethod] = useState('cheque');
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [adhesionForm, setAdhesionForm] = useState({
    lastName: '',
    firstName: '',
    phone: '',
    email: '',
    candidature: ''
  });
  const [adhesionLoading, setAdhesionLoading] = useState(false);
  const [adhesionSuccess, setAdhesionSuccess] = useState(false);
  const [adhesionError, setAdhesionError] = useState('');

  const donationMethods = [
    { key: 'cheque', label: 'Par cheque', icon: FiMail },
    { key: 'especes', label: 'Par espece', icon: FiDollarSign },
    { key: 'cb', label: 'Par CB via HelloAsso', icon: FiCreditCard },
    { key: 'virement', label: 'Par virement bancaire', icon: FiExternalLink },
  ];

  const resetAdhesionForm = () => {
    setAdhesionForm({
      lastName: '',
      firstName: '',
      phone: '',
      email: '',
      candidature: ''
    });
    setAdhesionSuccess(false);
    setAdhesionError('');
    setAdhesionLoading(false);
  };

  const closeAdhesionModal = () => {
    resetAdhesionForm();
    onAdhesionModalClose();
  };

  const handleAdhesionChange = (field, value) => {
    setAdhesionForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdhesionSubmit = async () => {
    setAdhesionError('');
    setAdhesionSuccess(false);

    if (!adhesionForm.lastName.trim() || !adhesionForm.firstName.trim() || !adhesionForm.email.trim() || !adhesionForm.candidature.trim()) {
      setAdhesionError('Merci de renseigner nom, prenom, email et candidature.');
      return;
    }

    setAdhesionLoading(true);
    try {
      let csrfToken = await fetchCsrfToken(false);
      let response = await fetch(apiUrl('/api/public/adhesion-request'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({
          lastName: adhesionForm.lastName.trim(),
          firstName: adhesionForm.firstName.trim(),
          phone: adhesionForm.phone.trim(),
          email: adhesionForm.email.trim(),
          candidature: adhesionForm.candidature.trim()
        })
      });

      let data = await response.json().catch(() => ({}));

      // Retry unique si le token est manquant/invalide cote serveur.
      if (!response.ok && response.status === 403 && (data?.code === 'CSRF_MISSING' || data?.code === 'CSRF_INVALID')) {
        csrfToken = await fetchCsrfToken(true);
        response = await fetch(apiUrl('/api/public/adhesion-request'), {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-CSRF-Token': csrfToken
          },
          body: JSON.stringify({
            lastName: adhesionForm.lastName.trim(),
            firstName: adhesionForm.firstName.trim(),
            phone: adhesionForm.phone.trim(),
            email: adhesionForm.email.trim(),
            candidature: adhesionForm.candidature.trim()
          })
        });
        data = await response.json().catch(() => ({}));
      }

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Envoi impossible pour le moment');
      }

      setAdhesionSuccess(true);
      setAdhesionForm((prev) => ({ ...prev, candidature: '' }));
    } catch (error) {
      setAdhesionError(error.message || 'Envoi impossible pour le moment');
    } finally {
      setAdhesionLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Nous soutenir - RétroBus Essonne</title>
        <meta 
          name="description" 
          content="Soutenez l'association RétroBus Essonne et contribuez à la préservation du patrimoine du transport en commun francilien." 
        />
      </Helmet>

      <Box minH="calc(100vh - 64px)" py={12}>
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            {/* Header */}
            <VStack spacing={4} textAlign="center">
              <Badge colorScheme="red" fontSize="md" px={3} py={1} borderRadius="full">
                💝 Soutien à l'association
              </Badge>
              <Heading 
                size="2xl" 
                color="#d30c4c"
              >
                Nous soutenir
              </Heading>
              <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')} maxW="2xl">
                Votre contribution permet de préserver et restaurer les véhicules historiques du transport en commun francilien.
              </Text>
            </VStack>

            {/* Cards principales */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {/* Don ponctuel */}
              <Card 
                bg={cardBg} 
                borderWidth="1px" 
                borderColor={borderColor}
                h="100%"
                shadow="md"
                transition="all 0.3s"
                _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }}
              >
                <CardBody display="flex">
                  <VStack spacing={4} align="start" h="100%" w="100%">
                    <HStack>
                      <Icon as={FiHeart} boxSize={8} color="red.500" />
                      <Heading size="md">Don ponctuel</Heading>
                    </HStack>
                    <Text color={useColorModeValue('gray.600', 'gray.400')}>
                      Faites un don unique pour soutenir nos projets de restauration et nos événements.
                    </Text>
                    <List spacing={2} w="full">
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Reçu fiscal (66% de déduction)
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Paiement sécurisé HelloAsso
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Montant libre
                      </ListItem>
                    </List>
                    <Button
                      colorScheme="red"
                      size="lg"
                      w="full"
                      mt="auto"
                      rightIcon={<FiHeart />}
                      onClick={onDonationModalOpen}
                    >
                      Faire un don
                    </Button>
                  </VStack>
                </CardBody>
              </Card>

              {/* Adhésion */}
              <Card 
                bg={cardBg} 
                borderWidth="1px" 
                borderColor={borderColor}
                h="100%"
                shadow="md"
                transition="all 0.3s"
                _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }}
              >
                <CardBody display="flex">
                  <VStack spacing={4} align="start" h="100%" w="100%">
                    <HStack>
                      <Icon as={FiUsers} boxSize={8} color="blue.500" />
                      <Heading size="md">Adhésion</Heading>
                    </HStack>
                    <Text color={useColorModeValue('gray.600', 'gray.400')}>
                      Devenez membre de l'association et participez activement à nos activités.
                    </Text>
                    <List spacing={2} w="full">
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Accès aux événements membres
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Newsletter exclusive
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Tarifs préférentiels
                      </ListItem>
                    </List>
                    <Button
                      colorScheme="blue"
                      size="lg"
                      w="full"
                      mt="auto"
                      rightIcon={<FiUsers />}
                      onClick={onAdhesionModalOpen}
                    >
                      Adhérer
                    </Button>
                  </VStack>
                </CardBody>
              </Card>

              {/* Mécénat */}
              <Card 
                bg={cardBg} 
                borderWidth="1px" 
                borderColor={borderColor}
                h="100%"
                shadow="md"
                transition="all 0.3s"
                _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }}
              >
                <CardBody display="flex">
                  <VStack spacing={4} align="start" h="100%" w="100%">
                    <HStack>
                      <Icon as={FiTruck} boxSize={8} color="purple.500" />
                      <Heading size="md">Mécénat entreprise</Heading>
                    </HStack>
                    <Text color={useColorModeValue('gray.600', 'gray.400')}>
                      Votre entreprise souhaite nous soutenir ? Contactez-nous pour un partenariat.
                    </Text>
                    <List spacing={2} w="full">
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Visibilité sur nos événements
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Réduction d'impôt (60%)
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FiCheckCircle} color="green.500" />
                        Communication sur nos supports
                      </ListItem>
                    </List>
                    <Button
                      colorScheme="purple"
                      size="lg"
                      w="full"
                      mt="auto"
                      rightIcon={<FiExternalLink />}
                      as="a"
                      href="/contact"
                    >
                      Nous contacter
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>

            {/* Section pourquoi nous soutenir */}
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Heading size="lg" textAlign="center">
                    Pourquoi nous soutenir ?
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <VStack align="start" spacing={3}>
                      <Heading size="sm" color="red.500">
                        🚌 Préservation du patrimoine
                      </Heading>
                      <Text color={useColorModeValue('gray.600', 'gray.400')}>
                        Nous restaurons et entretenons des véhicules historiques du transport en commun francilien 
                        pour les préserver pour les générations futures.
                      </Text>
                    </VStack>
                    <VStack align="start" spacing={3}>
                      <Heading size="sm" color="red.500">
                        🎓 Transmission et pédagogie
                      </Heading>
                      <Text color={useColorModeValue('gray.600', 'gray.400')}>
                        Nous organisons des événements et animations pour faire découvrir l'histoire 
                        des transports en commun au grand public.
                      </Text>
                    </VStack>
                    <VStack align="start" spacing={3}>
                      <Heading size="sm" color="red.500">
                        🔧 Savoir-faire technique
                      </Heading>
                      <Text color={useColorModeValue('gray.600', 'gray.400')}>
                        Nos bénévoles passionnés restaurent avec soin chaque véhicule dans le respect 
                        de son authenticité d'origine.
                      </Text>
                    </VStack>
                    <VStack align="start" spacing={3}>
                      <Heading size="sm" color="red.500">
                        🎉 Événements publics
                      </Heading>
                      <Text color={useColorModeValue('gray.600', 'gray.400')}>
                        Nous participons à de nombreux événements pour faire vivre notre patrimoine 
                        et partager notre passion avec le public.
                      </Text>
                    </VStack>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>

            {/* Section transparence */}
            <Card 
              bg={useColorModeValue('blue.50', 'blue.900')} 
              borderWidth="1px" 
              borderColor={useColorModeValue('blue.200', 'blue.700')}
            >
              <CardBody>
                <VStack spacing={4}>
                  <Heading size="md" textAlign="center">
                    💎 Transparence et confiance
                  </Heading>
                  <Text textAlign="center" color={useColorModeValue('gray.700', 'gray.300')}>
                    RétroBus Essonne est une association loi 1901 reconnue d'intérêt général.
                    <br />
                    <strong>RNA :</strong> W912016571 • <strong>SIREN :</strong> 942 506 607 00010
                  </Text>
                  <Text fontSize="sm" textAlign="center" color={useColorModeValue('gray.600', 'gray.400')}>
                    Tous les dons sont utilisés exclusivement pour nos projets de restauration, 
                    l'entretien des véhicules, et l'organisation d'événements publics.
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Box>

      <Modal isOpen={isDonationModalOpen} onClose={onDonationModalClose} size="3xl" isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(6px)" />
        <ModalContent borderRadius="2xl" overflow="hidden">
          <Box bg="linear-gradient(120deg, #9f1239 0%, #d30c4c 45%, #ef4444 100%)" color="white" px={6} py={5}>
            <ModalHeader p={0}>Don ponctuel</ModalHeader>
            <Text opacity={0.95} mt={1}>
              Choisissez votre mode de contribution
            </Text>
          </Box>

          <ModalCloseButton color="white" top="20px" />

          <ModalBody p={{ base: 4, md: 6 }} bg={useColorModeValue('gray.50', 'gray.900')}>
            <Grid templateColumns={{ base: '1fr', md: '280px 1fr' }} gap={4}>
              <GridItem>
                <VStack align="stretch" spacing={2}>
                  {donationMethods.map((method) => (
                    <Button
                      key={method.key}
                      justifyContent="flex-start"
                      leftIcon={<Icon as={method.icon} />}
                      variant={selectedDonationMethod === method.key ? 'solid' : 'outline'}
                      colorScheme={selectedDonationMethod === method.key ? 'red' : 'gray'}
                      onClick={() => setSelectedDonationMethod(method.key)}
                      borderRadius="xl"
                    >
                      {method.label}
                    </Button>
                  ))}
                </VStack>
              </GridItem>

              <GridItem>
                <Box
                  bg={useColorModeValue('white', 'gray.800')}
                  borderWidth="1px"
                  borderColor={useColorModeValue('gray.200', 'gray.700')}
                  borderRadius="xl"
                  p={{ base: 4, md: 5 }}
                  minH="250px"
                >
                  {selectedDonationMethod === 'cheque' && (
                    <VStack align="start" spacing={3}>
                      <Heading size="sm" color="red.600">Don par cheque</Heading>
                      <Text>
                        a l'ordre de :
                      </Text>
                      <Text fontWeight="700">Association RetroBus Essonne</Text>
                      <Text>
                        Avec le motif :
                      </Text>
                      <Text fontWeight="700">Don associatif</Text>
                      <Text>
                        Le cheque doit etre <Text as="span" fontWeight="700">date et signe</Text> au dos.
                      </Text>
                    </VStack>
                  )}

                  {selectedDonationMethod === 'especes' && (
                    <VStack align="start" spacing={3}>
                      <Heading size="sm" color="red.600">Don en especes</Heading>
                      <Text>
                        Merci de nous adresser un e-mail via le mail de l'association.
                      </Text>
                      <Button
                        as="a"
                        href="mailto:contact@retrobus-essonne.fr"
                        leftIcon={<Icon as={FiMail} />}
                        colorScheme="red"
                        variant="outline"
                      >
                        Envoyer un e-mail
                      </Button>
                    </VStack>
                  )}

                  {selectedDonationMethod === 'cb' && (
                    <VStack align="start" spacing={3}>
                      <Heading size="sm" color="red.600">Don par CB via HelloAsso</Heading>
                      <Text>
                        Paiement securise en ligne par carte bancaire.
                      </Text>
                      <Button
                        as="a"
                        href="https://www.helloasso.com/associations/association-retrobus-essonne/formulaires/3"
                        target="_blank"
                        rel="noopener noreferrer"
                        colorScheme="red"
                        rightIcon={<FiExternalLink />}
                      >
                        Acceder a HelloAsso
                      </Button>
                    </VStack>
                  )}

                  {selectedDonationMethod === 'virement' && (
                    <VStack align="start" spacing={3}>
                      <Heading size="sm" color="red.600">Don par virement bancaire</Heading>
                      <Text>
                        Cliquez sur "Afficher" pour consulter les coordonnees bancaires de l'association.
                      </Text>
                      <Button
                        onClick={() => setShowBankDetails((prev) => !prev)}
                        leftIcon={<Icon as={FiExternalLink} />}
                        colorScheme="red"
                        variant="outline"
                      >
                        Afficher
                      </Button>

                      {showBankDetails && (
                        <Box
                          w="100%"
                          bg={useColorModeValue('red.50', 'gray.700')}
                          borderWidth="1px"
                          borderColor={useColorModeValue('red.100', 'gray.600')}
                          borderRadius="md"
                          p={3}
                        >
                          <VStack align="start" spacing={1}>
                            <Text><strong>Titulaire :</strong> ASSOCIATION RETROBUS ESSONNE</Text>
                            <Text><strong>IBAN :</strong> FR76 3000 4008 4100 0104 7286 933</Text>
                            <Text><strong>BIC :</strong> BNPAFRPPXXX</Text>
                          </VStack>
                        </Box>
                      )}
                    </VStack>
                  )}
                </Box>
              </GridItem>
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isAdhesionModalOpen} onClose={closeAdhesionModal} size="3xl" isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(6px)" />
        <ModalContent borderRadius="2xl" overflow="hidden">
          <Box bg="linear-gradient(120deg, #1e3a8a 0%, #2563eb 45%, #38bdf8 100%)" color="white" px={6} py={5}>
            <ModalHeader p={0}>Adhesion</ModalHeader>
            <Text opacity={0.95} mt={1}>
              Candidature d'adhesion en ligne
            </Text>
          </Box>

          <ModalCloseButton color="white" top="20px" />

          <ModalBody p={{ base: 4, md: 6 }} bg={useColorModeValue('gray.50', 'gray.900')}>
            <Grid templateColumns={{ base: '1fr', md: '280px 1fr' }} gap={4}>
              <GridItem>
                <VStack align="stretch" spacing={2}>
                  <Button
                    w="100%"
                    justifyContent="flex-start"
                    leftIcon={<Icon as={FiUsers} />}
                    variant="solid"
                    colorScheme="blue"
                    borderRadius="xl"
                  >
                    Demande d'adhesion
                  </Button>
                  <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                    On etudie chaque candidature avec attention dans la vie associative, puis on vous recontacte rapidement par email.
                  </Text>
                </VStack>
              </GridItem>

              <GridItem>
                <Box
                  bg={useColorModeValue('white', 'gray.800')}
                  borderWidth="1px"
                  borderColor={useColorModeValue('gray.200', 'gray.700')}
                  borderRadius="xl"
                  p={{ base: 4, md: 5 }}
                  minH="250px"
                >
                  <VStack align="stretch" spacing={4}>
                    <Heading size="sm" color="blue.600">Candidater en quelques lignes</Heading>

                    {adhesionError && (
                      <Alert status="error" borderRadius="md">
                        <AlertIcon />
                        {adhesionError}
                      </Alert>
                    )}

                    {adhesionSuccess && (
                      <Alert status="success" borderRadius="md">
                        <AlertIcon />
                        Votre demande d'adhesion a bien ete envoyee.
                      </Alert>
                    )}

                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                      <FormControl isRequired>
                        <FormLabel>Nom</FormLabel>
                        <Input
                          value={adhesionForm.lastName}
                          onChange={(e) => handleAdhesionChange('lastName', e.target.value)}
                          placeholder="Votre nom"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Prenom</FormLabel>
                        <Input
                          value={adhesionForm.firstName}
                          onChange={(e) => handleAdhesionChange('firstName', e.target.value)}
                          placeholder="Votre prenom"
                        />
                      </FormControl>
                    </Grid>

                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                      <FormControl>
                        <FormLabel>Telephone</FormLabel>
                        <Input
                          value={adhesionForm.phone}
                          onChange={(e) => handleAdhesionChange('phone', e.target.value)}
                          placeholder="06..."
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          value={adhesionForm.email}
                          onChange={(e) => handleAdhesionChange('email', e.target.value)}
                          placeholder="vous@exemple.fr"
                        />
                      </FormControl>
                    </Grid>

                    <FormControl isRequired>
                      <FormLabel>Candidature</FormLabel>
                      <Textarea
                        value={adhesionForm.candidature}
                        onChange={(e) => handleAdhesionChange('candidature', e.target.value)}
                        placeholder="Presentez votre motivation en quelques lignes"
                        minH="140px"
                      />
                    </FormControl>

                    <HStack justify="flex-end">
                      <Button variant="ghost" onClick={closeAdhesionModal}>Fermer</Button>
                      <Button
                        colorScheme="blue"
                        onClick={handleAdhesionSubmit}
                        isLoading={adhesionLoading}
                        loadingText="Envoi..."
                      >
                        Envoyer la candidature
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              </GridItem>
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
