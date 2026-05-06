import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  useToast
} from "@chakra-ui/react";
import { FiCheckCircle, FiAlertCircle, FiArrowLeft } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://attractive-kindness-rbe-serveurs.up.railway.app';

export default function HelloAssoCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('');
  const toast = useToast();

  useEffect(() => {
    const processCallback = async () => {
      try {
        setLoading(true);

        // Récupérer les paramètres
        const eventId = searchParams.get('eventId');
        const name = searchParams.get('name');
        const email = searchParams.get('email');
        const phone = searchParams.get('phone');

        console.log('🔄 HelloAsso callback reçu:', { eventId, name, email });

        if (!eventId || !email || !name) {
          setStatus('error');
          setMessage('Paramètres manquants. Impossible de confirmer l\'inscription.');
          return;
        }

        // Appeler l'API pour enregistrer le participant
        const response = await fetch(
          `${API_BASE_URL}/api/public/events/${eventId}/join-helloasso`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name,
              email,
              phone: phone || null
            })
          }
        );

        const data = await response.json();

        if (response.ok) {
          console.log('✅ Inscription confirmée:', data);
          setStatus('success');
          setMessage(`Inscription confirmée pour ${name} (${email}). Redirection en cours...`);
          
          // Redirection après 3 secondes
          setTimeout(() => {
            navigate('/evenements');
          }, 3000);
        } else {
          console.error('❌ Erreur API:', data);
          setStatus('error');
          setMessage(data.error || 'Erreur lors de la confirmation de l\'inscription.');
        }
      } catch (error) {
        console.error('❌ Erreur:', error);
        setStatus('error');
        setMessage('Erreur réseau. Veuillez vérifier votre connexion.');
      } finally {
        setLoading(false);
      }
    };

    processCallback();
  }, [searchParams, navigate]);

  return (
    <Container maxW="md" py={10}>
      <VStack spacing={6} align="center">
        {loading ? (
          <>
            <Spinner size="xl" color="var(--rbe-red)" thickness="4px" />
            <Heading size="md" textAlign="center">
              Confirmation de votre inscription...
            </Heading>
            <Text color="gray.600" textAlign="center">
              Veuillez patienter pendant que nous confirmons votre paiement.
            </Text>
          </>
        ) : status === 'success' ? (
          <>
            <Box fontSize="5xl">✅</Box>
            <Heading size="lg" color="green.600" textAlign="center">
              Inscription confirmée !
            </Heading>
            <Alert
              status="success"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="auto"
              borderRadius="md"
            >
              <AlertIcon />
              <VStack spacing={2}>
                <Text fontWeight="bold">Merci !</Text>
                <Text fontSize="sm">{message}</Text>
              </VStack>
            </Alert>
            <Button
              colorScheme="green"
              size="lg"
              onClick={() => navigate('/evenements')}
              leftIcon={<FiArrowLeft />}
            >
              Retour aux événements
            </Button>
          </>
        ) : (
          <>
            <Box fontSize="5xl">❌</Box>
            <Heading size="lg" color="red.600" textAlign="center">
              Erreur d'inscription
            </Heading>
            <Alert
              status="error"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="auto"
              borderRadius="md"
            >
              <AlertIcon />
              <VStack spacing={2}>
                <Text fontWeight="bold">Impossible de confirmer</Text>
                <Text fontSize="sm">{message}</Text>
              </VStack>
            </Alert>
            <Button
              colorScheme="red"
              size="lg"
              onClick={() => navigate('/evenements')}
              leftIcon={<FiArrowLeft />}
            >
              Retour aux événements
            </Button>
          </>
        )}
      </VStack>
    </Container>
  );
}
