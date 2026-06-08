/**
 * Composant BulletinSignature - Parcours numérique de signature de bulletin
 * Accessible via un lien privé envoyé par SMS/email
 * Route: /bulletin/sign/:token
 */

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Progress,
  Card,
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
  Checkbox,
  SimpleGrid,
  Badge,
  Icon,
  useToast,
  useSteps,
  Divider,
  Spinner,
  Container,
  Image,
  useColorModeValue,
  useBreakpointValue
} from '@chakra-ui/react';
import { FiCheckCircle, FiUser, FiEdit3, FiFileText, FiCheck, FiAlertCircle } from 'react-icons/fi';
import SignatureCanvas from 'react-signature-canvas';
import rbeLogo from '../assets/rbe_pn.png';

const DEFAULT_API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const KNOWN_API_FALLBACKS = [
  'https://attractive-kindness-rbe-serveurs.up.railway.app'
];

const isSafePublicApiUrl = (value) => {
  try {
    const parsed = new URL(value);
    const hn = parsed.hostname.toLowerCase();
    const isLocalHost = hn === 'localhost' || hn === '127.0.0.1' || hn === '0.0.0.0';
    const isPrivateIp = /^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[0-1])\./.test(hn);
    return !isLocalHost && !isPrivateIp;
  } catch {
    return false;
  }
};

const resolveApiBaseUrlFromLocation = () => {
  try {
    const qs = new URLSearchParams(window.location.search);
    const api = (qs.get('api') || '').trim();
    if (api && /^https?:\/\//i.test(api) && isSafePublicApiUrl(api)) {
      return api.replace(/\/+$/, '');
    }
  } catch {
    // ignore malformed query string
  }

  return DEFAULT_API_BASE_URL;
};

const resolveApiCandidates = () => {
  const fromQueryOrEnv = resolveApiBaseUrlFromLocation();

  const candidates = [
    fromQueryOrEnv,
    DEFAULT_API_BASE_URL,
    ...KNOWN_API_FALLBACKS,
    '' // same-origin fallback
  ];

  const unique = [];
  for (const raw of candidates) {
    const val = (raw || '').trim().replace(/\/+$/, '');
    if (!unique.includes(val)) {
      unique.push(val);
    }
  }

  return unique;
};

const TEST_FLOW_DATA = {
  success: true,
  status: 'in_progress',
  steps: {
    welcome: false,
    verification: false,
    additional_info: false,
    signature: false,
    confirmation: false
  },
  memberData: {
    firstName: 'Test',
    lastName: 'Adherent',
    email: 'test@association-rbe.fr',
    phone: '07 00 00 00 00',
    address: '12 rue du Test',
    postalCode: '91000',
    city: 'Evry-Courcouronnes',
    membershipType: 'STANDARD',
    paymentAmount: '25'
  },
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  signedAt: null
};

const DRIVING_LICENSE_OPTIONS = [
  { value: 'AM', label: 'Permis AM' },
  { value: 'A1', label: 'Permis A1' },
  { value: 'A2', label: 'Permis A2' },
  { value: 'A', label: 'Permis A' },
  { value: 'B', label: 'Permis B' },
  { value: 'BE', label: 'Permis BE' },
  { value: 'C', label: 'Permis C' },
  { value: 'CE', label: 'Permis CE' },
  { value: 'D', label: 'Permis D' },
  { value: 'DE', label: 'Permis DE' }
];

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  if (!file) {
    resolve('');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result || ''));
  reader.onerror = () => reject(new Error('Impossible de lire le fichier'));
  reader.readAsDataURL(file);
});

const BulletinSignature = () => {
  const { token } = useParams();
  const toast = useToast();
  const signatureRef = useRef(null);
  
  // Thème Trilogy RBE
  const cardBg = useColorModeValue('white', 'gray.800');
  const sectionBg = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const isMobile = useBreakpointValue({ base: true, md: false });

  // États
  const [loading, setLoading] = useState(true);
  const [tokenData, setTokenData] = useState(null);
  const [memberData, setMemberData] = useState({});
  const [error, setError] = useState(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');
  const [apiBaseUrl, setApiBaseUrl] = useState(() => resolveApiBaseUrlFromLocation());
  const [isTestMode] = useState(() => {
    try {
      const qs = new URLSearchParams(window.location.search);
      return token === 'test' || qs.get('test') === '1';
    } catch {
      return token === 'test';
    }
  });

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

      if (isTestMode) {
        setTokenData(TEST_FLOW_DATA);
        setMemberData(TEST_FLOW_DATA.memberData);
        setLoading(false);
        return;
      }

      let found = null;
      const candidates = resolveApiCandidates();

      for (const candidate of candidates) {
        try {
          const response = await fetch(`${candidate}/api/bulletin-flow/${token}`);
          const data = await response.json().catch(() => ({}));

          if (response.ok && data?.success) {
            found = { candidate, data };
            break;
          }
        } catch {
          // try next candidate
        }
      }

      if (!found) {
        throw new Error('Token invalide ou expiré');
      }

      const { candidate, data } = found;
      setApiBaseUrl(candidate);

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
    if (isTestMode) return;
    try {
      await fetch(`${apiBaseUrl}/api/bulletin-flow/${token}/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step })
      });
    } catch (err) {
      console.error('Error updating step:', err);
    }
  };

  // Navigation
  const handleNext = async () => {
    if (activeStep === 2) {
      if (!memberData.acceptedStatuts || !memberData.acceptedReglementInterieur || !memberData.acceptedCsar) {
        toast({
          title: 'Consentements requis',
          description: 'Veuillez accepter les 3 documents de référence avant de continuer.',
          status: 'warning',
          duration: 4000
        });
        return;
      }

      if (memberData.hasDrivingLicenses) {
        const selected = Array.isArray(memberData.drivingLicenses) ? memberData.drivingLicenses : [];
        if (selected.length === 0) {
          toast({
            title: 'Permis requis',
            description: 'Veuillez cocher au moins un permis.',
            status: 'warning',
            duration: 4000
          });
          return;
        }

        for (const permit of selected) {
          const num = String(memberData.drivingLicenseNumbers?.[permit] || '').trim();
          if (!num) {
            toast({
              title: 'Numéro de permis manquant',
              description: `Veuillez renseigner le numéro du permis ${permit}.`,
              status: 'warning',
              duration: 4000
            });
            return;
          }
        }
      }
    }

    if (!isTestMode && (activeStep === 1 || activeStep === 2)) {
      try {
        await fetch(`${apiBaseUrl}/api/bulletin-flow/${token}/member-data`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ memberData })
        });
      } catch (err) {
        console.error('Error saving additional info:', err);
      }
    }

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

      if (isTestMode) {
        toast({
          title: 'Mode test',
          description: 'Signature simulée avec succès (aucun bulletin généré).',
          status: 'success',
          duration: 3000
        });
        setActiveStep(4);
        return;
      }

      const response = await fetch(`${apiBaseUrl}/api/bulletin-flow/${token}/signature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signatureDataUrl,
          memberData,
          signatureChannel: 'bulletin_dematerialise_web'
        })
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
              borderColor={borderColor}
              borderTopColor="#be003c"
              borderTopWidth="4px"
              borderWidth={2}
              shadow="md"
              _hover={{ transform: 'translateY(-2px)', shadow: 'xl' }}
              transition="all 0.2s"
            >
              <CardBody>
                <VStack spacing={3} align="start">
                  <HStack>
                    <Icon as={FiCheckCircle} color="#be003c" boxSize={6} />
                    <Text fontWeight="bold" color="black">Parcours simple en 4 étapes</Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.700" pl={7}>
                    Vérifiez vos informations, complétez si besoin, signez électroniquement et c'est terminé !
                  </Text>

                  <HStack>
                    <Icon as={FiCheckCircle} color="#be003c" boxSize={6} />
                    <Text fontWeight="bold" color="black">Sécurisé et confidentiel</Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.700" pl={7}>
                    Ce lien est personnel et expire dans 7 jours. Vos données sont protégées.
                  </Text>

                  <HStack>
                    <Icon as={FiCheckCircle} color="#be003c" boxSize={6} />
                    <Text fontWeight="bold" color="black">Document généré automatiquement</Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.700" pl={7}>
                    Une fois signé, votre bulletin sera généré avec votre signature et la date.
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Button bg="#be003c" color="white" _hover={{ bg: '#e40045' }} size="lg" onClick={handleNext} width={{ base: '100%', md: 'auto' }}>
              Commencer →
            </Button>
          </VStack>
        );

      case 1: // Vérification des informations
        const birthDateValue = memberData.birthDate
          ? String(memberData.birthDate).split('T')[0]
          : '';
        const rawPaymentAmount = memberData.paymentAmount ?? '0';
        const parsedPaymentAmount = Number(rawPaymentAmount);
        const isZeroCotisation = !!memberData.isExempted || !Number.isFinite(parsedPaymentAmount) || parsedPaymentAmount === 0;
        const zeroMotif = (memberData.exemptionReason || '').trim()
          || (memberData.membershipType === 'STAGIAIRE' ? 'Stagiaire (sans cotisation)' : 'Exonération de cotisation');

        return (
          <VStack spacing={6} align="stretch">
            <Heading size="md" color="black">📋 Vérifiez vos informations</Heading>
            <Text color="gray.600">Ces informations ont été pré-remplies. Corrigez si nécessaire avant de continuer.</Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel>Prénom</FormLabel>
                <Input
                  value={memberData.firstName || ''}
                  onChange={(e) => setMemberData({ ...memberData, firstName: e.target.value })}
                  bg="white"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Nom</FormLabel>
                <Input
                  value={memberData.lastName || ''}
                  onChange={(e) => setMemberData({ ...memberData, lastName: e.target.value })}
                  bg="white"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={memberData.email || ''}
                  onChange={(e) => setMemberData({ ...memberData, email: e.target.value })}
                  bg="white"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Téléphone</FormLabel>
                <Input
                  type="tel"
                  value={memberData.phone || ''}
                  onChange={(e) => setMemberData({ ...memberData, phone: e.target.value })}
                  bg="white"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Date de naissance</FormLabel>
                <Input
                  type="date"
                  value={birthDateValue}
                  onChange={(e) => setMemberData({ ...memberData, birthDate: e.target.value })}
                  bg="white"
                />
              </FormControl>
            </SimpleGrid>

            <Divider />

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel>Type d'adhésion</FormLabel>
                <Badge colorScheme="green" fontSize="md" p={2}>
                  {memberData.membershipType || 'STANDARD'}
                </Badge>
              </FormControl>
              <FormControl>
                <FormLabel>Cotisation</FormLabel>
                <HStack spacing={2} align="center" flexWrap="wrap">
                  <Badge colorScheme="green" fontSize="md" p={2}>
                    {isZeroCotisation ? '0 €' : `${rawPaymentAmount} €`}
                  </Badge>
                  {isZeroCotisation && (
                    <Text fontSize="sm" color="gray.600">
                      Motif: {zeroMotif}
                    </Text>
                  )}
                </HStack>
              </FormControl>
            </SimpleGrid>

            <Alert status="success" variant="subtle" borderRadius="lg">
              <AlertIcon />
              Tout semble correct ? Passez à l'étape suivante !
            </Alert>

            <HStack justify="space-between" w="100%" flexDirection={{ base: 'column', sm: 'row' }} spacing={3}>
              <Button variant="outline" borderColor="#be003c" color="#be003c" _hover={{ bg: 'red.50' }} onClick={handleBack} width={{ base: '100%', sm: 'auto' }}>
                ← Retour
              </Button>
              <Button bg="#be003c" color="white" _hover={{ bg: '#e40045' }} onClick={handleNext} width={{ base: '100%', sm: 'auto' }}>
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

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
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

            <Divider />

            <Box borderWidth={1} borderRadius="md" p={4} bg="white">
              <VStack align="stretch" spacing={4}>
                <Heading size="sm" color="black">Permis de conduire</Heading>
                <Checkbox
                  isChecked={!!memberData.hasDrivingLicenses}
                  onChange={(e) => setMemberData({
                    ...memberData,
                    hasDrivingLicenses: e.target.checked,
                    drivingLicenses: e.target.checked ? (memberData.drivingLicenses || []) : [],
                    drivingLicenseNumbers: e.target.checked ? (memberData.drivingLicenseNumbers || {}) : {}
                  })}
                >
                  Détenteur du/des permis
                </Checkbox>

                {memberData.hasDrivingLicenses && (
                  <>
                    <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
                      {DRIVING_LICENSE_OPTIONS.map((option) => (
                        <Checkbox
                          key={option.value}
                          isChecked={(memberData.drivingLicenses || []).includes(option.value)}
                          onChange={(e) => {
                            const current = Array.isArray(memberData.drivingLicenses) ? memberData.drivingLicenses : [];
                            const nextLicenses = e.target.checked
                              ? [...new Set([...current, option.value])]
                              : current.filter((v) => v !== option.value);
                            const nextNumbers = { ...(memberData.drivingLicenseNumbers || {}) };
                            if (!e.target.checked) {
                              delete nextNumbers[option.value];
                            }
                            setMemberData({
                              ...memberData,
                              drivingLicenses: nextLicenses,
                              drivingLicenseNumbers: nextNumbers
                            });
                          }}
                        >
                          {option.label}
                        </Checkbox>
                      ))}
                    </SimpleGrid>

                    {(memberData.drivingLicenses || []).length > 0 && (
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        {(memberData.drivingLicenses || []).map((permit) => (
                          <FormControl key={permit} isRequired>
                            <FormLabel>Numéro permis {permit}</FormLabel>
                            <Input
                              value={memberData.drivingLicenseNumbers?.[permit] || ''}
                              onChange={(e) => setMemberData({
                                ...memberData,
                                drivingLicenseNumbers: {
                                  ...(memberData.drivingLicenseNumbers || {}),
                                  [permit]: e.target.value
                                }
                              })}
                              placeholder={`Numéro du permis ${permit}`}
                            />
                          </FormControl>
                        ))}
                      </SimpleGrid>
                    )}

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl>
                        <FormLabel>Photo permis (recto)</FormLabel>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          pt={1}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const dataUrl = await readFileAsDataUrl(file);
                              setMemberData((prev) => ({
                                ...prev,
                                drivingLicensePhotoFrontDataUrl: dataUrl,
                                drivingLicensePhotoFrontName: file.name
                              }));
                            } catch (err) {
                              toast({ title: 'Erreur import fichier', description: err.message, status: 'error', duration: 3000 });
                            }
                          }}
                        />
                        <Text fontSize="xs" color="gray.500" mt={1}>
                          {memberData.drivingLicensePhotoFrontName || 'Import recto (optionnel)'}
                        </Text>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Photo permis (verso)</FormLabel>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          pt={1}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const dataUrl = await readFileAsDataUrl(file);
                              setMemberData((prev) => ({
                                ...prev,
                                drivingLicensePhotoBackDataUrl: dataUrl,
                                drivingLicensePhotoBackName: file.name
                              }));
                            } catch (err) {
                              toast({ title: 'Erreur import fichier', description: err.message, status: 'error', duration: 3000 });
                            }
                          }}
                        />
                        <Text fontSize="xs" color="gray.500" mt={1}>
                          {memberData.drivingLicensePhotoBackName || 'Import verso (optionnel)'}
                        </Text>
                      </FormControl>
                    </SimpleGrid>
                  </>
                )}
              </VStack>
            </Box>

            <Box borderWidth={1} borderRadius="md" p={4} bg="white">
              <VStack align="stretch" spacing={4}>
                <Heading size="sm" color="black">Documents et engagements</Heading>

                <Checkbox
                  isChecked={!!memberData.acceptedStatuts}
                  onChange={(e) => setMemberData({ ...memberData, acceptedStatuts: e.target.checked })}
                >
                  J'ai pris connaissance des <Text as="span" color="blue.500" textDecoration="underline">Statuts de l'association</Text>
                </Checkbox>

                <Checkbox
                  isChecked={!!memberData.acceptedReglementInterieur}
                  onChange={(e) => setMemberData({ ...memberData, acceptedReglementInterieur: e.target.checked })}
                >
                  J'accepte le <Text as="span" color="blue.500" textDecoration="underline">règlement intérieur de l'association</Text>
                </Checkbox>

                <Checkbox
                  isChecked={!!memberData.acceptedCsar}
                  onChange={(e) => setMemberData({ ...memberData, acceptedCsar: e.target.checked })}
                >
                  J'accepte le <Text as="span" color="blue.500" textDecoration="underline">CSAR de l'association</Text>
                </Checkbox>

                <Alert status="info" variant="left-accent" borderRadius="md">
                  <AlertIcon />
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" fontWeight="bold">Documents à brancher plus tard</Text>
                    <Text fontSize="xs">Statuts: externe/public/docs/statuts-association.pdf</Text>
                    <Text fontSize="xs">Règlement: externe/public/docs/reglement-interieur-association.pdf</Text>
                    <Text fontSize="xs">CSAR: externe/public/docs/csar-association.pdf</Text>
                  </VStack>
                </Alert>
              </VStack>
            </Box>

            <HStack justify="space-between" w="100%" flexDirection={{ base: 'column', sm: 'row' }} spacing={3}>
              <Button variant="outline" borderColor="#be003c" color="#be003c" _hover={{ bg: 'red.50' }} onClick={handleBack} width={{ base: '100%', sm: 'auto' }}>
                ← Retour
              </Button>
              <Button bg="#be003c" color="white" _hover={{ bg: '#e40045' }} onClick={handleNext} width={{ base: '100%', sm: 'auto' }}>
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

            <HStack justify="space-between" w="100%" flexDirection={{ base: 'column', sm: 'row' }} spacing={3}>
              <Button 
                variant="outline" 
                colorScheme="red" 
                onClick={handleClearSignature}
                leftIcon={<FiAlertCircle />}
                width={{ base: '100%', sm: 'auto' }}
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

            <HStack justify="space-between" w="100%" flexDirection={{ base: 'column', sm: 'row' }} spacing={3}>
              <Button variant="outline" borderColor="#be003c" color="#be003c" _hover={{ bg: 'red.50' }} onClick={handleBack} width={{ base: '100%', sm: 'auto' }}>
                ← Retour
              </Button>
              <Button 
                colorScheme="green" 
                onClick={handleSubmitSignature}
                isLoading={isSubmitting}
                isDisabled={!signatureDataUrl}
                leftIcon={<FiCheck />}
                width={{ base: '100%', sm: 'auto' }}
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
                        href={`${apiBaseUrl}${documentUrl}`}
                        download
                        bg="#be003c"
                        color="white"
                        _hover={{ bg: '#e40045' }}
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
          <Spinner size="xl" color="#be003c" thickness="4px" />
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
    <Box
      bg={sectionBg}
      backgroundImage="linear-gradient(180deg, rgba(190, 0, 60, 0.04) 0%, rgba(255, 255, 255, 0) 35%)"
      minH="100vh"
      py={{ base: 4, md: 10 }}
    >
      <Container maxW={{ base: 'container.sm', md: 'container.lg' }} px={{ base: 3, md: 4 }}>
        {/* Header */}
        <VStack spacing={4} mb={{ base: 6, md: 10 }} align="center">
          <Badge colorScheme="red" fontSize="sm" px={3} py={1} borderRadius="full">
            Parcours adhesion securise
          </Badge>

          <Box w="100%">
            <HStack
              spacing={{ base: 0, md: 8 }}
              align="center"
              justify={{ base: 'flex-end', md: 'space-between' }}
              w="100%"
            >
              <Image
                src={rbeLogo}
                alt="Logo RBE"
                h={{ base: 0, md: '92px' }}
                w="auto"
                display={{ base: 'none', md: 'block' }}
                objectFit="contain"
                flexShrink={0}
              />
              <VStack align="end" spacing={1} flex={1}>
                <Heading size={{ base: 'lg', md: '2xl' }} textAlign="right" color="black" w="100%">
                  Bulletin d'Adhésion
                </Heading>
              </VStack>
            </HStack>
          </Box>

          {isTestMode && (
            <Badge colorScheme="orange" fontSize="xs" p={2} borderRadius="md">
              Mode test local: aucune donnée réelle n'est modifiée
            </Badge>
          )}
        </VStack>

        {/* Stepper */}
        {isMobile ? (
          <Box mb={6}>
            <Text fontSize="sm" color="gray.600" textAlign="center" mb={2}>
              Étape {activeStep + 1}/{steps.length}: {steps[activeStep]?.title}
            </Text>
          </Box>
        ) : (
          <Stepper index={activeStep} mb={10} colorScheme="red">
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
        )}

        {/* Barre de progression */}
        <Progress 
          value={(activeStep / (steps.length - 1)) * 100} 
          colorScheme="red" 
          mb={{ base: 4, md: 8 }} 
          borderRadius="full"
          height="8px"
        />

        {/* Contenu de l'étape */}
        <Card 
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          shadow="md"
          _hover={{ transform: 'translateY(-2px)', shadow: 'xl' }}
          transition="all 0.2s"
        >
          <CardBody p={{ base: 4, md: 8 }}>
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
