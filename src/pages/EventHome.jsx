import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import {
  Box, Button, Container, Heading, Text, VStack, HStack,
  Card, CardBody, Badge, Icon, Divider, useColorModeValue,
  Grid, SimpleGrid
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import {
  FiCalendar, FiMapPin, FiClock, FiUsers, FiInfo, FiChevronLeft, FiChevronRight
} from "react-icons/fi";
import { getEventModeConfig, EVENT_TYPES } from "../utils/eventModeConfig.js";
import pageBg from "../assets/logo_arriere_plan.svg";
import Home from "./Home.jsx";

export default function EventHome() {
  const [eventConfig, setEventConfig] = useState(null);
  const [timeUntil, setTimeUntil] = useState(null);
  const scrollRef = useRef(null);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    setEventConfig(getEventModeConfig());
  }, []);

  useEffect(() => {
    if (!eventConfig) return;

    const update = () => {
      const now = new Date();
      const target = new Date(eventConfig.event?.actualStartDate || eventConfig.startDate);
      const diff = target - now;

      if (diff < 0) return setTimeUntil(null);

      setTimeUntil({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60)
      });
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [eventConfig]);

  if (!eventConfig) return null;

  const event = eventConfig.event || {};
  const registration = eventConfig.registration || {};
  const customContent = eventConfig.customContent || {};
  const eventType = EVENT_TYPES[event.type] || EVENT_TYPES.CUSTOM;

  const mainColor = event.color || '#d30c4c';
  const secondaryColor = '#ffae00';

  // Utiliser actualStartDate/actualEndDate si disponibles
  const displayStartDate = event.actualStartDate || eventConfig.startDate;
  const displayEndDate = event.actualEndDate || eventConfig.endDate;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString('fr-FR', {
      hour: '2-digit', minute: '2-digit'
    });

  const renderEventTitle = () => {
    return (
      <Heading 
        as="h1" 
        fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}        
        fontWeight="bold"
        lineHeight="1"
        color="white"
      >
        <Box as="span">J</Box>ournées{' '}
        <Box as="span">E</Box>uropéennes{'\u00A0'}du{' '}
        <Box as="span">P</Box>atrimoine{'\u00A0'}2026
      </Heading>
    );
  };

  return (
    <>
      <Helmet>
        <title>{event.name || "Journées Européenne du Patrimoine 2026"} - RBE</title>
      </Helmet>

      <Box
        bg={bgColor}
        pt={{ base: "130px", md: "17px" }}
        style={{
          "--page-mark": `url(${pageBg})`,
          "--mark-size": "700px",
          "--mark-opacity": "0.04"
        }}
      >
        {/* HERO SECTION - PLEINE LARGEUR */}
        <Box 
          w="100vw"
          position="relative"
          left="50%"
          right="50%"
          ml="-50vw"
          mr="-50vw"
          bg="#d30c4c"
          py={{ base: 0, lg: 10 }}
          pb={{ base: 15, lg: 30 }}
          overflow="visible"
        >
          <Container 
            maxW="container.xl" 
            px={{ base: 4, md: 6, lg: 8, xl: 5 }}
          >
            <Grid
              templateColumns={{
                base: '1fr',
                lg: 'minmax(0px, 2.5fr) minmax(300px, 2fr) minmax(300px, 2fr) minmax(320px, 1.5fr) minmax(320px, 0.9fr)'
              }}
              columnGap={{ base: 0, lg: 6, xl: 8 }}
              rowGap={{ base: 6, lg: 6 }}
              alignItems="start"
            >
              {/* Colonne 1 : Titre principal */}
             <VStack 
                spacing={4} 
                align="flex-start"
                ml={{ base: 0, lg: '10px', xl: '-400px' }}
                maxW="800px"
              >
                <HStack spacing={3} flexWrap="wrap">
                  <Badge 
                    colorScheme="#d30c4c"
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="full"
                    textTransform="uppercase"
                    bg={secondaryColor}
                    color="white"
                    width="fit-content"
                  >
                    {eventType.icon} {eventType.label}
                  </Badge>
                  <Badge 
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="full"
                    textTransform="uppercase"
                    bg="#000000"
                    color="white"
                    width="fit-content"
                  >
                    ✦ ÉVÉNEMENT SPÉCIAL
                  </Badge>
                </HStack>

                {renderEventTitle()}

                <Text 
                  fontSize={{ base: "xs", md: "4xl" }}
                  color="white"
                  fontWeight="semibold"
                  pt={20}
                  mb={-5}
                >
                  Les partenaires
                </Text>
                
                <Text 
                  fontSize={{ base: "xs", md: "lg" }}
                  color="white"
                  fontStyle="italic"
                  fontWeight="normal"
                >
                  Ils soutiennent l'évènement
                </Text>
              </VStack>

              {/* Colonne 2 : Date & Horaires */}
              <Card 
                bg={cardBg}
                boxShadow="xl"
                w="full"
                maxW="340px"
                minH="180px"
                ml={{ base: 0, lg: 32 }}
              >
                <CardBody>
                  <VStack spacing={3} align="flex-start">
                    <HStack spacing={2}>
                      <Icon as={FiCalendar} color={mainColor} boxSize={5} />
                      <Heading size="sm" color={mainColor}>
                        Date & Horaires
                      </Heading>
                    </HStack>
                    <Text fontWeight="medium">
                      {formatDate(displayStartDate)}
                    </Text>
                    <Divider />
                    <HStack spacing={2}>
                      <Icon as={FiClock} color={mainColor} />
                      <Text fontSize="sm" fontWeight="medium">
                        {formatTime(displayStartDate)} - {formatTime(displayEndDate)}
                      </Text>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* Colonne 3 : Lieu */}
              <Card 
                bg={cardBg}
                boxShadow="xl"
                w="full"
                maxW="340px"
                minH="180px"
                ml={{ base: 0, lg: 32 }}
              >
                <CardBody>
                  <VStack spacing={3} align="flex-start">
                    <HStack spacing={2}>
                      <Icon as={FiMapPin} color={mainColor} boxSize={5} />
                      <Heading size="sm" color={mainColor}>
                        Lieu
                      </Heading>
                    </HStack>
                    <Text fontSize="sm" fontWeight="medium">
                      {event.location || 'Parking Crété, Corbeil-Essonnes'}
                    </Text>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      colorScheme="red"
                      leftIcon={<Icon as={FiMapPin} />}
                    >
                      Voir sur la carte
                    </Button>
                  </VStack>
                </CardBody>
              </Card>

              {/* Colonne 4 : Compte à rebours */}
              {customContent.showCountdown && timeUntil && (
                <Card 
                  bg="white" 
                  boxShadow="lg" 
                  w="full" 
                  maxW="340px"
                  minH="180px"
                  ml={{ base: 0, lg: 32 }}
                >
                  <CardBody>
                    <VStack spacing={3}>
                      <Text fontSize="xs" fontWeight="bold" color={mainColor} textTransform="uppercase" textAlign="center">
                        ⏰ L'événement commence dans
                      </Text>
                      <Text fontSize="3xl" fontWeight="bold" color="#000000" textAlign="center">
                        {timeUntil.days} {timeUntil.days > 1 ? 'jours' : 'jour'}, {timeUntil.hours} h et {timeUntil.minutes} min
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              )}

              {/* Colonne 5 : Inscription */}
              <Card 
                bg="white"
                boxShadow="xl"
                w="full"
                maxW="340px"
                minH="180px"
                ml={{ base: 0, lg: 32 }}
              >
                <CardBody>
                  <VStack spacing={2}>
                    <HStack spacing={2}>
                      <Icon as={FiUsers} color={mainColor} boxSize={5} />
                      <Heading size="md" color={mainColor}>
                        {registration.enabled ? "Inscription" : "Participation"}
                      </Heading>
                    </HStack>
                    
                    {registration.enabled ? (
                      <>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          Réservez votre place pour cet événement exceptionnel
                        </Text>
                        <Button
                          as={RouterLink}
                          to={`/evenement/${registration.eventId}/inscription`}
                          bg={mainColor}
                          color="white"
                          w="full"
                          size="lg"
                          _hover={{ bg: mainColor, opacity: 0.9 }}
                        >
                          S'inscrire maintenant
                        </Button>
                      </>
                    ) : (
                      <>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          Entrée gratuite sur inscription
                        </Text>
                        <Text fontSize="xs" color="gray.500" textAlign="center">
                          Aucune inscription nécessaire
                        </Text>
                      </>
                    )}
                  </VStack>
                </CardBody>
              </Card>

              {/* Carrousel des logos partenaires - S'étend sur les colonnes 2-5 */}
              <Box 
                gridColumn={{ base: "1", lg: "2 / 6" }}
                position="relative"
                w="full"
                mt={{ base: 4, lg: -28 }}
                ml={{ base: 0, lg: 20 }}
              >
                {/* Bouton gauche */}
                <Button
                  position="absolute"
                  left="-15px"
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex={2}
                  onClick={() => {
                    if (scrollRef.current) {
                      scrollRef.current.scrollTo({
                        left: scrollRef.current.scrollLeft - 280,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  bg="white"
                  color={mainColor}
                  borderRadius="full"
                  boxShadow="lg"
                  _hover={{ bg: 'gray.100' }}
                  size="sm"
                >
                  <Icon as={FiChevronLeft} boxSize={5} />
                </Button>

                {/* Conteneur avec gradients */}
                <Box position="relative" overflow="hidden" px={8}>
                  {/* Gradient gauche */}
                  <Box
                    position="absolute"
                    left={0}
                    top={0}
                    bottom={0}
                    w="80px"
                    bgGradient="linear(to-r, #d30c4c, transparent)"
                    zIndex={1}
                    pointerEvents="none"
                  />

                  {/* Gradient droite */}
                  <Box
                    position="absolute"
                    right={0}
                    top={0}
                    bottom={0}
                    w="80px"
                    bgGradient="linear(to-l, #d30c4c, transparent)"
                    zIndex={1}
                    pointerEvents="none"
                  />

                  {/* Conteneur scrollable des logos */}
                  <Box
                    ref={scrollRef}
                    display="flex"
                    gap={8}
                    overflowX="auto"
                    py={4}
                    css={{
                      '&::-webkit-scrollbar': { display: 'none' },
                      scrollbarWidth: 'none',
                      scrollBehavior: 'smooth'
                    }}
                  >
                    {/* Logos partenaires depuis event_jep26 */}
                    <Box
                      minW="250px"
                      h="120px"
                      bg="white"
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="md"
                      p={3}
                      transition="all 0.3s"
                      _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                      flexShrink={0}
                    >
                      <img 
                        src="/assets/event_jep26/pngegg.png" 
                        alt="Partenaire"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </Box>
                    <Box
                      minW="250px"
                      h="120px"
                      bg="white"
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="md"
                      p={3}
                      transition="all 0.3s"
                      _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                      flexShrink={0}
                    >
                      <img 
                        src="/assets/event_jep26/IdFMobilités.svg.png" 
                        alt="Île-de-France Mobilités"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </Box>
                    <Box
                      minW="250px"
                      h="120px"
                      bg="white"
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="md"
                      p={3}
                      transition="all 0.3s"
                      _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                      flexShrink={0}
                    >
                      <img 
                        src="/assets/event_jep26/Logo_commune_de_Corbeil-Essonnes.svg.png" 
                        alt="Commune de Corbeil-Essonnes"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </Box>
                    <Box
                      minW="250px"
                      h="120px"
                      bg="white"
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="md"
                      p={3}
                      transition="all 0.3s"
                      _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                      flexShrink={0}
                    >
                      <img 
                        src="/assets/event_jep26/Logo_SNCF_(2011).svg.png" 
                        alt="SNCF"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </Box>
                    <Box
                      minW="250px"
                      h="120px"
                      bg="white"
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="md"
                      p={3}
                      transition="all 0.3s"
                      _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                      flexShrink={0}
                    >
                      <img 
                        src="/assets/event_jep26/27.png" 
                        alt="Partenaire 27"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </Box>
                    <Box
                      minW="250px"
                      h="120px"
                      bg="white"
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="md"
                      p={3}
                      transition="all 0.3s"
                      _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                      flexShrink={0}
                    >
                      <img 
                        src="/assets/event_jep26/28.png" 
                        alt="Partenaire 28"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </Box>
                    <Box
                      minW="250px"
                      h="120px"
                      bg="white"
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="md"
                      p={3}
                      transition="all 0.3s"
                      _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                      flexShrink={0}
                    >
                      <img 
                        src="/assets/event_jep26/29.png" 
                        alt="Partenaire 29"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </Box>
                    <Box
                      minW="250px"
                      h="120px"
                      bg="white"
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="md"
                      p={3}
                      transition="all 0.3s"
                      _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                      flexShrink={0}
                    >
                      <img 
                        src="/assets/event_jep26/30.png" 
                        alt="Partenaire 30"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </Box>
                    <Box
                      minW="250px"
                      h="120px"
                      bg="white"
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="md"
                      p={3}
                      transition="all 0.3s"
                      _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                      flexShrink={0}
                    >
                      <img 
                        src="/assets/event_jep26/31.png" 
                        alt="Partenaire 31"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Bouton droite */}
                <Button
                  position="absolute"
                  right="-15px"
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex={2}
                  onClick={() => {
                    if (scrollRef.current) {
                      scrollRef.current.scrollTo({
                        left: scrollRef.current.scrollLeft + 280,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  bg="white"
                  color={mainColor}
                  borderRadius="full"
                  boxShadow="lg"
                  _hover={{ bg: 'gray.100' }}
                  size="sm"
                >
                  <Icon as={FiChevronRight} boxSize={5} />
                </Button>
              </Box>
            </Grid>
          </Container>
        </Box>

        <Container maxW="container.xl" py={8} mt={{ base: 0, lg: -66 }}>
        </Container>

        {/* Intégration du contenu normal de Home */}
        <Box mt={16}>
          <Home />
        </Box>
      </Box>
    </>
  );
}