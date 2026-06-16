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
import { FiArrowLeft, FiCalendar, FiMapPin, FiUsers, FiGift, FiExternalLink, FiMail, FiUser, FiSearch, FiCheckCircle } from "react-icons/fi";
import { formatDateFrLong } from "../utils/dateFormat.js";
import "../PremiumRegistration.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://attractive-kindness-rbe-serveurs.up.railway.app';

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
  
  // Restaurer l'état de l'inscription depuis sessionStorage si disponible
  const [registrationStep, setRegistrationStep] = useState(() => {
    const saved = sessionStorage.getItem('eventRegistration_step');
    return saved || 'form';
  });
  const [registrationId, setRegistrationId] = useState(() => {
    const saved = sessionStorage.getItem('eventRegistration_id');
    return saved || null;
  });
  const [ticketData, setTicketData] = useState(() => {
    const saved = sessionStorage.getItem('eventRegistration_ticketData');
    return saved ? JSON.parse(saved) : null;
  });

  // Debug logs
  console.log('🔍 EventRegistration mounted');
  console.log('  - eventId:', eventId);
  console.log('  - eventSlug:', eventSlug);
  console.log('  - extractedSlug:', extractedSlug);
  console.log('  - location.pathname:', location.pathname);
  console.log('  - location.state:', location.state);
  console.log('  🔄 État restauré depuis sessionStorage:');
  console.log('    - registrationStep:', registrationStep);
  console.log('    - registrationId:', registrationId);
  console.log('    - ticketData:', ticketData);
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    clubName: '',
    isClubMember: false,
    wantsGroupedPlacement: false,
    placementGroupName: '',
    spaceRequirement: '',
    arrivalWindow: '',
    wantsPublicDisplay: false,
    vehicleStory: '',
    photoPermission: false,
    organizerMessage: '',
    // Réponses aux questions customisées
    customAnswers: {}
  });
  
  // Système de véhicules multiples
  const [vehicles, setVehicles] = useState([{
    id: Date.now(),
    plateType: '',
    licensePlate: '',
    vehicleName: '',
    vehicleModel: '',
    vehicleYear: '',
    searchStatus: 'idle'
  }]);
  
  const [submitting, setSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState(null);
  const [helloAssoUrl, setHelloAssoUrl] = useState(null);
  const { isOpen: isHelloAssoOpen, onOpen: onHelloAssoOpen, onClose: onHelloAssoClose } = useDisclosure();
  const [isPlateModalOpen, setIsPlateModalOpen] = useState(false);
  const toast = useToast();

  // Helper pour nettoyer la session d'inscription
  const clearRegistrationSession = () => {
    console.log('🧹 Nettoyage de la session d\'inscription');
    sessionStorage.removeItem('eventRegistration_step');
    sessionStorage.removeItem('eventRegistration_id');
    sessionStorage.removeItem('eventRegistration_ticketData');
  };

  // ➕ Ajouter un nouveau véhicule (EN HAUT de la liste)
  const handleAddVehicle = () => {
    const newVehicle = {
      id: Date.now(),
      plateType: '',
      licensePlate: '',
      vehicleName: '',
      vehicleModel: '',
      vehicleYear: '',
      searchStatus: 'idle'
    };

    setVehicles(prev => [...prev, newVehicle]); // Ajout en dessous du précédent

    toast({
      status: "success",
      title: "Nouveau véhicule",
      description: "Formulaire ajouté !",
      duration: 2000
    });
  };

  // ✏️ Mettre à jour un champ d'un véhicule spécifique
  const updateVehicle = (id, field, value) => {
    setVehicles(prev =>
      prev.map(v =>
        v.id === id ? { ...v, [field]: value } : v
      )
    );
  };

  // 🗑️ Supprimer un véhicule
  const removeVehicle = (id) => {
    if (vehicles.length === 1) {
      toast({
        status: "warning",
        title: "Action impossible",
        description: "Vous devez avoir au moins un véhicule.",
        duration: 2000
      });
      return;
    }
    
    setVehicles(prev => prev.filter(v => v.id !== id));
    
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

  // Persister registrationStep dans sessionStorage
  useEffect(() => {
    if (registrationStep !== 'form') {
      sessionStorage.setItem('eventRegistration_step', registrationStep);
      console.log(`💾 Sauvegarde registrationStep: ${registrationStep}`);
    }
  }, [registrationStep]);

  // Persister registrationId dans sessionStorage
  useEffect(() => {
    if (registrationId) {
      sessionStorage.setItem('eventRegistration_id', registrationId);
      console.log(`💾 Sauvegarde registrationId: ${registrationId}`);
    }
  }, [registrationId]);

  // Persister ticketData dans sessionStorage
  useEffect(() => {
    if (ticketData) {
      sessionStorage.setItem('eventRegistration_ticketData', JSON.stringify(ticketData));
      console.log(`💾 Sauvegarde ticketData:`, ticketData);
    }
  }, [ticketData]);

  // Récupération du token CSRF au chargement
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/csrf-token`);
        if (response.ok) {
          const data = await response.json();
          setCsrfToken(data.csrfToken);
          console.log('🔐 CSRF token récupéré');
        } else {
          console.error('❌ Impossible de récupérer le token CSRF');
        }
      } catch (error) {
        console.error('❌ Erreur lors de la récupération du token CSRF:', error);
      }
    };
    
    fetchCSRFToken();
  }, []);

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
  const searchVehicleByPlate = async (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    
    if (!vehicle || !vehicle.licensePlate || !vehicle.plateType) {
      toast({
        status: 'warning',
        title: 'Veuillez saisir une immatriculation',
        duration: 3000
      });
      return;
    }

    updateVehicle(vehicleId, 'searchStatus', 'searching');
    console.log('🔍 Recherche du véhicule:', vehicle.licensePlate);

    try {
      // Appel à l'API backend
      const response = await fetch(`${API_BASE_URL}/public/vehicles/search?plate=${encodeURIComponent(vehicle.licensePlate)}`);
      const result = await response.json();

      if (response.ok && result.success && result.data) {
        const vehicleData = result.data;
        console.log('✅ Véhicule trouvé:', vehicleData);
        
        // Mettre à jour tous les champs du véhicule
        setVehicles(prev =>
          prev.map(v =>
            v.id === vehicleId ? {
              ...v,
              vehicleName: vehicleData.make || vehicleData.vehicleName || '',
              vehicleModel: vehicleData.model || vehicleData.vehicleModel || '',
              vehicleYear: vehicleData.year?.toString() || vehicleData.vehicleYear?.toString() || '',
              searchStatus: 'found'
            } : v
          )
        );
        
        toast({
          status: 'success',
          title: 'Véhicule trouvé !',
          description: `${vehicleData.make || vehicleData.vehicleName} ${vehicleData.model || vehicleData.vehicleModel} (${vehicleData.year || vehicleData.vehicleYear})`,
          duration: 4000
        });
      } else {
        console.log('❌ Véhicule non trouvé');
        updateVehicle(vehicleId, 'searchStatus', 'not-found');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la recherche:', error);
      updateVehicle(vehicleId, 'searchStatus', 'not-found');
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
    
    // Validation du STEP 2 (véhicules)
    if (currentStep === 2) {
      // Vérifier qu'au moins un véhicule est complet
      const completeVehicles = vehicles.filter(v => 
        v.plateType && 
        v.licensePlate && 
        v.vehicleName && 
        v.vehicleModel && 
        v.vehicleYear
      );
      
      if (completeVehicles.length === 0) {
        toast({
          status: 'warning',
          title: 'Véhicule incomplet',
          description: 'Veuillez remplir au moins un véhicule complètement.',
          duration: 3000
        });
        console.log('❌ Validation STEP 2 échouée - Aucun véhicule complet');
        return;
      }
      
      console.log(`✅ Validation STEP 2 réussie - ${completeVehicles.length} véhicule(s) complet(s)`);
    }

    if (currentStep === 3) {
      if (formData.wantsGroupedPlacement && !formData.placementGroupName?.trim()) {
        toast({
          status: 'warning',
          title: 'Nom du groupe requis',
          description: 'Indiquez le nom du club, groupe ou amis à rejoindre.',
          duration: 3000
        });
        console.log('❌ Validation STEP 3 échouée - placement groupé sans nom');
        return;
      }

      console.log('✅ Validation STEP 3 réussie');
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

  /**
   * Enrichir l'URL HelloAsso avec les données du formulaire pour pré-remplir les champs
   * @param {string} baseUrl - URL HelloAsso de base
   * @param {object} data - Données du formulaire { firstName, lastName, email, amount, quantity }
   * @returns {string} - URL enrichie avec les paramètres
   */
  const enrichHelloAssoUrl = (baseUrl, data) => {
    try {
      const url = new URL(baseUrl);
      
      // Ajouter les paramètres HelloAsso (noms standards supportés par l'API HelloAsso)
      if (data.firstName) url.searchParams.set('firstName', data.firstName);
      if (data.lastName) url.searchParams.set('lastName', data.lastName);
      if (data.email) url.searchParams.set('email', data.email);
      if (data.amount) url.searchParams.set('amount', data.amount);
      
      // Informations supplémentaires pour le tracking
      if (data.quantity) url.searchParams.set('quantity', data.quantity);
      
      console.log('✨ URL HelloAsso enrichie avec:', {
        prénom: data.firstName,
        nom: data.lastName,
        email: data.email,
        montant: data.amount,
        billets: data.quantity
      });
      
      return url.toString();
    } catch (error) {
      console.error('❌ Erreur enrichissement URL HelloAsso:', error);
      // Retourner l'URL de base en cas d'erreur
      return baseUrl;
    }
  };

  const handleSubmitRegistration = async () => {
    console.log('🎯 handleSubmitRegistration appelé');
    console.log('📋 formData:', formData);
    console.log('🚗 vehicles:', vehicles);
    
    const resolvedParticipantName = (
      formData.participantName?.trim() ||
      `${formData.firstName || ''} ${formData.lastName || ''}`.trim()
    );

    if (!resolvedParticipantName || !formData.participantEmail.trim()) {
      console.warn('⚠️ Validation échouée : nom ou email manquant');
      toast({
        status: "error",
        title: "Champs obligatoires",
        description: "Veuillez remplir votre nom et email."
      });
      return;
    }

    if (formData.adultTickets + formData.childTickets === 0) {
      console.warn('⚠️ Validation échouée : aucun billet sélectionné');
      toast({
        status: "error",
        title: "Nombre de billets",
        description: "Veuillez sélectionner au moins un billet."
      });
      return;
    }

    console.log('✅ Validations de base passées');
    
    try {
      setSubmitting(true);
      console.log('🔄 setSubmitting(true) - Début de la soumission');
      const eventInfo = getEventTypeInfo(event);

      const normalizedVehicles = vehicles
        .filter(v => v.licensePlate && v.vehicleName && v.vehicleModel && v.vehicleYear)
        .map(v => ({
          plateType: v.plateType || 'standard',
          licensePlate: v.licensePlate,
          vehicleName: v.vehicleName,
          vehicleModel: v.vehicleModel,
          vehicleYear: v.vehicleYear
        }));

      const fallbackVehicle = (
        formData.vehicleName &&
        formData.vehicleModel &&
        formData.vehicleYear
      ) ? {
        plateType: 'standard',
        licensePlate: formData.vehicleName,
        vehicleName: formData.vehicleName,
        vehicleModel: formData.vehicleModel,
        vehicleYear: formData.vehicleYear
      } : null;

      const effectiveVehicles = normalizedVehicles.length > 0
        ? normalizedVehicles
        : (fallbackVehicle ? [fallbackVehicle] : []);
      
      // Validation des champs requis pour défilé de véhicules anciens
      if (eventInfo.registrationType === 'parade_vehicles') {
        if (effectiveVehicles.length === 0) {
          toast({
            status: "error",
            title: "Véhicule incomplet",
            description: "Veuillez remplir au moins un véhicule complètement."
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
        participantName: resolvedParticipantName,
        participantEmail: formData.participantEmail,
        adultTickets: formData.adultTickets,
        childTickets: formData.childTickets,
        paymentMethod: eventInfo.isFree ? 'free' : 
                      (eventInfo.registrationMethod === 'helloasso' ? 'helloasso' : 'internal'),
        customAnswers: {
          ...formData.customAnswers,
          staticGathering: {
            wantsGroupedPlacement: formData.wantsGroupedPlacement,
            placementGroupName: formData.placementGroupName,
            spaceRequirement: formData.spaceRequirement,
            arrivalWindow: formData.arrivalWindow,
            wantsPublicDisplay: formData.wantsPublicDisplay,
            vehicleStory: formData.vehicleStory,
            photoPermission: formData.photoPermission,
            organizerMessage: formData.organizerMessage
          }
        },
        // Ajouter les véhicules s'ils existent (peu importe le type d'événement)
        ...(effectiveVehicles.length > 0 && {
          vehicles: effectiveVehicles,
          isClubMember: formData.isClubMember,
          clubName: formData.clubName || null
        })
      };

      console.log('🚗 Type événement:', eventInfo.registrationType);
      console.log('🚗 Véhicules avant filtre:', vehicles);
      console.log('🚗 Véhicules après filtre:', registrationData.vehicles);

      // Vérifier que le token CSRF est disponible, sinon tenter de le récupérer
      let tokenToUse = csrfToken;
      if (!tokenToUse) {
        console.warn('⚠️ Token CSRF manquant, tentative de récupération...');
        try {
          const tokenResponse = await fetch(`${API_BASE_URL}/api/csrf-token`);
          if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json();
            tokenToUse = tokenData.csrfToken;
            setCsrfToken(tokenToUse);
            console.log('✅ Token CSRF récupéré avec succès');
          }
        } catch (error) {
          console.error('❌ Impossible de récupérer le token CSRF:', error);
        }
      }

      if (!tokenToUse) {
        console.error('❌ Token CSRF toujours manquant après tentative de récupération');
        toast({
          status: "error",
          title: "Serveur inaccessible",
          description: "Le serveur backend n'est pas démarré. Veuillez démarrer le serveur API (npm run dev dans interne/api)."
        });
        setSubmitting(false);
        return;
      }

      console.log('📝 Submitting registration:', registrationData);

      let response = await fetch(`${API_BASE_URL}/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': tokenToUse
        },
        body: JSON.stringify(registrationData)
      });

      // Si erreur CSRF 403, récupérer un nouveau token et réessayer UNE FOIS
      if (response.status === 403) {
        try {
          const errorData = await response.json();
          if (errorData.code === 'CSRF_INVALID' || errorData.code === 'CSRF_MISSING') {
            console.warn('⚠️ CSRF invalide, récupération d\'un nouveau token et retry...');
            
            const tokenResponse = await fetch(`${API_BASE_URL}/api/csrf-token`);
            if (tokenResponse.ok) {
              const tokenData = await tokenResponse.json();
              tokenToUse = tokenData.csrfToken;
              setCsrfToken(tokenToUse);
              console.log('✅ Nouveau token CSRF récupéré, retry de la requête...');
              
              // Retry avec le nouveau token
              response = await fetch(`${API_BASE_URL}/registrations`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-Token': tokenToUse
                },
                body: JSON.stringify(registrationData)
              });
            }
          }
        } catch (parseError) {
          console.error('❌ Erreur lors du parsing de la réponse 403:', parseError);
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur lors de l'inscription (${response.status})`);
      }

      const result = await response.json();
      console.log('✅ Registration created:', result);
      console.log('📝 registrationId:', result.registrationId);

      setRegistrationId(result.registrationId);

      // Si HelloAsso, afficher l'iframe de paiement
      if (result.helloAssoUrl && registrationData.paymentMethod === 'helloasso') {
        console.log('💳 Affichage iframe HelloAsso:', result.helloAssoUrl);
        
        // Enrichir l'URL HelloAsso avec les données du formulaire
        const enrichedUrl = enrichHelloAssoUrl(result.helloAssoUrl, {
          firstName: formData.firstName || resolvedParticipantName.split(' ')[0] || '',
          lastName: formData.lastName || resolvedParticipantName.split(' ').slice(1).join(' ') || '',
          email: formData.participantEmail,
          amount: calculateTotal(),
          quantity: formData.adultTickets + formData.childTickets
        });
        
        console.log('🎯 URL enrichie HelloAsso:', enrichedUrl);
        console.log('🎯 setRegistrationStep("payment") - HelloAsso');
        setHelloAssoUrl(enrichedUrl);
        setRegistrationStep('payment');
        
        toast({
          status: "info",
          title: "Paiement sécurisé",
          description: "Finalisez votre paiement via HelloAsso ci-dessous.",
          duration: 3000
        });
        
      } else {
        // Inscription gratuite ou interne - passage direct au succès
        console.log('🎯 setRegistrationStep("processing") - Gratuit/Interne');
        setRegistrationStep('processing');
        
        console.log('⏳ Attente 2 secondes avant affichage succès...');
        // Simuler un court délai pour la génération du billet
        setTimeout(() => {
          console.log('🎯 setTicketData + setRegistrationStep("success")');
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
          console.log('✨ Page de succès devrait maintenant s\'afficher');
        }, 2000);
      }

    } catch (e) {
      console.error('❌ Registration error:', e);
      console.error('❌ Stack trace:', e.stack);
      toast({
        status: "error",
        title: "Erreur d'inscription",
        description: e.message || 'Une erreur est survenue lors de l\'inscription'
      });
    } finally {
      console.log('🔄 setSubmitting(false) - Fin de la soumission');
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
          <Button 
            onClick={() => {
              clearRegistrationSession();
              window.location.href = '/events';
            }} 
            leftIcon={<FiArrowLeft />} 
            colorScheme="blue"
          >
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
          <Button as={Link} to="/evenements" leftIcon={<FiArrowLeft />} colorScheme="blue">
            Retour aux événements
          </Button>
        </VStack>
      </Container>
    );
  }

  const eventInfo = getEventTypeInfo(event);
  const confirmedVehicles = vehicles.filter((vehicle) =>
    vehicle.plateType &&
    vehicle.licensePlate &&
    vehicle.vehicleName &&
    vehicle.vehicleModel &&
    vehicle.vehicleYear
  );
  const resolvedParticipantName = (
    formData.participantName?.trim() ||
    `${formData.firstName || ''} ${formData.lastName || ''}`.trim()
  );
  
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
              onClick={() => {
                clearRegistrationSession();
                window.location.href = '/evenements';
              }}
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
                {currentStep === 3 && "Préparez votre accueil sur le rassemblement"}
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
                  <h2 className="form-section-title">Vos véhicules</h2>
                  <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>
                    Ajoutez tous les véhicules que vous souhaitez inscrire à l'événement
                  </p>

                  {/* Liste des formulaires de véhicules */}
                  {vehicles.map((vehicle, index) => (
                    <div 
                      key={vehicle.id}
                      style={{
                        marginBottom: '2rem',
                        padding: '2rem',
                        background: '#f9fafb',
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb',
                        position: 'relative'
                      }}
                    >
                      {/* Numéro du véhicule */}
                      <div style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '20px',
                        background: '#be003c',
                        color: 'white',
                        padding: '6px 16px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 700,
                        boxShadow: '0 2px 8px rgba(190, 0, 60, 0.3)'
                      }}>
                        🚗 Véhicule #{vehicles.length - index}
                      </div>

                      {/* Bouton supprimer (seulement si plus d'un véhicule) */}
                      {vehicles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVehicle(vehicle.id)}
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.background = '#dc2626'}
                          onMouseOut={(e) => e.target.style.background = '#ef4444'}
                        >
                          🗑️ Retirer
                        </button>
                      )}

                      {/* Sélecteur de type de plaque */}
                      <div style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
                        <label className="premium-label premium-label-required">
                          Type de plaque d'immatriculation
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '0.75rem' }}>
                          {/* Plaque Standard */}
                          <div 
                            onClick={() => updateVehicle(vehicle.id, 'plateType', 'standard')}
                            style={{
                              border: vehicle.plateType === 'standard' ? '3px solid #be003c' : '2px solid #e5e7eb',
                              borderRadius: '8px',
                              padding: '1rem',
                              cursor: 'pointer',
                              background: vehicle.plateType === 'standard' ? '#fff5f7' : 'white',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ 
                              background: 'white', 
                              border: '2px solid #333', 
                              borderRadius: '4px', 
                              padding: '4px 8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              marginBottom: '0.5rem',
                              fontFamily: 'monospace',
                              fontSize: '14px',
                              fontWeight: 'bold'
                            }}>
                              <div style={{ background: '#003399', color: 'white', padding: '2px 4px', borderRadius: '2px', fontSize: '11px' }}>
                                🇪🇺 F
                              </div>
                              <div>AR-920-BE</div>
                            </div>
                            <p style={{ margin: 0, fontSize: '12px', fontWeight: 600 }}>🇫🇷 Standard FIV</p>
                          </div>

                          {/* Ancien Format */}
                          <div 
                            onClick={() => updateVehicle(vehicle.id, 'plateType', 'old')}
                            style={{
                              border: vehicle.plateType === 'old' ? '3px solid #be003c' : '2px solid #e5e7eb',
                              borderRadius: '8px',
                              padding: '1rem',
                              cursor: 'pointer',
                              background: vehicle.plateType === 'old' ? '#fff5f7' : 'white',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ 
                              background: 'white', 
                              border: '2px solid #333', 
                              borderRadius: '4px', 
                              padding: '4px 8px',
                              marginBottom: '0.5rem',
                              fontFamily: 'monospace',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              textAlign: 'center'
                            }}>
                              0920 RB 91
                            </div>
                            <p style={{ margin: 0, fontSize: '12px', fontWeight: 600 }}>📅 Ancien format</p>
                          </div>

                          {/* Plaque Collection */}
                          <div 
                            onClick={() => updateVehicle(vehicle.id, 'plateType', 'collection')}
                            style={{
                              border: vehicle.plateType === 'collection' ? '3px solid #be003c' : '2px solid #e5e7eb',
                              borderRadius: '8px',
                              padding: '1rem',
                              cursor: 'pointer',
                              background: vehicle.plateType === 'collection' ? '#fff5f7' : 'white',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ 
                              background: '#1a1a1a', 
                              border: '2px solid #333', 
                              borderRadius: '4px', 
                              padding: '4px 8px',
                              marginBottom: '0.5rem',
                              fontFamily: 'monospace',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              color: '#c0c0c0',
                              textAlign: 'center'
                            }}>
                              AR-920-BE
                            </div>
                            <p style={{ margin: 0, fontSize: '12px', fontWeight: 600 }}>⚫ Collection</p>
                          </div>
                        </div>
                      </div>

                      {/* Saisie de l'immatriculation */}
                      {vehicle.plateType && (
                        <>
                          <div style={{ marginBottom: '1.5rem' }}>
                            <label className="premium-label premium-label-required">
                              Immatriculation
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch', marginTop: '0.5rem' }}>
                              <input 
                                type="text" 
                                className="premium-input" 
                                placeholder={
                                  vehicle.plateType === 'standard' ? 'AR-920-BE' :
                                  vehicle.plateType === 'old' ? '0920 RB 91' :
                                  'AR-920-BE'
                                }
                                value={vehicle.licensePlate}
                                onChange={(e) => {
                                  const formatted = formatLicensePlate(e.target.value, vehicle.plateType);
                                  updateVehicle(vehicle.id, 'licensePlate', formatted);
                                  updateVehicle(vehicle.id, 'searchStatus', 'idle');
                                }}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    searchVehicleByPlate(vehicle.id);
                                  }
                                }}
                                maxLength={vehicle.plateType === 'old' ? 15 : 10}
                                style={{ 
                                  fontSize: '16px', 
                                  fontFamily: 'monospace', 
                                  textAlign: 'center', 
                                  fontWeight: 'bold',
                                  flex: 1
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => searchVehicleByPlate(vehicle.id)}
                                disabled={vehicle.searchStatus === 'searching'}
                                style={{
                                  background: vehicle.searchStatus === 'searching' ? '#9ca3af' : '#be003c',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '8px',
                                  padding: '0 1.5rem',
                                  cursor: vehicle.searchStatus === 'searching' ? 'not-allowed' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.5rem',
                                  fontSize: '14px',
                                  fontWeight: 600,
                                  transition: 'all 0.2s',
                                  minWidth: '120px'
                                }}
                              >
                                {vehicle.searchStatus === 'searching' ? (
                                  <>
                                    <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                                    Recherche...
                                  </>
                                ) : (
                                  <>
                                    <FiSearch size={16} />
                                    Rechercher
                                  </>
                                )}
                              </button>
                            </div>
                            
                            {vehicle.plateType && (
                              <p style={{ 
                                marginTop: '0.5rem', 
                                fontSize: '12px', 
                                color: '#6b7280', 
                                textAlign: 'center',
                                fontStyle: 'italic'
                              }}>
                                {vehicle.plateType === 'standard' && '✨ Les tirets sont ajoutés automatiquement'}
                                {vehicle.plateType === 'old' && 'ℹ️ Format libre avec espaces'}
                                {vehicle.plateType === 'collection' && '✨ Les tirets sont ajoutés automatiquement'}
                              </p>
                            )}
                            
                            {vehicle.searchStatus === 'not-found' && (
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
                                <span style={{ fontSize: '20px' }}>😕</span>
                                <div>
                                  <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600, color: '#92400e', fontSize: '14px' }}>
                                    Plaque non trouvée
                                  </p>
                                  <p style={{ margin: 0, fontSize: '13px', color: '#78350f' }}>
                                    Remplissez les informations manuellement ci-dessous.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Formulaire du véhicule (apparaît après recherche) */}
                          {vehicle.licensePlate && (vehicle.searchStatus === 'found' || vehicle.searchStatus === 'not-found') && (
                            <>
                              <div className="premium-input-row">
                                <div className="premium-input-group">
                                  <label className="premium-label premium-label-required">Marque</label>
                                  <input 
                                    type="text" 
                                    className="premium-input" 
                                    placeholder="Citroën, Renault..." 
                                    value={vehicle.vehicleName}
                                    onChange={(e) => updateVehicle(vehicle.id, 'vehicleName', e.target.value)}
                                  />
                                </div>

                                <div className="premium-input-group">
                                  <label className="premium-label premium-label-required">Modèle</label>
                                  <input 
                                    type="text" 
                                    className="premium-input" 
                                    placeholder="2CV, 4L, 203..." 
                                    value={vehicle.vehicleModel}
                                    onChange={(e) => updateVehicle(vehicle.id, 'vehicleModel', e.target.value)}
                                  />
                                </div>
                              </div>

                              <div className="premium-input-group">
                                <label className="premium-label premium-label-required">Année</label>
                                <input 
                                  type="text" 
                                  className="premium-input" 
                                  placeholder="1965" 
                                  value={vehicle.vehicleYear}
                                  onChange={(e) => updateVehicle(vehicle.id, 'vehicleYear', e.target.value)}
                                />
                              </div>

                              {/* Aperçu de la plaque */}
                              <div style={{ 
                                marginTop: '1.5rem',
                                padding: '1rem',
                                background: 'white',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb'
                              }}>
                                <p style={{ margin: '0 0 0.75rem 0', fontSize: '13px', color: '#6b7280', fontWeight: 600, textAlign: 'center' }}>
                                  Aperçu de la plaque :
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                  <img
                                    src={`${API_BASE_URL}/public/plaque/${vehicle.licensePlate.replace(/\s+/g, '-')}`}
                                    alt={vehicle.licensePlate}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'inline-block';
                                    }}
                                    style={{
                                      maxWidth: '100%',
                                      height: 'auto',
                                      maxHeight: '70px',
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
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    color: '#111827'
                                  }}>
                                    🇪🇺 {vehicle.licensePlate}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  ))}

                  {/* Bouton d'ajout de véhicule */}
                  <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button
                      type="button"
                      onClick={handleAddVehicle}
                      style={{
                        background: '#be003c',
                        color: 'white',
                        border: 'none',
                        padding: '1rem 2rem',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#9a0030';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = '#be003c';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                      }}
                    >
                      ➕ Ajouter un véhicule
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 3: Options */}
              {currentStep === 3 && (
                <div className="form-section">
                  <h2 className="form-section-title">Accueil et exposition</h2>
                  <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>
                    Aidez-nous a preparer votre emplacement pour ce rassemblement statique.
                  </p>

                  <div style={{
                    background: '#fff7ed',
                    border: '1px solid #fdba74',
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                    marginBottom: '1.5rem'
                  }}>
                    <p style={{ margin: 0, color: '#9a3412', fontSize: '14px', lineHeight: 1.5 }}>
                      Cette etape nous aide a organiser l'accueil sur site, le placement des vehicules et la communication autour de l'exposition.
                    </p>
                  </div>

                  <div style={{
                    marginBottom: '1.5rem',
                    padding: '1.25rem',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '18px', color: '#111827' }}>Placement</h3>

                    <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer', marginBottom: '1rem' }}>
                      <input
                        type="checkbox"
                        checked={formData.wantsGroupedPlacement}
                        onChange={(e) => setFormData((prev) => ({
                          ...prev,
                          wantsGroupedPlacement: e.target.checked,
                          placementGroupName: e.target.checked ? prev.placementGroupName : ''
                        }))}
                        style={{ marginTop: '0.2rem' }}
                      />
                      <span style={{ color: '#374151' }}>
                        Je souhaite etre place avec un club, un groupe ou des amis.
                      </span>
                    </label>

                    {formData.wantsGroupedPlacement && (
                      <div className="premium-input-group" style={{ marginBottom: '1rem' }}>
                        <label className="premium-label premium-label-required">Nom du club, groupe ou reference</label>
                        <input
                          type="text"
                          className="premium-input"
                          placeholder="Club RetroEssonne, amis, famille..."
                          value={formData.placementGroupName}
                          onChange={(e) => setFormData((prev) => ({ ...prev, placementGroupName: e.target.value }))}
                        />
                      </div>
                    )}

                    <div className="premium-input-group">
                      <label className="premium-label">Besoin d'emplacement particulier</label>
                      <select
                        className="premium-input"
                        value={formData.spaceRequirement}
                        onChange={(e) => setFormData((prev) => ({ ...prev, spaceRequirement: e.target.value }))}
                      >
                        <option value="">Aucun besoin particulier</option>
                        <option value="grand-gabarit">Vehicule grand gabarit</option>
                        <option value="avec-remorque">Vehicule avec remorque</option>
                        <option value="vehicule-bas">Vehicule tres bas</option>
                        <option value="acces-facile">Besoin d'un acces facile</option>
                      </select>
                    </div>
                  </div>

                  <div style={{
                    marginBottom: '1.5rem',
                    padding: '1.25rem',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '18px', color: '#111827' }}>Arrivee sur site</h3>
                    <div className="premium-input-group">
                      <label className="premium-label">Heure d'arrivee estimee</label>
                      <select
                        className="premium-input"
                        value={formData.arrivalWindow}
                        onChange={(e) => setFormData((prev) => ({ ...prev, arrivalWindow: e.target.value }))}
                      >
                        <option value="">Je ne sais pas encore</option>
                        <option value="before-9">Avant 9h</option>
                        <option value="9-10">Entre 9h et 10h</option>
                        <option value="10-11">Entre 10h et 11h</option>
                        <option value="after-11">Apres 11h</option>
                      </select>
                    </div>
                  </div>

                  <div style={{
                    marginBottom: '1.5rem',
                    padding: '1.25rem',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '18px', color: '#111827' }}>Exposition</h3>

                    <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer', marginBottom: '1rem' }}>
                      <input
                        type="checkbox"
                        checked={formData.wantsPublicDisplay}
                        onChange={(e) => setFormData((prev) => ({
                          ...prev,
                          wantsPublicDisplay: e.target.checked,
                          vehicleStory: e.target.checked ? prev.vehicleStory : ''
                        }))}
                        style={{ marginTop: '0.2rem' }}
                      />
                      <span style={{ color: '#374151' }}>
                        Je souhaite exposer mon vehicule au public.
                      </span>
                    </label>

                    {formData.wantsPublicDisplay && (
                      <div className="premium-input-group">
                        <label className="premium-label">Particularite ou histoire du vehicule</label>
                        <textarea
                          className="premium-input"
                          placeholder="Un detail marquant, une restauration, une histoire a raconter..."
                          value={formData.vehicleStory}
                          onChange={(e) => setFormData((prev) => ({ ...prev, vehicleStory: e.target.value }))}
                          rows={4}
                          style={{ resize: 'vertical', minHeight: '110px' }}
                        />
                      </div>
                    )}
                  </div>

                  <div style={{
                    marginBottom: '1.5rem',
                    padding: '1.25rem',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '18px', color: '#111827' }}>Communication et message</h3>

                    <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer', marginBottom: '1rem' }}>
                      <input
                        type="checkbox"
                        checked={formData.photoPermission}
                        onChange={(e) => setFormData((prev) => ({ ...prev, photoPermission: e.target.checked }))}
                        style={{ marginTop: '0.2rem' }}
                      />
                      <span style={{ color: '#374151' }}>
                        J'autorise la prise et la diffusion de photos de mon vehicule sur les supports RetroBus.
                      </span>
                    </label>

                    <div className="premium-input-group">
                      <label className="premium-label">Message a l'organisation</label>
                      <textarea
                        className="premium-input"
                        placeholder="Une information utile a nous transmettre pour votre accueil sur site..."
                        value={formData.organizerMessage}
                        onChange={(e) => setFormData((prev) => ({ ...prev, organizerMessage: e.target.value }))}
                        rows={4}
                        style={{ resize: 'vertical', minHeight: '110px' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ÉTAPE 4: Confirmation */}
              {currentStep === 4 && (
                <div className="form-section">
                  <h2 className="form-section-title">Confirmation</h2>
                  <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>
                    Verifiez une derniere fois vos informations avant de confirmer votre inscription.
                  </p>

                  <div style={{
                    background: '#eff6ff',
                    border: '1px solid #93c5fd',
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                    marginBottom: '1.5rem'
                  }}>
                    <p style={{ margin: 0, color: '#1d4ed8', fontSize: '14px', lineHeight: 1.5 }}>
                      Un mail sera envoye sur l'adresse renseignee dans le formulaire d'inscription pour confirmer votre demande et vous transmettre la suite.
                    </p>
                  </div>

                  <div style={{
                    display: 'grid',
                    gap: '1.5rem'
                  }}>
                    <div style={{
                      padding: '1.25rem',
                      background: '#f9fafb',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <h3 style={{ margin: '0 0 1rem 0', fontSize: '18px', color: '#111827' }}>Participant</h3>
                      <div style={{ display: 'grid', gap: '0.5rem', color: '#374151' }}>
                        <div><strong>Nom :</strong> {resolvedParticipantName || 'Non renseigne'}</div>
                        <div><strong>Email :</strong> {formData.participantEmail || 'Non renseigne'}</div>
                        <div><strong>Telephone :</strong> {formData.phone || 'Non renseigne'}</div>
                        <div><strong>Club / association :</strong> {formData.club || 'Aucun'}</div>
                      </div>
                    </div>

                    <div style={{
                      padding: '1.25rem',
                      background: '#f9fafb',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <h3 style={{ margin: '0 0 1rem 0', fontSize: '18px', color: '#111827' }}>Vehicules confirmes</h3>
                      {confirmedVehicles.length > 0 ? (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                          {confirmedVehicles.map((vehicle, index) => (
                            <div
                              key={vehicle.id}
                              style={{
                                padding: '1rem',
                                background: 'white',
                                borderRadius: '10px',
                                border: '1px solid #e5e7eb'
                              }}
                            >
                              <div style={{ fontWeight: 700, color: '#be003c', marginBottom: '0.5rem' }}>
                                Vehicule #{index + 1}
                              </div>
                              <div style={{ display: 'grid', gap: '0.35rem', color: '#374151' }}>
                                <div><strong>Type :</strong> {vehicle.plateType === 'standard' ? 'Plaque standard FIV' : vehicle.plateType === 'old' ? 'Ancien format' : 'Plaque collection'}</div>
                                <div><strong>Immatriculation :</strong> {vehicle.licensePlate}</div>
                                <div><strong>Vehicule :</strong> {vehicle.vehicleName} {vehicle.vehicleModel}</div>
                                <div><strong>Annee :</strong> {vehicle.vehicleYear}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ margin: 0, color: '#6b7280' }}>Aucun vehicule complet n'est pret a etre confirme.</p>
                      )}
                    </div>

                    <div style={{
                      padding: '1.25rem',
                      background: '#f9fafb',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <h3 style={{ margin: '0 0 1rem 0', fontSize: '18px', color: '#111827' }}>Accueil et exposition</h3>
                      <div style={{ display: 'grid', gap: '0.5rem', color: '#374151' }}>
                        <div><strong>Placement groupe :</strong> {formData.wantsGroupedPlacement ? `Oui${formData.placementGroupName ? `, ${formData.placementGroupName}` : ''}` : 'Non'}</div>
                        <div><strong>Besoin particulier :</strong> {formData.spaceRequirement || 'Aucun'}</div>
                        <div><strong>Arrivee estimee :</strong> {formData.arrivalWindow || 'Non precisee'}</div>
                        <div><strong>Exposition publique :</strong> {formData.wantsPublicDisplay ? 'Oui' : 'Non'}</div>
                        {formData.vehicleStory && (
                          <div><strong>Histoire du vehicule :</strong> {formData.vehicleStory}</div>
                        )}
                        <div><strong>Autorisation photo :</strong> {formData.photoPermission ? 'Oui' : 'Non'}</div>
                        {formData.organizerMessage && (
                          <div><strong>Message a l'organisation :</strong> {formData.organizerMessage}</div>
                        )}
                      </div>
                    </div>

                    <div style={{
                      padding: '1.25rem',
                      background: '#fff7ed',
                      borderRadius: '12px',
                      border: '1px solid #fdba74'
                    }}>
                      <h3 style={{ margin: '0 0 1rem 0', fontSize: '18px', color: '#9a3412' }}>Participation</h3>
                      <div style={{ display: 'grid', gap: '0.5rem', color: '#7c2d12' }}>
                        <div><strong>Evenement :</strong> {event?.title}</div>
                        <div><strong>Date :</strong> {formatDateFrLong(event?.date)}{event?.time ? ` • ${event.time}` : ''}</div>
                        <div><strong>Lieu :</strong> {event?.location || 'Non renseigne'}</div>
                        <div><strong>Billets :</strong> {formData.adultTickets} adulte(s) + {formData.childTickets} enfant(s)</div>
                        {!eventInfo.isFree && (
                          <div><strong>Montant :</strong> {calculateTotal()}€</div>
                        )}
                      </div>
                    </div>
                  </div>
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
                  console.log('🖱️ Clic détecté sur le bouton principal', e);
                  if (currentStep === 4) {
                    handleSubmitRegistration();
                    return;
                  }
                  handleNext();
                }}
                disabled={submitting}
                style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? 'wait' : 'pointer' }}
              >
                {submitting ? 'Confirmation...' : currentStep === 4 ? 'Confirmer' : 'Suivant →'}
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
      onClick={() => {
        clearRegistrationSession();
        window.location.href = '/events';
      }}
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
            {eventInfo.registrationMethod === 'helloasso' && event?.helloAssoUrl ? (
              <VStack spacing={3} w="100%" align="stretch">
                <Alert status="info" borderRadius="md" size="sm">
                  <AlertIcon />
                  <Text fontSize="sm">
                    💳 Cliquez sur le bouton ci-dessous pour accéder directement au paiement sécurisé HelloAsso
                  </Text>
                </Alert>
                
                <Box 
                  w="100%" 
                  borderRadius="lg" 
                  overflow="hidden"
                  boxShadow="md"
                >
                  <iframe 
                    id="haWidgetButton" 
                    allowTransparency="true" 
                    src={event.helloAssoUrl.replace('/widget', '/widget-bouton')}
                    style={{
                      width: '100%', 
                      height: '70px', 
                      border: 'none'
                    }}
                    title="Bouton HelloAsso"
                  />
                </Box>
                
                <Text fontSize="xs" color="gray.600" textAlign="center">
                  🔒 Paiement 100% sécurisé par HelloAsso • Association française agréée
                </Text>
              </VStack>
            ) : (
              <>
                {/* Debug info */}
                {console.log('🐛 Debug bouton:', {
                  registrationMethod: eventInfo.registrationMethod,
                  hasHelloAssoUrl: !!event?.helloAssoUrl,
                  helloAssoUrl: event?.helloAssoUrl,
                  eventExtras: event?.extras
                })}
                
                <Button
                  size="lg"
                  colorScheme="red"
                  bg="var(--rbe-red)"
                  _hover={{ bg: "var(--rbe-accent)" }}
                  onClick={handleSubmitRegistration}
                  isLoading={submitting}
                  loadingText="Inscription en cours..."
                  w="100%"
                  leftIcon={<FiUsers />}
                >
                  {eventInfo.isFree
                    ? 'Confirmer ma participation'
                    : "S'inscrire et payer"}
                </Button>
                
                {/* Message debug si HelloAsso configuré mais URL manquante */}
                {eventInfo.registrationMethod === 'helloasso' && !event?.helloAssoUrl && (
                  <Alert status="warning" borderRadius="md" size="sm">
                    <AlertIcon />
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" fontWeight="600">
                        ⚠️ Configuration HelloAsso incomplète
                      </Text>
                      <Text fontSize="xs">
                        L'URL HelloAsso n'est pas définie pour cet événement. Contactez l'administrateur.
                      </Text>
                    </VStack>
                  </Alert>
                )}
              </>
            )}
          </VStack>
        </Box>
      </>
    )}

    {/* ÉTAPE: payment (iframe HelloAsso) */}
    {registrationStep === 'payment' && helloAssoUrl && (
      <VStack spacing={6} w="100%" align="stretch">
        <Box p={6} borderWidth="1px" borderRadius="lg" bg="blue.50">
          <VStack spacing={4} align="start">
            <HStack>
              <Icon as={FiExternalLink} color="var(--rbe-red)" boxSize={6} />
              <Heading size="md" color="var(--rbe-red)">Finaliser votre paiement</Heading>
            </HStack>
            <Text color="gray.700">
              Complétez votre paiement sécurisé via <strong>HelloAsso</strong> ci-dessous.
            </Text>
            <Text fontSize="sm" color="gray.600">
              ✅ Votre billet sera généré automatiquement après validation du paiement
            </Text>
          </VStack>
        </Box>

        {/* Iframe HelloAsso */}
        <Box 
          borderWidth="1px" 
          borderRadius="lg" 
          overflow="hidden"
          bg="white"
          boxShadow="lg"
        >
          <iframe 
            id="haWidget" 
            allowTransparency="true" 
            scrolling="auto" 
            src={helloAssoUrl}
            title="Paiement sécurisé HelloAsso"
            loading="lazy"
            style={{
              width: '100%', 
              height: '750px', 
              border: 'none'
            }}
            onLoad={(e) => {
              window.addEventListener('message', function(event) {
                const dataHeight = event.data.height;
                const haWidgetElement = document.getElementById('haWidget');
                if (dataHeight > parseFloat(haWidgetElement.height || 0)) {
                  haWidgetElement.height = dataHeight + 'px';
                }
              });
            }}
          />
        </Box>

        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold">💡 Après le paiement</Text>
            <Text fontSize="sm">
              Une fois votre paiement validé sur HelloAsso, <strong>cliquez sur le bouton ci-dessous</strong> pour finaliser votre inscription.
            </Text>
          </VStack>
        </Alert>

        <Button
          colorScheme="green"
          size="lg"
          onClick={() => {
            console.log('✅ Paiement confirmé par l\'utilisateur');
            setRegistrationStep('processing');
            setTimeout(() => {
              setTicketData({
                id: registrationId,
                status: 'PENDING_PAYMENT',
                ticketSent: false,
                event: event
              });
              setRegistrationStep('success');
            }, 2000);
          }}
          leftIcon={<Icon as={FiCheckCircle} />}
        >
          J'ai finalisé mon paiement
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (window.confirm('Êtes-vous sûr de vouloir annuler cette inscription ?')) {
              clearRegistrationSession();
              window.location.href = '/events';
            }
          }}
        >
          Annuler l'inscription
        </Button>
      </VStack>
    )}

    {/* ÉTAPE: processing */}
    {registrationStep === 'processing' && (
      <VStack spacing={6} p={8} borderWidth="1px" borderRadius="lg" bg="blue.50">
        <Spinner size="xl" color="var(--rbe-red)" />
        <Heading size="lg" color="blue.700">Traitement de votre inscription...</Heading>
        <Text textAlign="center" color="blue.600">
          Nous générons votre billet électronique...
        </Text>
      </VStack>
    )}

    {/* ÉTAPE: success */}
    {registrationStep === 'success' && ticketData && (
      <VStack spacing={6} p={8} borderWidth="1px" borderRadius="lg" boxShadow="xl" bg="green.50">
        <Heading size="lg" color="green.700">Inscription enregistrée</Heading>

        {ticketData.status === 'PENDING_PAYMENT' && (
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold">⏳ Paiement en cours de validation</Text>
              <Text fontSize="sm">
                Votre paiement HelloAsso est en cours de traitement. <strong>Votre billet électronique sera généré et envoyé par email une fois le paiement validé</strong> (généralement sous quelques minutes).
              </Text>
            </VStack>
          </Alert>
        )}

        <Box p={4} bg="white" borderRadius="md" w="100%" border="1px solid" borderColor="green.200">\n          <VStack align="start" spacing={3}>
            <Text fontWeight="600" fontSize="lg" color="green.700">
              ✅ {eventInfo.registrationType === 'parade_vehicles' 
                ? 'Votre inscription au rassemblement a bien été prise en compte' 
                : 'Votre inscription a bien été prise en compte'}
            </Text>
            
            <Text fontSize="md" color="gray.700">
              Vous recevrez prochainement un email de confirmation à l'adresse : 
              <Text as="span" fontWeight="600" ml={1}>{formData.participantEmail}</Text>
            </Text>

            <Divider my={2} />

            <Text fontSize="sm" color="gray.600">
              📧 <strong>Cet email contiendra :</strong>
            </Text>
            <VStack align="start" spacing={1} pl={4}>
              <Text fontSize="sm" color="gray.700">• La confirmation de votre inscription{eventInfo.registrationType === 'parade_vehicles' ? ' au rassemblement' : ''}</Text>
              {eventInfo.registrationType === 'parade_vehicles' && (
                <Text fontSize="sm" color="gray.700">• Le récapitulatif de vos véhicule(s) inscrit(s)</Text>
              )}
              <Text fontSize="sm" color="gray.700">• Les détails de l'événement et les informations pratiques</Text>
              {eventInfo.registrationType === 'parade_vehicles' ? (
                <>
                  <Text fontSize="sm" color="gray.700">• Les modalités de rassemblement : placement, horaires d'arrivée, consignes de sécurité</Text>
                  <Text fontSize="sm" color="gray.700">• Votre badge de participant à présenter le jour J</Text>
                </>
              ) : (
                <>
                  <Text fontSize="sm" color="gray.700">• Votre billet électronique avec QR Code à présenter le jour J</Text>
                  <Text fontSize="sm" color="gray.700">• Les modalités de rassemblement (placement, horaires d'arrivée, etc.)</Text>
                </>
              )}
            </VStack>

            <Divider my={2} />

            <Text fontSize="sm" color="gray.600" fontWeight="600">
              N° de réservation : {ticketData.id}
            </Text>
            <Text fontSize="sm" color="gray.600">
              Événement : {event.title}
            </Text>
            <Text fontSize="sm" color="gray.600">
              Date : {formatDateFrLong(event.date)} {event.time && `• ${event.time}`}
            </Text>
            <Text fontSize="sm" color="gray.600">
              Lieu : {event.location}
            </Text>
            {eventInfo.registrationType === 'parade_vehicles' && vehicles.length > 0 && (
              <Text fontSize="sm" color="gray.600">
                Véhicule(s) : {vehicles.filter(v => v.vehicleName).map(v => v.vehicleName).join(', ')}
              </Text>
            )}
          </VStack>
        </Box>

        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold">💡 {eventInfo.registrationType === 'parade_vehicles' ? 'Important' : 'Conseil'}</Text>
            <Text fontSize="sm">
              {eventInfo.registrationType === 'parade_vehicles' 
                ? "Conservez l'email de confirmation avec votre badge. Présentez-vous au point de rassemblement à l'heure indiquée avec votre(vos) véhicule(s)." 
                : "Conservez cet email et vérifiez vos courriers indésirables (spam) si vous ne le recevez pas dans les prochaines minutes."}
            </Text>
            {eventInfo.registrationType === 'parade_vehicles' && (
              <Text fontSize="sm" mt={1} color="gray.600">
                N'oubliez pas de vérifier vos courriers indésirables (spam) si vous ne recevez pas l'email rapidement.
              </Text>
            )}
          </VStack>
        </Alert>

        <Button
          colorScheme="green"
          size="lg"
          onClick={() => {
            clearRegistrationSession();
            window.location.href = '/events';
          }}
          leftIcon={<Icon as={FiArrowLeft} />}
        >
          Retour aux événements
        </Button>
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