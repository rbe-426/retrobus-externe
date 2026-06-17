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
  Grid,
  GridItem,
  useDisclosure,
} from '@chakra-ui/react';
import { FiHeart, FiUsers, FiTruck, FiCheckCircle, FiExternalLink, FiCreditCard, FiMail, FiDollarSign } from 'react-icons/fi';
import AdSense from '../components/AdSense';

export default function NousSoutenir() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { isOpen: isDonationModalOpen, onOpen: onDonationModalOpen, onClose: onDonationModalClose } = useDisclosure();
  const { isOpen: isAdhesionModalOpen, onOpen: onAdhesionModalOpen, onClose: onAdhesionModalClose } = useDisclosure();
  const [selectedDonationMethod, setSelectedDonationMethod] = useState('cheque');
  const [showBankDetails, setShowBankDetails] = useState(false);

  const donationMethods = [
    { key: 'cheque', label: 'Par cheque', icon: FiMail },
    { key: 'especes', label: 'Par espece', icon: FiDollarSign },
    { key: 'cb', label: 'Par CB via HelloAsso', icon: FiCreditCard },
    { key: 'virement', label: 'Par virement bancaire', icon: FiExternalLink },
  ];

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

            <Box px={{ base: 0, md: 12 }}>
              <AdSense
                slot="6655411407"
                format="auto"
                responsive
                style={{ margin: '6px 0 2px 0' }}
              />
            </Box>

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

      <Modal isOpen={isAdhesionModalOpen} onClose={onAdhesionModalClose} size="3xl" isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(6px)" />
        <ModalContent borderRadius="2xl" overflow="hidden">
          <Box bg="linear-gradient(120deg, #1e3a8a 0%, #2563eb 45%, #38bdf8 100%)" color="white" px={6} py={5}>
            <ModalHeader p={0}>Adhesion</ModalHeader>
            <Text opacity={0.95} mt={1}>
              Espace informations d'adhesion
            </Text>
          </Box>

          <ModalCloseButton color="white" top="20px" />

          <ModalBody p={{ base: 4, md: 6 }} bg={useColorModeValue('gray.50', 'gray.900')}>
            <Grid templateColumns={{ base: '1fr', md: '280px 1fr' }} gap={4}>
              <GridItem>
                <Button
                  w="100%"
                  justifyContent="flex-start"
                  leftIcon={<Icon as={FiUsers} />}
                  variant="solid"
                  colorScheme="blue"
                  borderRadius="xl"
                >
                  Campagne d'adhesion
                </Button>
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
                  <VStack align="start" spacing={3}>
                    <Heading size="sm" color="blue.600">Aucune campagne d'adhesion en cours</Heading>
                    <Text>
                      Pour le moment, aucune campagne d'adhesion n'est ouverte.
                    </Text>
                    <Text>
                      Revenez prochainement pour connaitre la prochaine periode d'adhesion.
                    </Text>
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
