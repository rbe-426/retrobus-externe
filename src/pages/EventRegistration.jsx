import React, { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Spinner,
  Image,
  HStack,
  Badge,
  useToast,
  Alert,
  AlertIcon,
  Divider,
  Icon,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  SimpleGrid,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@chakra-ui/react";
import { FiArrowLeft, FiCalendar, FiMapPin, FiUsers, FiGift, FiExternalLink, FiMail, FiUser, FiSearch } from "react-icons/fi";
import { formatDateFrLong } from "../utils/dateFormat.js";
import "../PremiumRegistration.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function EventRegistration() {
  const { eventId, eventSlug } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Extraire le slug depuis l'URL si eventSlug est undefined
  const extractedSlug = useMemo(() => {
    if (eventSlug) return eventSlug;
    
    // Format: /evenement/rbe-030526-inscription → extraire "rbe-030526"
    const match = location.pathname.match(/\/evenement\/([^/]+)-inscription/);
    return match ? match[1] : null;
  }, [eventSlug, location.pathname]);
  
  // Debug logs
  console.log('🔍 EventRegistration mounted');
  console.log('  - eventId:', eventId);
  console.log('  - eventSlug:', eventSlug);
  console.log('  - extractedSlug:', extractedSlug);
  console.log('  - location.pathname:', location.pathname);
  console.log('  - location.state:', location.state);
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationStep, setRegistrationStep] = useState('form'); // 'form', 'processing', 'success'
  const [registrationId, setRegistrationId] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // Étape du formulaire premium (1-4)
  const [formData, setFormData] = useState({
    participantName: '',
    participantEmail: '',
    firstName: '',
    lastName: '',
    phone: '',
    club: '',
    adultTickets: 1,
    childTickets: 0,
    // Champs spécifiques au Défilé Anciennes
    vehicleName: '',
    vehicleModel: '',
    vehicleYear: '',
    licensePlate: '',
    plateType: '', // 'standard', 'old', 'collection'
    clubName: '',
    isClubMember: false,
    // Réponses aux questions customisées
    customAnswers: {}
  });
  const [registeredVehicles, setRegisteredVehicles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { isOpen: isHelloAssoOpen, onOpen: onHelloAssoOpen, onClose: onHelloAssoClose } = useDisclosure();
  const [isPlateModalOpen, setIsPlateModalOpen] = useState(false);
  const [vehicleSearchStatus, setVehicleSearchStatus] = useState('idle'); // 'idle', 'searching', 'found', 'not-found'
  const toast = useToast();

  // Fonction pour ajouter un véhicule à la liste (SANS reset)
  const handleAddAnotherVehicle = () => {
    // Validation du véhicule actuel
    if (!formData.vehicleName || !formData.vehicleModel || !formData.vehicleYear || !formData.licensePlate) {
      toast({
        status: "warning",
        title: "Véhicule incomplet",
        description: "Veuillez remplir toutes les informations du véhicule avant d'en ajouter un autre.",
        duration: 3000
      });
      return;
    }

    // Ajouter le véhicule à la liste
    const newVehicle = {
      id: Date.now(), // Identifiant unique temporaire
      vehicleName: formData.vehicleName,
      vehicleModel: formData.vehicleModel,
      vehicleYear: formData.vehicleYear,
      licensePlate: formData.licensePlate,
      plateType: formData.plateType,
      clubName: formData.clubName,
      isClubMember: formData.isClubMember
    };

    setRegisteredVehicles(prev => [...prev, newVehicle]);

    toast({
      status: "success",
      title: "Véhicule enregistré",
      description: `${newVehicle.vehicleName} ${newVehicle.vehicleModel} a été ajouté à votre inscription. Cliquez sur "Ajouter un autre véhicule" pour en saisir un nouveau.`,
      duration: 4000
    });
  };

  // Fonction pour réinitialiser le formulaire et saisir un autre véhicule
  const handleResetForNewVehicle = () => {
    // Réinitialiser TOUS les champs du véhicule
    setFormData(prev => ({
      ...prev,
      vehicleName: '',
      vehicleModel: '',
      vehicleYear: '',
      licensePlate: '',
      plateType: '',
      clubName: '',
      isClubMember: false
    }));
    
    // Reset du status de recherche
    setVehicleSearchStatus('idle');

    // Scroll vers le haut de la section véhicule
    setTimeout(() => {
      const vehicleSection = document.querySelector('.premium-section-title');
      if (vehicleSection) {
        vehicleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);

    toast({
      status: "info",
      title: "Nouveau véhicule",
      description: "Vous pouvez maintenant saisir les informations d'un autre véhicule.",
      duration: 2000
    });
  };

  // Fonction pour supprimer un véhicule de la liste
  const handleRemoveVehicle = (vehicleId) => {
    setRegisteredVehicles(registeredVehicles.filter(v => v.id !== vehicleId));
    toast({
      status: "info",
      title: "Véhicule retiré",
      duration: 2000
    });
  };

  // Récupération des détails de l'événement
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        
        // Si l'événement est passé via location.state, l'utiliser directement
        if (location.state?.event) {
          console.log('📦 Using event from navigation state');
          setEvent(location.state.event);
          setLoading(false);
          return;
        }
        
        // Sinon, chercher par slug ou ID
        if (extractedSlug) {
          console.log(`🔍 Fetching event by slug: ${extractedSlug}`);
          
          // Retirer le suffixe "-inscription" si présent (déjà fait par extractedSlug)
          const cleanSlug = extractedSlug.replace(/-inscription$/, '');
          console.log(`🧹 Clean slug for search: ${cleanSlug}`);
          
          // Récupérer tous les événements et chercher par titre
          const response = await fetch(`${API_BASE_URL}/public/events`);
          if (!response.ok) {
            throw new Error(`Impossible de charger les événements (${response.status})`);
          }
          const events = await response.json();
          console.log(`📋 Found ${events.length} public events`);
          
          const foundEvent = events.find(e => {
            const slug = e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            const matches = slug === cleanSlug;
            console.log(`  - Checking "${e.title}" → slug: "${slug}" vs "${cleanSlug}" → ${matches ? '✅' : '❌'}`);
            return matches;
          });
          
          if (!foundEvent) {
            console.error(`❌ No event found matching slug: ${cleanSlug}`);
            throw new Error('Événement non trouvé');
          }
          
          console.log('✅ Event found:', foundEvent.title);
          setEvent(foundEvent);
        } else if (eventId) {
          console.log(`🔍 Fetching event details for ID: ${eventId}`);
          const response = await fetch(`${API_BASE_URL}/public/events/${eventId}`);
          if (!response.ok) {
            throw new Error(`Événement non trouvé (${response.status})`);
          }
          
          const eventData = await response.json();
          console.log('📅 Event details:', eventData);
          
          // Vérifier si l'événement est accessible publiquement
          const extras = eventData.extras ? JSON.parse(eventData.extras) : {};
          if (!extras.isVisible) {
            throw new Error('Cet événement n\'est pas accessible publiquement');
          }
          
          setEvent(eventData);
        }
      } catch (e) {
        console.error('❌ Error fetching event:', e);
        setError(e.message);
        
        // Fallback avec les paramètres URL
        if (searchParams.get('title')) {
          console.log('📝 Using URL parameters as fallback');
          setEvent({
            id: eventId,
            title: searchParams.get('title'),
            date: searchParams.get('date'),
            time: searchParams.get('time'),
            location: searchParams.get('location'),
            adultPrice: parseFloat(searchParams.get('adultPrice')) || null,
            childPrice: parseFloat(searchParams.get('childPrice')) || null,
            description: 'Détails non disponibles',
            extras: JSON.stringify({
              isVisible: true,
              requiresRegistration: true,
              allowPublicRegistration: true,
              isFree: false
            })
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (eventId || extractedSlug) {
      fetchEventDetails();
    } else {
      console.warn('⚠️ No eventId or extractedSlug provided');
      setLoading(false);
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, extractedSlug]); // Retirer location.state et searchParams pour éviter la boucle

  // Vérification périodique du statut de l'inscription
  useEffect(() => {
    if (registrationId && registrationStep === 'processing') {
      const checkStatus = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/registrations/${registrationId}/status`);
          if (response.ok) {
            const status = await response.json();
            console.log('📊 Registration status:', status);
            
            if (status.status === 'VALIDATED' && status.ticketSent) {
              setTicketData(status);
              setRegistrationStep('success');
            }
          }
        } catch (e) {
          console.error('Erreur vérification statut:', e);
        }
      };

      // Vérifier toutes les 5 secondes
      const interval = setInterval(checkStatus, 5000);
      
      // Vérification initiale après 2 secondes
      setTimeout(checkStatus, 2000);

      return () => clearInterval(interval);
    }
  }, [registrationId, registrationStep]);

  // Validation des champs obligatoires de l'étape 1
  const validateStep1 = () => {
    console.log('🔍 Validation Step 1 - FormData:', formData);
    const errors = [];
    if (!formData.lastName?.trim()) {
      console.log('❌ NOM vide');
      errors.push('NOM');
    }
    if (!formData.firstName?.trim()) {
      console.log('❌ Prénom vide');
      errors.push('Prénom');
    }
    if (!formData.participantEmail?.trim()) {
      console.log('❌ Email vide');
      errors.push('Email');
    }
    if (!formData.phone?.trim()) {
      console.log('❌ Téléphone vide');
      errors.push('Téléphone');
    }
    
    if (errors.length > 0) {
      console.log('❌ Erreurs trouvées:', errors);
      toast({
        status: 'error',
        title: 'Champs obligatoires manquants',
        description: `Veuillez remplir : ${errors.join(', ')}`,
        duration: 4000,
        isClosable: true
      });
      return false;
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.participantEmail)) {
      console.log('❌ Email invalide:', formData.participantEmail);
      toast({
        status: 'error',
        title: 'Email invalide',
        description: 'Veuillez saisir une adresse email valide',
        duration: 4000,
        isClosable: true
      });
      return false;
    }
    
    console.log('✅ Validation réussie');
    return true;
  };

  // Formatage automatique de la plaque d'immatriculation selon le type
  const formatLicensePlate = (value, plateType) => {
    // Retirer tous les caractères non alphanumériques
    const cleaned = value.replace(/[^A-Z0-9]/g, '');
    
    if (plateType === 'standard' || plateType === 'collection') {
      // Format XX-XXX-XX
      if (cleaned.length <= 2) {
        return cleaned;
      } else if (cleaned.length <= 5) {
        return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
      } else {
        return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5, 7)}`;
      }
    } else if (plateType === 'old') {
      // Format libre sans tirets (ex: 0920 RB 91)
      // On garde les espaces naturels
      return value.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
    }
    
    return value.toUpperCase();
  };

  // Recherche de véhicule dans le registre d'immatriculations
  const searchVehicleByPlate = async () => {
    if (!formData.licensePlate || !formData.plateType) {
      toast({
        status: 'warning',
        title: 'Veuillez saisir une immatriculation',
        duration: 3000
      });
      return;
    }

    setVehicleSearchStatus('searching');
    console.log('🔍 Recherche du véhicule:', formData.licensePlate);

    try {
      // Appel à l'API backend
      const response = await fetch(`http://localhost:8080/public/vehicles/search?plate=${encodeURIComponent(formData.licensePlate)}`);
      const result = await response.json();

      if (response.ok && result.success && result.data) {
        const vehicleData = result.data;
        console.log('✅ Véhicule trouvé:', vehicleData);
        
        setFormData({
          ...formData,
          vehicleName: vehicleData.make || vehicleData.vehicleName || '',
          vehicleModel: vehicleData.model || vehicleData.vehicleModel || '',
          vehicleYear: vehicleData.year?.toString() || vehicleData.vehicleYear?.toString() || ''
        });
        
        setVehicleSearchStatus('found');
        toast({
          status: 'success',
          title: 'Véhicule trouvé !',
          description: `${vehicleData.make || vehicleData.vehicleName} ${vehicleData.model || vehicleData.vehicleModel} (${vehicleData.year || vehicleData.vehicleYear})`,
          duration: 4000
        });
      } else {
        console.log('❌ Véhicule non trouvé');
        setVehicleSearchStatus('not-found');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la recherche:', error);
      setVehicleSearchStatus('not-found');
      toast({
        status: 'error',
        title: 'Erreur de recherche',
        description: 'Impossible de contacter le service d\'identification',
        duration: 3000
      });
    }
  };

  // Navigation vers étape suivante
  const handleNext = () => {
    console.log('🔵 handleNext appelé - Étape actuelle:', currentStep);
    console.log('📝 FormData:', formData);
    
    if (currentStep === 1 && !validateStep1()) {
      console.log('❌ Validation échouée');
      return;
    }
    
    console.log('✅ Validation réussie, passage à l\'étape suivante');
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Navigation vers étape précédente
  const handlePrev = () => {
    console.log('🔙 handlePrev appelé - Étape actuelle:', currentStep);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getEventTypeInfo = (event) => {
    try {
      const extras = event.extras ? JSON.parse(event.extras) : {};
      return {
        isVisible: extras.isVisible !== false,
        requiresRegistration: extras.requiresRegistration || false,
        allowPublicRegistration: extras.allowPublicRegistration || false,
        isFree: extras.isFree || (!event.adultPrice && !event.childPrice),
        registrationMethod: extras.registrationMethod || 'internal',
        registrationType: extras.registrationType || 'standard'
      };
    } catch (e) {
      return {
        isVisible: true,
        requiresRegistration: true,
        allowPublicRegistration: true,
        isFree: !event.adultPrice && !event.childPrice,
        registrationMethod: 'internal'
      };
    }
  };

  const calculateTotal = () => {
    if (!event) return 0;
    const adultPrice = event.adultPrice || 0;
    const childPrice = event.childPrice || 0;
    return (adultPrice * formData.adultTickets) + (childPrice * formData.childTickets);
  };

  const handleSubmitRegistration = async () => {
    if (!formData.participantName.trim() || !formData.participantEmail.trim()) {
      toast({
        status: "error",
        title: "Champs obligatoires",
        description: "Veuillez remplir votre nom et email."
      });
      return;
    }

    if (formData.adultTickets + formData.childTickets === 0) {
      toast({
        status: "error",
        title: "Nombre de billets",
        description: "Veuillez sélectionner au moins un billet."
      });
      return;
    }

    try {
      setSubmitting(true);
      const eventInfo = getEventTypeInfo(event);
      
      // Validation des champs requis pour défilé de véhicules anciens
      if (eventInfo.registrationType === 'parade_vehicles') {
        if (!formData.vehicleModel?.trim() || !formData.vehicleYear?.trim()) {
          toast({
            status: "error",
            title: "Véhicule incomplet",
            description: "Veuillez remplir le modèle et l'année du véhicule."
          });
          setSubmitting(false);
          return;
        }
        if (formData.isClubMember && !formData.clubName?.trim()) {
          toast({
            status: "error",
            title: "Club requis",
            description: "Veuillez indiquer le nom du club."
          });
          setSubmitting(false);
          return;
        }
      }
      
      const registrationData = {
        eventId: event.id,
        participantName: formData.participantName,
        participantEmail: formData.participantEmail,
        adultTickets: formData.adultTickets,
        childTickets: formData.childTickets,
        paymentMethod: eventInfo.isFree ? 'free' : 
                      (eventInfo.registrationMethod === 'helloasso' ? 'helloasso' : 'internal'),
        // Ajouter les champs spécifiques au défilé si applicable
        ...(eventInfo.registrationType === 'parade_vehicles' && {
          vehicleModel: formData.vehicleModel,
          vehicleYear: formData.vehicleYear,
          vehicleName: formData.vehicleName, // immatriculation optionnelle
          isClubMember: formData.isClubMember,
          clubName: formData.clubName || null
        })
      };

      console.log('📝 Submitting registration:', registrationData);

      const response = await fetch(`${API_BASE_URL}/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de l'inscription (${response.status})`);
      }

      const result = await response.json();
      console.log('✅ Registration created:', result);

      setRegistrationId(result.registrationId);

      // Si HelloAsso, rediriger vers la plateforme
      if (result.helloAssoUrl && registrationData.paymentMethod === 'helloasso') {
        console.log('🔗 Redirecting to HelloAsso:', result.helloAssoUrl);
        setRegistrationStep('processing');
        
        toast({
          status: "info",
          title: "Redirection vers HelloAsso",
          description: "Vous allez être redirigé pour finaliser le paiement.",
          duration: 3000
        });
        
        // Rediriger après un court délai
        setTimeout(() => {
          window.open(result.helloAssoUrl, '_blank', 'noopener,noreferrer');
        }, 1000);
        
      } else {
        // Inscription gratuite ou interne - passage direct au succès
        setRegistrationStep('processing');
        
        // Simuler un court délai pour la génération du billet
        setTimeout(() => {
          setTicketData({
            id: result.registrationId,
            status: 'VALIDATED',
            ticketSent: true,
            event: event,
            qrCode: JSON.stringify({
              registrationId: result.registrationId,
              validationCode: `RBE-${Date.now()}`
            })
          });
          setRegistrationStep('success');
        }, 2000);
      }

    } catch (e) {
      console.error('❌ Registration error:', e);
      toast({
        status: "error",
        title: "Erreur d'inscription",
        description: e.message
      });
    } finally {
      setSubmitting(false);
    }
  };

  const generateQRCodeUrl = (data) => {
    const encodedData = encodeURIComponent(data);
    return `https://api.qrserver.com/v1/create-qr-code/?size=512x512&format=png&data=${encodedData}`;
  };

  if (loading) {
    return (
      <Container maxW="container.md" py={10}>
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Chargement des détails de l'événement...</Text>
        </VStack>
      </Container>
    );
  }

  if (error && !event) {
    return (
      <Container maxW="container.md" py={10}>
        <VStack spacing={4}>
          <Alert status="error">
            <AlertIcon />
            <VStack align="start">
              <Text fontWeight="bold">Événement non accessible</Text>
              <Text fontSize="sm">{error}</Text>
            </VStack>
          </Alert>
          <Button as={Link} to="/events" leftIcon={<FiArrowLeft />} colorScheme="blue">
            Retour aux événements
          </Button>
        </VStack>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxW="container.md" py={10}>
        <VStack spacing={4}>
          <Text fontSize="lg" color="gray.600">Événement non trouvé.</Text>
          <Button as={Link} to="/events" leftIcon={<FiArrowLeft />} colorScheme="blue">
            Retour aux événements
          </Button>
        </VStack>
      </Container>
    );
  }

  const eventInfo = getEventTypeInfo(event);
  
  console.log('🔍 Event extras:', event?.extras);
  console.log('🔍 Registration method:', eventInfo.registrationMethod);
  console.log('🔍 Registration type:', eventInfo.registrationType);

  // Interface Premium pour événements JEP/Statiques
  if (eventInfo.registrationType === 'jep_heritage') {
    console.log('🎨 Rendu interface premium - currentStep:', currentStep);
    console.log('📋 FormData actuel:', formData);
    
    // Récupérer l'URL de la bannière depuis extras
    const extras = event.extras ? JSON.parse(event.extras) : {};
    const bannerUrl = extras.bannerUrl || null;

    return (
      <div className="premium-registration-container">
        <div className="premium-registration-card">
          {/* En-tête avec Bannière ou Titre */}
          <div className="premium-event-header">
            {/* Bouton Annuler à droite */}
            <button 
              className="premium-cancel-button"
              onClick={() => window.location.href = '/evenements'}
            >
              ✕ Annuler l'inscription
            </button>

            <div className="premium-event-header-content">
              <div className="premium-event-info">
                {bannerUrl && (
                  <img 
                    src={bannerUrl} 
                    alt={event.title} 
                    className="premium-event-banner"
                  />
                )}
                
                <h1 className="premium-event-title">{event.title}</h1>
                
                <div className="premium-event-subtitle">
                  {event.date && (
                    <div className="premium-event-detail">
                      <FiCalendar size={18} />
                      <span>{formatDateFrLong(event.date)}</span>
                    </div>
                  )}
                  
                  {event.time && (
                    <div className="premium-event-detail">
                      <span>{event.time}</span>
                    </div>
                  )}
                  
                  {event.location && (
                    <div className="premium-event-detail">
                      <FiMapPin size={18} />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contenu Principal */}
          <div className="premium-main-content">
            {/* Barre de progression */}
            <div className="progress-stepper">
              <div className="progress-steps">
                <div className="progress-step">
                  <div className={`progress-step-label ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}>Informations</div>
                </div>
                
                <div className={`progress-arrow ${currentStep > 1 ? 'active' : ''}`}>&gt;&gt;</div>
                
                <div className="progress-step">
                  <div className={`progress-step-label ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}>Véhicules</div>
                </div>
                
                <div className={`progress-arrow ${currentStep > 2 ? 'active' : ''}`}>&gt;&gt;</div>
                
                <div className="progress-step">
                  <div className={`progress-step-label ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`}>Options</div>
                </div>
                
                <div className={`progress-arrow ${currentStep > 3 ? 'active' : ''}`}>&gt;&gt;</div>
                
                <div className="progress-step">
                  <div className={`progress-step-label ${currentStep === 4 ? 'active' : ''}`}>Confirmation</div>
                </div>
              </div>
            </div>

            {/* Contenu du formulaire */}
            <div className="premium-form-content">
              {/* Titre dynamique selon l'étape */}
              <p style={{ textAlign: 'center', fontSize: '22px', color: '#be003c', marginBottom: '2rem', fontWeight: 600 }}>
                {currentStep === 1 && "Nous, c'est RétroBus, et vous ?"}
                {currentStep === 2 && "Qu'allez-vous nous ramener de beau ?"}
                {currentStep === 3 && "Personnalisez votre expérience"}
                {currentStep === 4 && "Vérifiez vos informations"}
              </p>
              
              {/* ÉTAPE 1: Informations personnelles */}
              {currentStep === 1 && (
                <>
                  <div className="form-section">
                    <h2 className="form-section-title">Vos informations</h2>
                    
                    <div className="premium-input-row">
                      <div className="premium-input-group">
                        <label className="premium-label premium-label-required">NOM</label>
                        <input 
                          type="text" 
                          className="premium-input" 
                          placeholder="DUPONT" 
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                      </div>

                      <div className="premium-input-group">
                        <label className="premium-label premium-label-required">Prénom</label>
                        <input 
                          type="text" 
                          className="premium-input" 
                          placeholder="Jean" 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="premium-input-group">
                      <label className="premium-label premium-label-required">Email</label>
                      <input 
                        type="email" 
                        className="premium-input" 
                        placeholder="jean.dupont@example.com" 
                        value={formData.participantEmail}
                        onChange={(e) => setFormData({...formData, participantEmail: e.target.value})}
                      />
                    </div>

                    <div className="premium-input-group">
                      <label className="premium-label premium-label-required">Téléphone</label>
                      <input 
                        type="tel" 
                        className="premium-input" 
                        placeholder="+33 6 12 34 56 78" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>

                    <div className="premium-input-group">
                      <label className="premium-label">Club ou Association si représentée <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 400 }}>(facultatif)</span></label>
                      <input 
                        type="text" 
                        className="premium-input" 
                        placeholder="Nom du club ou de l'association" 
                        value={formData.club}
                        onChange={(e) => setFormData({...formData, club: e.target.value})}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ÉTAPE 2: Véhicules */}
              {currentStep === 2 && (
                <div className="form-section">
                  <h2 className="form-section-title">Quel type de plaque d'immatriculation ?</h2>
                  
                  {/* Sélecteur de type de plaque (inline) */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {/* Plaque Standard FIV */}
                    <div 
                      onClick={() => {
                        setFormData({...formData, plateType: 'standard', licensePlate: '', vehicleName: '', vehicleModel: '', vehicleYear: ''});
                        setVehicleSearchStatus('idle');
                      }}
                      style={{
                        border: formData.plateType === 'standard' ? '3px solid #be003c' : '2px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        cursor: 'pointer',
                        background: formData.plateType === 'standard' ? '#fff5f7' : 'white',
                        transition: 'all 0.2s',
                        boxShadow: formData.plateType === 'standard' ? '0 4px 12px rgba(190, 0, 60, 0.15)' : '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                    >
                      <div style={{ 
                        background: 'white', 
                        border: '2px solid #333', 
                        borderRadius: '4px', 
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '1rem',
                        fontFamily: 'monospace',
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}>
                        <div style={{ background: '#003399', color: 'white', padding: '4px 6px', borderRadius: '2px', fontSize: '14px' }}>
                          🇪🇺 F
                        </div>
                        <div>AR-920-BE</div>
                      </div>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '16px', color: '#111827' }}>🇫🇷 Plaque standard FIV</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Format actuel avec bande bleue (depuis 2009)</p>
                    </div>

                    {/* Ancien Format */}
                    <div 
                      onClick={() => {
                        setFormData({...formData, plateType: 'old', licensePlate: '', vehicleName: '', vehicleModel: '', vehicleYear: ''});
                        setVehicleSearchStatus('idle');
                      }}
                      style={{
                        border: formData.plateType === 'old' ? '3px solid #be003c' : '2px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        cursor: 'pointer',
                        background: formData.plateType === 'old' ? '#fff5f7' : 'white',
                        transition: 'all 0.2s',
                        boxShadow: formData.plateType === 'old' ? '0 4px 12px rgba(190, 0, 60, 0.15)' : '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                    >
                      <div style={{ 
                        background: 'white', 
                        border: '2px solid #333', 
                        borderRadius: '4px', 
                        padding: '8px 16px',
                        marginBottom: '1rem',
                        fontFamily: 'monospace',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        textAlign: 'center'
                      }}>
                        0920 RB 91
                      </div>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '16px', color: '#111827' }}>📅 Ancien format</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Format utilisé de 1950 à 2009</p>
                    </div>

                    {/* Plaque Collection */}
                    <div 
                      onClick={() => {
                        setFormData({...formData, plateType: 'collection', licensePlate: '', vehicleName: '', vehicleModel: '', vehicleYear: ''});
                        setVehicleSearchStatus('idle');
                      }}
                      style={{
                        border: formData.plateType === 'collection' ? '3px solid #be003c' : '2px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        cursor: 'pointer',
                        background: formData.plateType === 'collection' ? '#fff5f7' : 'white',
                        transition: 'all 0.2s',
                        boxShadow: formData.plateType === 'collection' ? '0 4px 12px rgba(190, 0, 60, 0.15)' : '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                    >
                      <div style={{ 
                        background: '#1a1a1a', 
                        border: '2px solid #333', 
                        borderRadius: '4px', 
                        padding: '8px 16px',
                        marginBottom: '1rem',
                        fontFamily: 'monospace',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#c0c0c0',
                        textAlign: 'center'
                      }}>
                        AR-920-BE
                      </div>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '16px', color: '#111827' }}>⚫ Plaque collection</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Fond noir, véhicules de collection</p>
                    </div>
                  </div>

                  {/* Saisie de l'immatriculation (apparaît après sélection du type) */}
                  {formData.plateType && (
                    <div style={{ marginBottom: '2rem' }}>
                      <label className="premium-label premium-label-required">
                        Saisissez votre immatriculation
                      </label>
                      <div style={{ position: 'relative', display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
                        <input 
                          type="text" 
                          className="premium-input" 
                          placeholder={
                            formData.plateType === 'standard' ? 'AR-920-BE' :
                            formData.plateType === 'old' ? '0920 RB 91' :
                            'AR-920-BE'
                          }
                          value={formData.licensePlate}
                          onChange={(e) => {
                            const formatted = formatLicensePlate(e.target.value, formData.plateType);
                            setFormData({...formData, licensePlate: formatted});
                            setVehicleSearchStatus('idle');
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              searchVehicleByPlate();
                            }
                          }}
                          maxLength={formData.plateType === 'old' ? 15 : 10}
                          style={{ 
                            fontSize: '18px', 
                            fontFamily: 'monospace', 
                            textAlign: 'center', 
                            fontWeight: 'bold',
                            flex: 1
                          }}
                        />
                        <button
                          type="button"
                          onClick={searchVehicleByPlate}
                          disabled={vehicleSearchStatus === 'searching'}
                          style={{
                            background: vehicleSearchStatus === 'searching' ? '#9ca3af' : '#be003c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0 1.5rem',
                            cursor: vehicleSearchStatus === 'searching' ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontSize: '15px',
                            fontWeight: 600,
                            transition: 'all 0.2s',
                            minWidth: '120px'
                          }}
                        >
                          {vehicleSearchStatus === 'searching' ? (
                            <>
                              <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                              Recherche...
                            </>
                          ) : (
                            <>
                              <FiSearch size={18} />
                              Rechercher
                            </>
                          )}
                        </button>
                      </div>
                      
                      {/* Indication du formatage automatique */}
                      {formData.plateType && (
                        <p style={{ 
                          marginTop: '0.5rem', 
                          fontSize: '13px', 
                          color: '#6b7280', 
                          textAlign: 'center',
                          fontStyle: 'italic'
                        }}>
                          {formData.plateType === 'standard' && '✨ Les tirets sont ajoutés automatiquement (format XX-XXX-XX)'}
                          {formData.plateType === 'old' && 'ℹ️ Format libre avec espaces (ex: 0920 RB 91)'}
                          {formData.plateType === 'collection' && '✨ Les tirets sont ajoutés automatiquement (format XX-XXX-XX)'}
                        </p>
                      )}
                      
                      {vehicleSearchStatus === 'not-found' && (
                        <div style={{
                          marginTop: '1rem',
                          padding: '1rem',
                          background: '#fef3c7',
                          border: '2px solid #f59e0b',
                          borderRadius: '8px',
                          display: 'flex',
                          gap: '0.75rem',
                          alignItems: 'flex-start'
                        }}>
                          <span style={{ fontSize: '24px' }}>😕</span>
                          <div>
                            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: '#92400e' }}>
                              Oups... votre plaque d'immatriculation n'a pas voulu coopérer...
                            </p>
                            <p style={{ margin: 0, fontSize: '14px', color: '#78350f' }}>
                              Pas de souci ! Saisissez les informations de votre véhicule manuellement ci-dessous.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Formulaire du véhicule (apparaît après recherche ou échec de recherche) */}
                  {formData.plateType && formData.licensePlate && (vehicleSearchStatus === 'found' || vehicleSearchStatus === 'not-found') && (
                    <>
                      <h2 className="form-section-title" style={{ marginTop: '2rem' }}>Informations du véhicule</h2>
                      
                      <div className="premium-input-row">
                        <div className="premium-input-group">
                          <label className="premium-label premium-label-required">Marque</label>
                          <input 
                            type="text" 
                            className="premium-input" 
                            placeholder="Citroën, Renault, Peugeot..." 
                            value={formData.vehicleName}
                            onChange={(e) => setFormData({...formData, vehicleName: e.target.value})}
                          />
                        </div>

                        <div className="premium-input-group">
                          <label className="premium-label premium-label-required">Modèle</label>
                          <input 
                            type="text" 
                            className="premium-input" 
                            placeholder="2CV, 4L, 203..." 
                            value={formData.vehicleModel}
                            onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="premium-input-group">
                        <label className="premium-label premium-label-required">Année</label>
                        <input 
                          type="text" 
                          className="premium-input" 
                          placeholder="1965" 
                          value={formData.vehicleYear}
                          onChange={(e) => setFormData({...formData, vehicleYear: e.target.value})}
                        />
                      </div>

                      {/* Récapitulatif de l'immatriculation saisie */}
                      <div style={{ 
                        marginTop: '1.5rem',
                        padding: '1rem',
                        background: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '13px', color: '#6b7280', fontWeight: 600 }}>
                          Immatriculation enregistrée :
                        </p>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginTop: '0.5rem'
                        }}>
                          <img
                            src={`${API_BASE_URL}/public/plaque/${formData.licensePlate.replace(/\s+/g, '-')}`}
                            alt={formData.licensePlate}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'inline-block';
                            }}
                            style={{
                              maxWidth: '100%',
                              height: 'auto',
                              maxHeight: '80px',
                              borderRadius: '4px',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                          />
                          <div style={{
                            display: 'none',
                            background: 'white',
                            border: '2px solid #333',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            fontFamily: 'monospace',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#111827'
                          }}>
                            🇪🇺 {formData.licensePlate}
                          </div>
                        </div>
                      </div>

                      {/* Bouton pour ajouter ce véhicule à la liste */}
                      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={handleAddAnotherVehicle}
                          style={{
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                          onMouseOver={(e) => e.target.style.background = '#059669'}
                          onMouseOut={(e) => e.target.style.background = '#10b981'}
                        >
                          ✅ Ajouter ce véhicule
                        </button>
                      </div>

                      {/* Liste des véhicules enregistrés */}
                      {registeredVehicles.length > 0 && (
                        <div style={{
                          marginTop: '2rem',
                          padding: '1rem',
                          background: '#f0fdf4',
                          borderRadius: '8px',
                          border: '1px solid #86efac'
                        }}>
                          <p style={{ 
                            margin: '0 0 1rem 0', 
                            fontSize: '14px', 
                            fontWeight: 600, 
                            color: '#15803d'
                          }}>
                            ✅ Véhicules enregistrés ({registeredVehicles.length})
                          </p>
                          {registeredVehicles.map((vehicle) => (
                            <div 
                              key={vehicle.id}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.75rem',
                                background: 'white',
                                borderRadius: '6px',
                                marginBottom: '0.5rem',
                                border: '1px solid #bbf7d0'
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, color: '#166534', fontSize: '14px' }}>
                                  {vehicle.vehicleName} {vehicle.vehicleModel} ({vehicle.vehicleYear})
                                </div>
                                <div style={{ fontSize: '12px', color: '#15803d', marginTop: '0.25rem' }}>
                                  {vehicle.licensePlate}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveVehicle(vehicle.id)}
                                style={{
                                  background: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  padding: '0.5rem 1rem',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  marginLeft: '1rem'
                                }}
                                onMouseOver={(e) => e.target.style.background = '#dc2626'}
                                onMouseOut={(e) => e.target.style.background = '#ef4444'}
                              >
                                🗑️ Retirer
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Bouton pour réinitialiser et ajouter un autre véhicule */}
                      {registeredVehicles.length > 0 && (
                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={handleResetForNewVehicle}
                            style={{
                              background: '#fecaca',
                              color: '#991b1b',
                              border: '2px solid #fca5a5',
                              padding: '0.75rem 1.5rem',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = '#f87171';
                              e.target.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = '#fecaca';
                              e.target.style.color = '#991b1b';
                            }}
                          >
                            🚗 Ajouter un autre véhicule
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ÉTAPE 3: Options */}
              {currentStep === 3 && (
                <div className="form-section">
                  <h2 className="form-section-title">Options supplémentaires</h2>
                  <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>
                    Contenu de l'étape 3 à venir...
                  </p>
                </div>
              )}

              {/* ÉTAPE 4: Confirmation */}
              {currentStep === 4 && (
                <div className="form-section">
                  <h2 className="form-section-title">Confirmation</h2>
                  <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>
                    Contenu de l'étape 4 à venir...
                  </p>
                </div>
              )}

              {/* Boutons de navigation */}
              <div className="premium-buttons">
              <button 
                type="button"
                className="premium-btn premium-btn-secondary" 
                onClick={handlePrev}
                disabled={currentStep === 1}
                style={{ opacity: currentStep === 1 ? 0.5 : 1, cursor: currentStep === 1 ? 'not-allowed' : 'pointer' }}
              >
                ← Retour
              </button>
              <button 
                type="button"
                className="premium-btn premium-btn-primary" 
                onClick={(e) => {
                  console.log('🖱️ Clic détecté sur le bouton Suivant', e);
                  handleNext();
                }}
              >
                Suivant →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }

  // Interface Standard pour les autres événements
  return (
  <Container maxW="container.md" py={10}>
    {/* Navigation */}
    <Button
      as={Link}
      to="/events"
      leftIcon={<FiArrowLeft />}
      mb={6}
      variant="outline"
      colorScheme="gray"
    >
      Retour aux événements
    </Button>

    {/* En-tête de l'événement */}
    <VStack spacing={6} textAlign="center" mb={8}>
      <Heading as="h1" size="xl" color="var(--rbe-red)">
        {event.title}
      </Heading>

      <HStack spacing={4} justify="center" flexWrap="wrap">
        <HStack>
          <Icon as={FiCalendar} color="var(--rbe-red)" />
          <Badge colorScheme="orange" fontSize="md" px={3} py={1}>
            {formatDateFrLong(event.date)}
          </Badge>
        </HStack>
        {event.time && (
          <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
            {event.time}
          </Badge>
        )}
      </HStack>

      {event.location && (
        <HStack>
          <Icon as={FiMapPin} color="var(--rbe-red)" />
          <Text fontSize="lg" color="gray.600">
            {event.location}
          </Text>
        </HStack>
      )}
    </VStack>

    {/* ÉTAPE: formulaire */}
    {registrationStep === 'form' && (
      <>
        {/* Description */}
        {event.description && (
          <Box mb={8} p={6} borderWidth="1px" borderRadius="lg" bg="gray.50">
            <Heading size="md" mb={4} color="var(--rbe-red)">
              📝 Description
            </Heading>
            <Text lineHeight="1.7" color="gray.700">
              {event.description}
            </Text>
          </Box>
        )}

        {/* Formulaire d'inscription */}
        <Box p={6} borderWidth="1px" borderRadius="lg" bg="white" mb={6}>
          <Heading size="md" mb={6} color="var(--rbe-red)">
            <Icon as={FiUsers} mr={2} />
            Inscription
          </Heading>

          <VStack spacing={6}>
            {/* Infos perso */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
              <FormControl isRequired>
                <FormLabel>
                  <Icon as={FiUser} mr={2} />
                  Nom complet
                </FormLabel>
                <Input
                  value={formData.participantName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, participantName: e.target.value }))
                  }
                  placeholder="Votre nom et prénom"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>
                  <Icon as={FiMail} mr={2} />
                  Email
                </FormLabel>
                <Input
                  type="email"
                  value={formData.participantEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, participantEmail: e.target.value }))
                  }
                  placeholder="votre@email.com"
                />
              </FormControl>
            </SimpleGrid>

            {/* Formulaire spécifique Défilé Anciennes */}
            {eventInfo.registrationType === 'parade_vehicles' && (
              <Box w="100%" p={4} borderWidth="1px" borderRadius="md" bg="blue.50">
                <Heading size="sm" mb={4}>🚗 Informations du Véhicule</Heading>
                <VStack spacing={4} align="start" w="100%">
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="100%">
                    <FormControl isRequired>
                      <FormLabel>Marque/Modèle</FormLabel>
                      <Input
                        value={formData.vehicleModel}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, vehicleModel: e.target.value }))
                        }
                        placeholder="Ex: Citroën 2CV, Renault Dauphine"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Année</FormLabel>
                      <Input
                        type="number"
                        value={formData.vehicleYear}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, vehicleYear: e.target.value }))
                        }
                        placeholder="Ex: 1985"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Immatriculation (optionnel)</FormLabel>
                      <Input
                        value={formData.vehicleName}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, vehicleName: e.target.value }))
                        }
                        placeholder="Ex: 75 AB 123"
                      />
                    </FormControl>
                  </SimpleGrid>

                  {/* Club membership */}
                  <FormControl>
                    <HStack spacing={3}>
                      <Checkbox
                        isChecked={formData.isClubMember}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, isClubMember: e.target.checked }))
                        }
                      />
                      <FormLabel mb={0}>Je suis membre d'un club</FormLabel>
                    </HStack>
                  </FormControl>

                  {formData.isClubMember && (
                    <FormControl w="100%">
                      <FormLabel>Nom du club</FormLabel>
                      <Input
                        value={formData.clubName}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, clubName: e.target.value }))
                        }
                        placeholder="Ex: Club des Véhicules Anciens de Seine-et-Marne"
                      />
                    </FormControl>
                  )}
                </VStack>
              </Box>
            )}

            {/* Questions customisées du formulaire */}
            {event && (() => {
              const extras = typeof event.extras === 'string' ? JSON.parse(event.extras) : event.extras;
              const templateCustomizations = extras?.templateCustomizations;
              const questions = templateCustomizations?.registrationQuestions || [];
              
              if (questions.length === 0) return null;
              
              return (
                <Box w="100%" p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
                  <Heading size="sm" mb={4}>📝 Questions additionnelles</Heading>
                  <VStack spacing={4} align="start" w="100%">
                    {questions.map((question, index) => (
                      <FormControl key={index} isRequired={question.required}>
                        <FormLabel>{question.text}</FormLabel>
                        {question.type === 'text' && (
                          <Input
                            value={formData.customAnswers[index] || ''}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                customAnswers: {
                                  ...prev.customAnswers,
                                  [index]: e.target.value
                                }
                              }))
                            }
                            placeholder={question.text}
                          />
                        )}
                        {question.type === 'textarea' && (
                          <Input
                            as="textarea"
                            value={formData.customAnswers[index] || ''}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                customAnswers: {
                                  ...prev.customAnswers,
                                  [index]: e.target.value
                                }
                              }))
                            }
                            placeholder={question.text}
                            rows={4}
                          />
                        )}
                        {question.type === 'select' && (
                          <select
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '4px',
                              border: '1px solid #ccc'
                            }}
                            value={formData.customAnswers[index] || ''}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                customAnswers: {
                                  ...prev.customAnswers,
                                  [index]: e.target.value
                                }
                              }))
                            }
                          >
                            <option value="">Sélectionner...</option>
                            {(question.options || []).map((opt, i) => (
                              <option key={i} value={opt}>{opt}</option>
                            ))}
                          </select>
                        )}
                        {question.type === 'checkbox' && (
                          <Checkbox
                            isChecked={formData.customAnswers[index] === true}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                customAnswers: {
                                  ...prev.customAnswers,
                                  [index]: e.target.checked
                                }
                              }))
                            }
                          >
                            {question.text}
                          </Checkbox>
                        )}
                      </FormControl>
                    ))}
                  </VStack>
                </Box>
              );
            })()}

            {/* Sélection des billets */}
            <Box w="100%">
              <Heading size="sm" mb={4}>🎫 Nombre de billets</Heading>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {(event.adultPrice !== null && event.adultPrice !== undefined) || eventInfo.isFree ? (
                  <FormControl>
                    <FormLabel>
                      Adultes{" "}
                      {eventInfo.isFree ? (
                        <Badge ml={2} colorScheme="green">Gratuit</Badge>
                      ) : (
                        <Badge ml={2} colorScheme="blue">{event.adultPrice}€</Badge>
                      )}
                    </FormLabel>
                    <NumberInput
                      value={formData.adultTickets}
                      onChange={(valStr) =>
                        setFormData((prev) => ({ ...prev, adultTickets: parseInt(valStr) || 0 }))
                      }
                      min={0}
                      max={10}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                ) : null}

                {(event.childPrice !== null && event.childPrice !== undefined) || eventInfo.isFree ? (
                  <FormControl>
                    <FormLabel>
                      Enfants (-12 ans){" "}
                      {eventInfo.isFree ? (
                        <Badge ml={2} colorScheme="green">Gratuit</Badge>
                      ) : (
                        <Badge ml={2} colorScheme="blue">{event.childPrice}€</Badge>
                      )}
                    </FormLabel>
                    <NumberInput
                      value={formData.childTickets}
                      onChange={(valStr) =>
                        setFormData((prev) => ({ ...prev, childTickets: parseInt(valStr) || 0 }))
                      }
                      min={0}
                      max={10}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                ) : null}
              </SimpleGrid>
            </Box>

            {/* Total */}
            <Box w="100%" p={4} bg="gray.50" borderRadius="md">
              <HStack justify="space-between">
                <Text fontWeight="bold">Total :</Text>
                <Text fontSize="xl" fontWeight="bold" color="var(--rbe-red)">
                  {eventInfo.isFree ? 'Gratuit' : `${calculateTotal()}€`}
                </Text>
              </HStack>
              <Text fontSize="sm" color="gray.600" mt={1}>
                {formData.adultTickets} adulte(s) + {formData.childTickets} enfant(s)
              </Text>
            </Box>

            {/* Bouton d'inscription */}
            <Button
              size="lg"
              colorScheme="red"
              bg="var(--rbe-red)"
              _hover={{ bg: "var(--rbe-accent)" }}
              onClick={() => {
                if (eventInfo.registrationMethod === 'helloasso') {
                  onHelloAssoOpen();
                } else {
                  handleSubmitRegistration();
                }
              }}
              isLoading={submitting}
              loadingText="Inscription en cours..."
              w="100%"
              leftIcon={eventInfo.registrationMethod === 'helloasso' ? <FiExternalLink /> : <FiUsers />}
            >
              {eventInfo.registrationMethod === 'helloasso'
                ? "S'inscrire via HelloAsso"
                : eventInfo.isFree
                  ? 'Confirmer ma participation'
                  : "S'inscrire et payer"}
            </Button>

            {eventInfo.registrationMethod === 'helloasso' && (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                  Cliquez sur le bouton ci-dessus pour accéder à la plateforme HelloAsso et finaliser votre inscription avec paiement sécurisé.
                </Text>
              </Alert>
            )}
          </VStack>
        </Box>
      </>
    )}

    {/* ÉTAPE: processing */}
    {registrationStep === 'processing' && (
      <VStack spacing={6} p={8} borderWidth="1px" borderRadius="lg" bg="blue.50">
        <Spinner size="xl" color="var(--rbe-red)" />
        <Heading size="lg" color="blue.700">
          {eventInfo.registrationMethod === 'helloasso'
            ? 'En attente du paiement HelloAsso...'
            : 'Traitement de votre inscription...'}
        </Heading>
        <Text textAlign="center" color="blue.600">
          {eventInfo.registrationMethod === 'helloasso'
            ? 'Finalisez votre paiement sur HelloAsso. Votre billet sera automatiquement généré et envoyé par email une fois le paiement validé.'
            : 'Nous générons votre billet électronique...'}
        </Text>
      </VStack>
    )}

    {/* ÉTAPE: success */}
    {registrationStep === 'success' && ticketData && (
      <VStack spacing={6} p={8} borderWidth="1px" borderRadius="lg" boxShadow="xl" bg="green.50">
        <Heading size="lg" color="green.700">✅ Inscription confirmée !</Heading>

        <Box p={4} bg="white" borderRadius="md" w="100%" border="1px solid" borderColor="green.200">
          <Text fontWeight="600" mb={2}>Détails de votre inscription</Text>
          <Text fontSize="sm">N° de réservation : {ticketData.id}</Text>
          <Text fontSize="sm">Événement : {event.title}</Text>
          <Text fontSize="sm">Date : {formatDateFrLong(event.date)} {event.time && `• ${event.time}`}</Text>
          <Text fontSize="sm">Lieu : {event.location}</Text>
          <Text fontSize="sm">Billets : {formData.adultTickets} adulte(s) + {formData.childTickets} enfant(s)</Text>
          {!eventInfo.isFree && (
            <Text fontSize="sm">Montant : {calculateTotal()}€</Text>
          )}
        </Box>

        <Divider />

        <Text fontWeight="600">🎫 Votre billet électronique</Text>
        {ticketData.qrCode && (
          <Image
            src={generateQRCodeUrl(ticketData.qrCode)}
            alt="QR Code de votre billet"
            boxSize="256px"
            border="2px solid"
            borderColor="var(--rbe-red)"
            borderRadius="md"
          />
        )}

        <Alert status="success" borderRadius="md">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold">📧 Billet envoyé par email</Text>
            <Text fontSize="sm">
              Un email de confirmation avec votre billet électronique a été envoyé à : {formData.participantEmail}
            </Text>
            <Text fontSize="xs" color="green.600" mt={2}>
              Présentez ce QR Code à l'entrée de l'événement.
            </Text>
          </VStack>
        </Alert>
      </VStack>
    )}

    {/* Modale HelloAsso */}
    <Modal isOpen={isHelloAssoOpen} onClose={onHelloAssoClose} size="2xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <VStack align="start" spacing={1}>
            <Heading size="md">{event?.title}</Heading>
            <Text fontSize="sm" color="gray.600">Inscription et paiement sécurisé via HelloAsso</Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack align="stretch" spacing={4}>
            <Box bg="gray.50" p={4} borderRadius="md">
              <VStack align="start" spacing={3}>
                <Heading size="sm" color="var(--rbe-red)">Récapitulatif</Heading>
                {event?.date && (
                  <HStack>
                    <Icon as={FiCalendar} color="var(--rbe-red)" />
                    <Text fontWeight="600">{formatDateFrLong(event.date)}</Text>
                  </HStack>
                )}
                {event?.location && (
                  <HStack>
                    <Icon as={FiMapPin} color="var(--rbe-red)" />
                    <Text>{event.location}</Text>
                  </HStack>
                )}
                <Divider my={2} />
                <HStack justify="space-between" w="100%">
                  <Text>Adultes: {formData.adultTickets}x</Text>
                  <Text fontWeight="bold">{formData.adultTickets * (event?.adultPrice || 0)}€</Text>
                </HStack>
                {formData.childTickets > 0 && (
                  <HStack justify="space-between" w="100%">
                    <Text>Enfants: {formData.childTickets}x</Text>
                    <Text fontWeight="bold">{formData.childTickets * (event?.childPrice || 0)}€</Text>
                  </HStack>
                )}
                <Divider my={2} />
                <HStack justify="space-between" w="100%" fontSize="lg">
                  <Text fontWeight="bold">Total</Text>
                  <Text fontWeight="bold" color="var(--rbe-red)">{calculateTotal()}€</Text>
                </HStack>
              </VStack>
            </Box>
            <Divider />
            <VStack align="start" spacing={3}>
              <Heading size="sm">Finaliser votre inscription</Heading>
              <Button
                onClick={() => {
                  // Créer l'inscription d'abord
                  handleSubmitRegistration();
                  // Le handleSubmitRegistration va rediriger vers HelloAsso
                  onHelloAssoClose();
                }}
                colorScheme="blue"
                size="lg"
                w="100%"
                leftIcon={<Icon as={FiExternalLink} />}
                isLoading={submitting}
                loadingText="Traitement..."
              >
                Procéder au paiement sur HelloAsso
              </Button>
            </VStack>
            <Box bg="blue.50" p={3} borderRadius="md" borderLeft="4px solid" borderLeftColor="blue.400">
              <Text fontSize="xs" color="blue.800">🔒 Paiement sécurisé par HelloAsso</Text>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onHelloAssoClose}>Fermer</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </Container>
);
}