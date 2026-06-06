/**
 * Composant BulletinSignature - Parcours numérique de signature de bulletin
 * Accessible via un lien privé envoyé par SMS/email
 * Route: /bulletin/sign/:token
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Progress,
  Card,
  CardHeader,
  CardBody,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  SimpleGrid,
  Badge,
  Icon,
  useToast,
  useSteps,
  Divider,
  Spinner,
  Container,
  useColorModeValue
} from '@chakra-ui/react';
import { FiCheckCircle, FiUser, FiEdit3, FiFileText, FiCheck, FiAlertCircle } from 'react-icons/fi';
import SignatureCanvas from 'react-signature-canvas';

const API_BASE_URL = 'http://localhost:4000';

const BulletinSignature = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const signatureRef = useRef(null);
  
  // Thème Trilogy RBE
  const cardBg = useColorModeValue('white', 'gray.800');
  const sectionBg = useColorModeValue('gray.50', 'gray.900');

  // États
  const [loading, setLoading] = useState(true);
  const [tokenData, setTokenData] = useState(null);
  const [memberData, setMemberData] = useState({});
  const [error, setError] = useState(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');

  // Stepper: 5 étapes
  const steps = [
    { title: 'Bienvenue', description: 'Présentation', icon: FiCheckCircle },
    { title: 'Vos informations', description: 'Vérification', icon: FiUser },
    { title: 'Compléments', description: 'Optionnel', icon: FiEdit3 },
    { title: 'Signature', description: 'Signature électronique', icon: FiFileText },
    { title: 'Confirmation', description: 'Terminé', icon: FiCheck }
  ];

  const { activeStep, setActiveStep } = useSteps({ index: 0, count: steps.length });

  // Charger les données du token au montage
  useEffect(() => {
    loadTokenData();
  }, [token]);

  const loadTokenData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/bulletin-flow/${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Token invalide');
      }

      setTokenData(data);
      setMemberData(data.memberData);

      // Si déjà signé, passer à l'étape confirmation
      if (data.status === 'signed') {
        setActiveStep(4);
      }

      setLoading(false);
    } catch (err) {
      console.error('❌ Error loading token data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Met à jour le statut d'une étape
  const updateStepStatus = async (step) => {
    try {
      await fetch(`${API_BASE_URL}/api/bulletin-flow/${token}/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step })
      });
    } catch (err) {
      console.error('Error updating step:', err);
    }
  };

  // Navigation
  const handleNext = () => {
    const currentStepName = ['welcome', 'verification', 'additional_info', 'signature', 'confirmation'][activeStep];
    updateStepStatus(currentStepName);
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Soumettre la signature
  const handleSubmitSignature = async () => {
    if (!signatureDataUrl) {
      toast({
        title: 'Signature manquante',
        description: 'Veuillez signer dans le cadre ci-dessus',
        status: 'warning',
        duration: 3000
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_BASE_URL}/api/bulletin-flow/${token}/signature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signatureDataUrl })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la signature');
      }

      if (data.documentUrl) {
        setDocumentUrl(data.documentUrl);
      }

      toast({
        title: 'Signature enregistrée !',
        description: 'Votre bulletin d\'adhésion est maintenant complet',
        status: 'success',
        duration: 5000
      });

      handleNext(); // Passer à confirmation
    } catch (err) {
      console.error('❌ Error submitting signature:', err);
      toast({
        title: 'Erreur',
        description: err.message,
        status: 'error',
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Effacer la signature
  const handleClearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setSignatureDataUrl('');
    }
  };

  // Capture de la signature
  const handleSignatureEnd = () => {
    if (signatureRef.current) {
      const dataUrl = signatureRef.current.toDataURL();
      setSignatureDataUrl(dataUrl);
    }
  };

  // Rendu des étapes
  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Bienvenue
        return (
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Heading size="xl" mb={2} color="black">👋 Bienvenue {memberData.firstName} !</Heading>
              <Text fontSize="lg" color="gray.600">Signez votre bulletin d'adhésion en quelques clics</Text>
            </Box>

            <Card 
              bg={cardBg} 
              borderColor="rbe.500" 
              borderWidth={2}
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              transition="all 0.2s"
            >
              <CardBody>
                <VStack spacing={3} align="start">
                  <HStack>
                    <Icon as={FiCheckCircle} color="rbe.500" boxSize={6} />
                    <Text fontWeight="bold" color="black">Parcours simple en 4 étapes</Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.700" pl={7}>
                    Vérifiez vos informations, complétez si besoin, signez électroniquement et c'est terminé !
                  </Text>

                  <HStack>
                    <Icon as={FiCheckCircle} color="rbe.500" boxSize={6} />
                    <Text fontWeight="bold" color="black">Sécurisé et confidentiel</Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.700" pl={7}>
                    Ce lien est personnel et expire dans 7 jours. Vos données sont protégées.
                  </Text>

                  <HStack>
                    <Icon as={FiCheckCircle} color="rbe.500" boxSize={6} />
                    <Text fontWeight="bold" color="black">Document généré automatiquement</Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.700" pl={7}>
                    Une fois signé, votre bulletin sera généré avec votre signature et la date.
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Alert status="info" variant="left-accent" borderRadius="lg">
              <AlertIcon />
              <Box>
                <AlertTitle>Association RETROBUS ESSONNE</AlertTitle>
                <AlertDescription>
                  Préservation et restauration de véhicules historiques de transport en commun
                </AlertDescription>
              </Box>
            </Alert>

            <Button colorScheme="rbe" size="lg" onClick={handleNext}>
              Commencer →
            </Button>
          </VStack>
        );

      case 1: // Vérification des informations
        return (
          <VStack spacing={6} align="stretch">
            <Heading size="md" color="black">📋 Vérifiez vos informations</Heading>
            <Text color="gray.600">Ces informations ont été pré-remplies. Vérifiez leur exactitude.</Text>

            <SimpleGrid columns={2} spacing={4}>
              <FormControl>
                <FormLabel>Prénom</FormLabel>
                <Input value={memberData.firstName || ''} isReadOnly bg="gray.50" />
              </FormControl>
              <FormControl>
                <FormLabel>Nom</FormLabel>
                <Input value={memberData.lastName || ''} isReadOnly bg="gray.50" />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input value={memberData.email || ''} isReadOnly bg="gray.50" />
              </FormControl>
              <FormControl>
                <FormLabel>Téléphone</FormLabel>
                <Input value={memberData.phone || ''} isReadOnly bg="gray.50" />
              </FormControl>
            </SimpleGrid>

            <Divider />

            <SimpleGrid columns={2} spacing={4}>
              <FormControl>
                <FormLabel>Type d'adhésion</FormLabel>
                <Badge colorScheme="green" fontSize="md" p={2}>
                  {memberData.membershipType || 'STANDARD'}
                </Badge>
              </FormControl>
              <FormControl>
                <FormLabel>Cotisation</FormLabel>
                <Badge colorScheme="rbe" fontSize="md" p={2}>
                  {memberData.paymentAmount || '0'} €
                </Badge>
              </FormControl>
            </SimpleGrid>

            <Alert status="success" variant="subtle" borderRadius="lg">
              <AlertIcon />
              Tout semble correct ? Passez à l'étape suivante !
            </Alert>

            <HStack justify="space-between">
              <Button variant="outline" colorScheme="rbe" onClick={handleBack}>
                ← Retour
              </Button>
              <Button colorScheme="rbe" onClick={handleNext}>
                Continuer →
              </Button>
            </HStack>
          </VStack>
        );

      case 2: // Informations complémentaires (optionnel)
        return (
          <VStack spacing={6} align="stretch">
            <Heading size="md" color="black">✏️ Informations complémentaires (optionnel)</Heading>
            <Text color="gray.600">Vous pouvez ajouter des informations supplémentaires si nécessaire.</Text>

            <FormControl>
              <FormLabel>Adresse</FormLabel>
              <Input 
                value={memberData.address || ''} 
                onChange={(e) => setMemberData({...memberData, address: e.target.value})}
                placeholder="12 rue de Paris"
              />
            </FormControl>

            <SimpleGrid columns={2} spacing={4}>
              <FormControl>
                <FormLabel>Code postal</FormLabel>
                <Input 
                  value={memberData.postalCode || ''} 
                  onChange={(e) => setMemberData({...memberData, postalCode: e.target.value})}
                  placeholder="91000"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Ville</FormLabel>
                <Input 
                  value={memberData.city || ''} 
                  onChange={(e) => setMemberData({...memberData, city: e.target.value})}
                  placeholder="Évry"
                />
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel>Commentaires</FormLabel>
              <Textarea 
                placeholder="Informations complémentaires, demandes particulières..."
                rows={4}
              />
            </FormControl>

            <HStack justify="space-between">
              <Button variant="outline" colorScheme="rbe" onClick={handleBack}>
                ← Retour
              </Button>
              <Button colorScheme="rbe" onClick={handleNext}>
                Continuer →
              </Button>
            </HStack>
          </VStack>
        );

      case 3: // Signature
        return (
          <VStack spacing={6} align="stretch">
            <Heading size="md" color="black">✍️ Signature électronique</Heading>
            <Text color="gray.600">Signez dans le cadre ci-dessous avec votre doigt (mobile) ou votre souris (ordinateur).</Text>

            <Box
              border="2px dashed"
              borderColor="gray.300"
              borderRadius="md"
              p={4}
              bg="white"
            >
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  width: window.innerWidth > 768 ? 700 : window.innerWidth - 100,
                  height: 200,
                  style: { border: '1px solid #E2E8F0', borderRadius: '6px', cursor: 'crosshair' }
                }}
                onEnd={handleSignatureEnd}
              />
            </Box>

            <HStack justify="space-between">
              <Button 
                variant="outline" 
                colorScheme="red" 
                onClick={handleClearSignature}
                leftIcon={<FiAlertCircle />}
              >
                Effacer
              </Button>
              <Text fontSize="sm" color="gray.500">
                Signez dans le cadre ci-dessus
              </Text>
            </HStack>

            <Alert status="info" variant="left-accent" borderRadius="lg">
              <AlertIcon />
              <Box>
                <Text fontSize="sm" fontWeight="bold">Valeur juridique</Text>
                <Text fontSize="xs">
                  Votre signature électronique a la même valeur qu'une signature manuscrite selon le règlement eIDAS.
                </Text>
              </Box>
            </Alert>

            <HStack justify="space-between">
              <Button variant="outline" colorScheme="rbe" onClick={handleBack}>
                ← Retour
              </Button>
              <Button 
                colorScheme="green" 
                onClick={handleSubmitSignature}
                isLoading={isSubmitting}
                isDisabled={!signatureDataUrl}
                leftIcon={<FiCheck />}
              >
                Valider la signature
              </Button>
            </HStack>
          </VStack>
        );

      case 4: // Confirmation
        return (
          <VStack spacing={6} align="stretch" textAlign="center">
            <Box>
              <Icon as={FiCheckCircle} color="green.500" boxSize={16} mb={4} />
              <Heading size="xl" color="black">Bravo ! C'est terminé 🎉</Heading>
              <Text fontSize="lg" color="gray.600" mt={2}>
                Votre bulletin d'adhésion a été signé avec succès
              </Text>
            </Box>

            <Card 
              bg={cardBg} 
              borderColor="green.500" 
              borderWidth={2}
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              transition="all 0.2s"
            >
              <CardBody>
                <VStack spacing={3}>
                  <HStack>
                    <Icon as={FiCheckCircle} color="green.500" boxSize={6} />
                    <Text fontWeight="bold" color="black">Signature enregistrée</Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.700">
                    Date : {new Date().toLocaleString('fr-FR')}
                  </Text>

                  {documentUrl && (
                    <>
                      <Divider />
                      <Button 
                        as="a" 
                        href={`${API_BASE_URL}${documentUrl}`}
                        download
                        colorScheme="rbe"
                        leftIcon={<FiFileText />}
                      >
                        📄 Télécharger mon bulletin signé
                      </Button>
                    </>
                  )}
                </VStack>
              </CardBody>
            </Card>

            <Alert status="success" borderRadius="lg">
              <AlertIcon />
              <Box>
                <AlertTitle>Que se passe-t-il maintenant ?</AlertTitle>
                <AlertDescription>
                  Votre bulletin sera traité par notre équipe. Vous recevrez un email de confirmation prochainement.
                </AlertDescription>
              </Box>
            </Alert>

            <Box pt={4}>
              <Text fontSize="sm" color="gray.500">
                Merci de votre confiance ! 🚌
              </Text>
              <Text fontSize="xs" color="gray.400" mt={2}>
                RETROBUS ESSONNE - Association loi 1901
              </Text>
            </Box>
          </VStack>
        );

      default:
        return null;
    }
  };

  // États de chargement et d'erreur
  if (loading) {
    return (
      <Container maxW="container.md" py={20}>
        <VStack spacing={6}>
          <Spinner size="xl" color="rbe.500" thickness="4px" />
          <Text color="gray.600">Chargement de votre bulletin...</Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md" py={20}>
        <Alert status="error" flexDirection="column" alignItems="center" textAlign="center" p={8} borderRadius="lg">
          <AlertIcon boxSize={12} />
          <AlertTitle mt={4} fontSize="2xl" color="black">Lien invalide ou expiré</AlertTitle>
          <AlertDescription mt={2} fontSize="md">
            {error}
          </AlertDescription>
          <Text fontSize="sm" color="gray.500" mt={4}>
            Ce lien a peut-être expiré (validité : 7 jours) ou a déjà été utilisé.
          </Text>
        </Alert>
      </Container>
    );
  }

  // Rendu principal
  return (
    <Box bg={sectionBg} minH="100vh" py={10}>
      <Container maxW="container.lg">
        {/* Header */}
        <VStack spacing={6} mb={10}>
          <Heading size="2xl" textAlign="center" color="black">
            📝 Bulletin d'Adhésion
          </Heading>
          <Text fontSize="lg" color="gray.600" textAlign="center">
            RETROBUS ESSONNE
          </Text>
        </VStack>

        {/* Stepper */}
        <Stepper index={activeStep} mb={10} colorScheme="rbe">
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink="0">
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>

        {/* Barre de progression */}
        <Progress 
          value={(activeStep / (steps.length - 1)) * 100} 
          colorScheme="rbe" 
          mb={8} 
          borderRadius="full"
          height="8px"
        />

        {/* Contenu de l'étape */}
        <Card 
          bg={cardBg}
          _hover={{ transform: 'translateY(-2px)', shadow: 'xl' }}
          transition="all 0.2s"
        >
          <CardBody p={8}>
            {renderStepContent()}
          </CardBody>
        </Card>

        {/* Footer */}
        <Box textAlign="center" mt={10} color="gray.500" fontSize="sm">
          <Text>🔒 Lien sécurisé et personnel</Text>
          <Text fontSize="xs" mt={1}>
            Expire le {tokenData?.expiresAt ? new Date(tokenData.expiresAt).toLocaleDateString('fr-FR') : ''}
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default BulletinSignature;
