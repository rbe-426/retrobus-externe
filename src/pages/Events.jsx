import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { 
  Box, Container, Heading, Text, VStack, Button, Badge, HStack, 
  Spinner, Center, Alert, AlertIcon, Icon, Tooltip, SimpleGrid,
  Card, CardBody, CardHeader, useToast, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure,
  Divider
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiUsers, FiLock, FiGlobe, FiClock, FiMapPin, FiCalendar, FiDownload, FiEyeOff } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Événements de fallback pour le développement
const fallbackEvents = [
  {
    id: "halloween2025",
    title: "RétroWouh ! Halloween",
    date: "2025-10-31",
    time: "20:00",
    location: "Salle des Fêtes de Villebon",
    adultPrice: 15,
    childPrice: 8,
    description: "Soirée spéciale Halloween avec animations, musique et surprises !",
    status: "PUBLISHED",
    extras: JSON.stringify({
      isVisible: true,
      requiresRegistration: true,
      allowPublicRegistration: true,
      isFree: false,
      eventType: 'public_open'
    })
  },
];

export default function Events() {
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching events from:', `${API_BASE_URL}/public/events`);
        
        const response = await fetch(`${API_BASE_URL}/public/events`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Impossible de charger les événements`);
        }
        
        const data = await response.json();
        console.log('📅 Raw events data:', data);
        
        // Filtrer seulement les événements publiés et visibles
        const visibleEvents = data.filter(event => {
          if (event.status !== 'PUBLISHED') {
            console.log(`❌ Event "${event.title}" filtered: not published (${event.status})`);
            return false;
          }
          
          // Vérifier si l'événement est visible publiquement
          try {
            const extras = event.extras ? JSON.parse(event.extras) : {};
            const isVisible = extras.isVisible !== false; // Par défaut visible si pas spécifié
            
            if (!isVisible) {
              console.log(`❌ Event "${event.title}" filtered: not visible`);
              return false;
            }
            
            console.log(`✅ Event "${event.title}" included: published and visible`);
            return true;
          } catch (e) {
            console.log(`✅ Event "${event.title}" included: old format, assumed visible`);
            return true; // Événements anciens considérés comme visibles
          }
        });
        
        // Normaliser les dates
        const normalizedEvents = visibleEvents.map(event => ({
          ...event,
          date: (typeof event.date === 'string') ? event.date.substring(0, 10) : event.date
        }));
        
        console.log('✅ Final visible events:', normalizedEvents.length);
        setEvents(normalizedEvents);
        
        if (normalizedEvents.length === 0 && data.length > 0) {
          toast({
            status: "info",
            title: "Aucun événement public",
            description: `${data.length} événement(s) trouvé(s) mais aucun n'est visible publiquement.`,
            duration: 5000
          });
        }
        
      } catch (e) {
        console.warn('❌ Events fetch failed, using fallback:', e.message);
        setError(e.message);
        setEvents(fallbackEvents);
        
        toast({
          status: "warning",
          title: "Données de démonstration",
          description: "Impossible de charger les événements en temps réel.",
          duration: 5000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  const getEventTypeInfo = (event) => {
    try {
      const extras = event.extras ? JSON.parse(event.extras) : {};
      
      console.log(`🔍 Event "${event.title}" raw extras:`, extras);
      
      // Utiliser directement les valeurs des extras sans forcer de logique
      const info = {
        isVisible: extras.isVisible !== false, // Par défaut visible
        requiresRegistration: extras.requiresRegistration === true, // Par défaut false
        allowPublicRegistration: extras.allowPublicRegistration === true, // Par défaut false
        isFree: extras.isFree !== false, // Par défaut gratuit
        maxParticipants: extras.maxParticipants || null,
        registrationDeadline: extras.registrationDeadline || null,
        registrationMethod: extras.registrationMethod || 'none',
        pdfUrl: extras.pdfUrl || null,
        eventType: extras.eventType || 'public_free_access'
      };
      
      console.log(`📊 Event "${event.title}" computed info:`, info);
      return info;
      
    } catch (e) {
      console.log(`⚠️ Error parsing event "${event.title}" extras:`, e);
      
      // Fallback simple pour les anciens événements
      return {
        isVisible: true,
        requiresRegistration: false, // Par défaut pas d'inscription
        allowPublicRegistration: false,
        isFree: true,
        maxParticipants: null,
        registrationDeadline: null,
        registrationMethod: 'none',
        pdfUrl: null,
        eventType: 'legacy'
      };
    }
  };

  const getRegistrationButton = (event) => {
    const info = getEventTypeInfo(event);
    
    console.log(`🎯 Button logic for "${event.title}":`, {
      isVisible: info.isVisible,
      requiresRegistration: info.requiresRegistration,
      allowPublicRegistration: info.allowPublicRegistration,
      eventType: info.eventType
    });
    
    // LOGIQUE CLAIRE ET SIMPLE :
    
    // 1. Événement non visible → null (ne devrait pas arriver ici)
    if (!info.isVisible) {
      console.log(`🚫 Event not visible, no button`);
      return null;
    }
    
    // 2. Évènement Privé spécial → Bouton inactif "Évènement Privé"
    if (info.eventType === 'private_outing' || (!info.requiresRegistration && !info.allowPublicRegistration && info.eventType !== 'public_open_access')) {
      console.log(`🔒 Private outing → Disabled button`);
      return (
        <Button
          leftIcon={<FiEyeOff />}
          variant="outline"
          colorScheme="yellow"
          size="lg"
          className="event-btn"
          isDisabled
          cursor="not-allowed"
        >
          Évènement Privé
        </Button>
      );
    }
    
    // 3. Pas d'inscription requise → Ouvert au public
    if (!info.requiresRegistration) {
      console.log(`🌍 No registration required → Open to public`);
      return (
        <Button
          leftIcon={<FiGlobe />}
          variant="outline"
          colorScheme="green"
          size="lg"
          className="event-btn"
        >
          Ouvert au public
        </Button>
      );
    }
    
    // 4. Inscription requise MAIS public ne peut pas s'inscrire → Contacter l'association
    if (info.requiresRegistration && !info.allowPublicRegistration) {
      console.log(`📞 Registration required but not public → Contact association`);
      return (
        <Button
          as={RouterLink}
          to="/contact"
          leftIcon={<FiUsers />}
          variant="outline"
          colorScheme="orange"
          size="lg"
          className="event-btn"
        >
          Contacter l'association
        </Button>
      );
    }
    
    // 5. Inscription requise ET public peut s'inscrire → Vérifier deadline puis méthode
    if (info.requiresRegistration && info.allowPublicRegistration) {
      console.log(`✅ Registration required and public allowed`);
      
      // Vérifier si les inscriptions sont fermées (deadline)
      if (info.registrationDeadline) {
        const deadline = new Date(info.registrationDeadline);
        const now = new Date();
        if (now > deadline) {
          console.log(`⏰ Registration deadline passed`);
          return (
            <Button
              leftIcon={<FiClock />}
              variant="outline"
              colorScheme="red"
              size="lg"
              isDisabled
              className="event-btn"
            >
              Inscriptions fermées
            </Button>
          );
        }
      }
      
      // Choisir la méthode d'inscription
      switch (info.registrationMethod) {
        case 'helloasso':
          if (event.helloAssoUrl) {
            console.log(`🔗 HelloAsso registration`);
            return (
              <Button
                onClick={() => {
                  setSelectedEvent(event);
                  onOpen();
                }}
                size="lg"
                className="event-btn event-btn-primary"
              >
                S'inscrire via HelloAsso
              </Button>
            );
          }
          break;
          
        case 'pdf':
          if (info.pdfUrl) {
            console.log(`📄 PDF registration`);
            return (
              <Button
                as="a"
                href={info.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                leftIcon={<FiDownload />}
                size="lg"
                className="event-btn event-btn-primary"
              >
                Télécharger le formulaire
              </Button>
            );
          }
          break;
          
        case 'internal':
        default:
          console.log(`📝 Internal registration form`);
          return (
            <Button
              as={RouterLink}
              to={`/evenement/${event.id}/inscription?title=${encodeURIComponent(event.title)}&date=${event.date}&time=${event.time || ''}&location=${encodeURIComponent(event.location || '')}&adultPrice=${event.adultPrice ?? ''}&childPrice=${event.childPrice ?? ''}`}
              leftIcon={<FiUsers />}
              size="lg"
              className="event-btn event-btn-primary"
            >
              S'inscrire
            </Button>
          );
      }
    }
    
    // Fallback - ne devrait jamais arriver
    console.log(`❓ Fallback case for event logic`);
    return (
      <Button
        leftIcon={<FiUsers />}
        size="lg"
        isDisabled
        className="event-btn"
        variant="outline"
        colorScheme="gray"
      >
        Inscription non disponible
      </Button>
    );
  };

  const getEventBadges = (event) => {
    const info = getEventTypeInfo(event);
    const badges = [];
    
    if (info.isFree) {
      badges.push(
        <Badge key="free" colorScheme="green" className="event-badge">
          Gratuit
        </Badge>
      );
    } else {
      badges.push(
        <Badge key="paid" colorScheme="blue" className="event-badge">
          Payant
        </Badge>
      );
    }
    
    if (info.maxParticipants) {
      badges.push(
        <Tooltip key="limited" label={`Places limitées à ${info.maxParticipants} participants`}>
          <Badge colorScheme="orange" className="event-badge">
            <Icon as={FiUsers} mr={1} />
            {info.maxParticipants} places
          </Badge>
        </Tooltip>
      );
    }
    
    if (info.registrationDeadline) {
      const deadline = new Date(info.registrationDeadline);
      const deadlineStr = deadline.toLocaleDateString('fr-FR');
      badges.push(
        <Tooltip key="deadline" label={`Inscriptions jusqu'au ${deadlineStr}`}>
          <Badge colorScheme="purple" className="event-badge">
            <Icon as={FiClock} mr={1} />
            Jusqu'au {deadlineStr}
          </Badge>
        </Tooltip>
      );
    }
    
    return badges;
  };

  const handleRegistration = (event) => {
    // Vérifier si l'événement a une URL HelloAsso configurée
    if (event.helloAssoUrl) {
      // Redirection vers HelloAsso
      window.open(event.helloAssoUrl, '_blank');
    } else {
      // Fallback vers inscription interne
      toast({
        status: 'info',
        title: 'Inscription',
        description: 'Redirection vers le système d\'inscription...',
        duration: 3000
      });
      
      // Ici vous pourriez rediriger vers un formulaire d'inscription interne
      // window.location.href = `/events/${event.id}/register`;
    }
  };

  return (
    <>
      <Helmet>
        <title>Événements - Association RétroBus Essonne</title>
        <meta name="description" content="Découvrez les prochains événements, sorties et expositions de l'association RétroBus Essonne." />
      </Helmet>

      {/* CSS personnalisé pour harmoniser avec le thème */}
      <style jsx>{`
        .event-card {
          background: #fff;
          border: 2px solid #f7f7f7;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          overflow: hidden;
        }
        
        .event-card:hover {
          border-color: var(--rbe-red);
          box-shadow: 0 8px 24px rgba(190, 0, 60, 0.15);
          transform: translateY(-4px);
        }
        
        .event-btn {
          font-family: "Montserrat", sans-serif !important;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .event-btn-primary {
          background: var(--rbe-red) !important;
          color: white !important;
          border: 2px solid var(--rbe-red) !important;
        }
        
        .event-btn-primary:hover {
          background: var(--rbe-accent) !important;
          border-color: var(--rbe-accent) !important;
          transform: translateY(-2px);
        }
        
        .event-badge {
          font-family: "Montserrat", sans-serif !important;
          font-weight: 600;
        }
        
        .event-title {
          color: var(--rbe-red) !important;
          font-family: "Montserrat", sans-serif !important;
        }
        
        .event-meta {
          color: #666 !important;
        }
        
        .event-description {
          line-height: 1.6;
        }
        
        .event-price {
          color: var(--rbe-red) !important;
          font-weight: 700;
        }
      `}</style>

      <Container maxW="container.xl" py={10}>
        <VStack className="page-header" spacing={4} mb={8} textAlign="center">
          <Heading as="h1" size="2xl" className="page-title">
            Nos Événements
          </Heading>
          <Text className="page-subtitle">
            Découvrez l'agenda de nos prochaines sorties, manifestations et rencontres autour de notre passion pour les véhicules d'époque.
          </Text>
        </VStack>

        {loading ? (
          <Center py={16}>
            <VStack spacing={4}>
              <Spinner size="xl" color="var(--rbe-red)" />
              <Text color="gray.600">Chargement des événements...</Text>
            </VStack>
          </Center>
        ) : error && events === fallbackEvents ? (
          <Alert status="warning" mb={6} borderRadius="lg">
            <AlertIcon />
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold">Mode démonstration</Text>
              <Text fontSize="sm">
                Les données en temps réel ne sont pas disponibles. Voici un aperçu de nos événements.
              </Text>
            </VStack>
          </Alert>
        ) : null}

        {events && events.length === 0 ? (
          <Center py={16}>
            <VStack spacing={6} textAlign="center">
              <Box fontSize="4xl">📅</Box>
              <Heading size="lg" color="gray.600">
                Aucun événement programmé
              </Heading>
              <Text color="gray.500" maxW="md">
                Nous préparons de nouveaux événements passionnants ! 
                Revenez bientôt ou suivez-nous sur nos réseaux sociaux pour être informé en premier.
              </Text>
              <Button
                as={RouterLink}
                to="/contact"
                className="event-btn event-btn-primary"
                size="lg"
              >
                Nous contacter
              </Button>
            </VStack>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {events?.map(event => {
              const info = getEventTypeInfo(event);
              
              return (
                <Card key={event.id} className="event-card">
                  <CardHeader pb={3}>
                    <VStack align="start" spacing={3}>
                      <HStack justify="space-between" w="100%" align="start">
                        <Heading as="h2" size="lg" className="event-title" flex={1}>
                          {event.title}
                        </Heading>
                        <Box flexShrink={0}>
                          {getRegistrationButton(event)}
                        </Box>
                      </HStack>
                      
                      <HStack spacing={4} wrap="wrap">
                        <HStack className="event-meta">
                          <Icon as={FiCalendar} />
                          <Text fontWeight="600">{event.date}</Text>
                          {event.time && <Text>à {event.time}</Text>}
                        </HStack>
                        {getEventBadges(event)}
                      </HStack>
                    </VStack>
                  </CardHeader>
                  
                  <CardBody pt={0}>
                    <VStack align="start" spacing={4}>
                      {event.location && (
                        <HStack className="event-meta">
                          <Icon as={FiMapPin} />
                          <Text>{event.location}</Text>
                        </HStack>
                      )}
                      
                      {event.description && (
                        <Text className="event-description" color="gray.700">
                          {event.description}
                        </Text>
                      )}
                      
                      {!info.isFree && (event.adultPrice || event.childPrice) && (
                        <VStack align="start" spacing={2} w="100%">
                          <Text fontWeight="bold" color="gray.700">Tarifs :</Text>
                          <HStack spacing={6} wrap="wrap">
                            {event.adultPrice && (
                              <Text className="event-price">
                                Adulte : {event.adultPrice}€
                              </Text>
                            )}
                            {event.childPrice && (
                              <Text className="event-price">
                                Enfant (-12 ans) : {event.childPrice}€
                              </Text>
                            )}
                          </HStack>
                        </VStack>
                      )}
                      
                      {/* Informations d'inscription supplémentaires */}
                      {info.requiresRegistration && info.allowPublicRegistration && (
                        <Box p={3} bg="gray.50" borderRadius="md" w="100%">
                          <VStack align="start" spacing={1}>
                            <Text fontSize="sm" fontWeight="bold" color="gray.700">
                              📝 Modalités d'inscription
                            </Text>
                            {info.maxParticipants && (
                              <Text fontSize="sm" color="gray.600">
                                • Places limitées à {info.maxParticipants} participants
                              </Text>
                            )}
                            {info.registrationDeadline && (
                              <Text fontSize="sm" color="gray.600">
                                • Inscription jusqu'au {new Date(info.registrationDeadline).toLocaleDateString('fr-FR')}
                              </Text>
                            )}
                            {info.registrationMethod === 'pdf' && (
                              <Text fontSize="sm" color="gray.600">
                                • Formulaire à imprimer, remplir et renvoyer
                              </Text>
                            )}
                          </VStack>
                        </Box>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              );
            })}
          </SimpleGrid>
        )}

        {/* Modale HelloAsso pour inscription payante */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <VStack align="start" spacing={1}>
                <Heading size="md">{selectedEvent?.title}</Heading>
                <Text fontSize="sm" color="gray.600">
                  Inscription et paiement via HelloAsso
                </Text>
              </VStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack align="stretch" spacing={4}>
                {/* Infos de l'événement */}
                <Box bg="gray.50" p={4} borderRadius="md">
                  <VStack align="start" spacing={3}>
                    {selectedEvent?.date && (
                      <HStack>
                        <Icon as={FiCalendar} color="var(--rbe-red)" />
                        <Text fontWeight="600">{selectedEvent.date}</Text>
                        {selectedEvent.time && <Text>{selectedEvent.time}</Text>}
                      </HStack>
                    )}
                    {selectedEvent?.location && (
                      <HStack>
                        <Icon as={FiMapPin} color="var(--rbe-red)" />
                        <Text>{selectedEvent.location}</Text>
                      </HStack>
                    )}
                    {!selectedEvent?.extras?.isFree && (
                      <VStack align="start" spacing={1} w="100%">
                        <Text fontSize="sm" fontWeight="bold" color="gray.700">Tarifs :</Text>
                        <HStack spacing={6} wrap="wrap">
                          {selectedEvent?.adultPrice && (
                            <Text fontSize="sm" color="var(--rbe-red)" fontWeight="bold">
                              Adulte : {selectedEvent.adultPrice}€
                            </Text>
                          )}
                          {selectedEvent?.childPrice && (
                            <Text fontSize="sm" color="var(--rbe-red)" fontWeight="bold">
                              Enfant : {selectedEvent.childPrice}€
                            </Text>
                          )}
                        </HStack>
                      </VStack>
                    )}
                  </VStack>
                </Box>

                <Divider />

                {/* Intégration HelloAsso */}
                <Box w="100%">
                  <Text fontSize="sm" mb={3} color="gray.600">
                    Cliquez sur le bouton ci-dessous pour procéder à l'inscription et au paiement sécurisé.
                  </Text>
                  <Button
                    as="a"
                    href={selectedEvent?.helloAssoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    colorScheme="blue"
                    size="lg"
                    w="100%"
                    leftIcon={<Icon as={FiUsers} />}
                  >
                    S'inscrire maintenant sur HelloAsso
                  </Button>
                </Box>

                {/* Note sur la sécurité */}
                <Box bg="blue.50" p={3} borderRadius="md" w="100%" borderLeft="4px solid" borderLeftColor="blue.400">
                  <Text fontSize="xs" color="blue.800">
                    ℹ️ La plateforme HelloAsso est sécurisée et certifiée. Vos données de paiement ne sont jamais conservées par nos serveurs.
                  </Text>
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Fermer
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </>
  );
}
