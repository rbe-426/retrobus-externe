import React, { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  HStack,
  Tooltip,
  useDisclosure,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function Navbar({ donateIcon, newsletterIcon, onDonateClick, onNewsletterClick, isOpen: isOpenProp, onOpen: onOpenProp, onClose: onCloseProp, embedded = false, userName, siteVersion }) {
  const internalDisclosure = useDisclosure();
  const isControlled = typeof isOpenProp === 'boolean' && typeof onOpenProp === 'function' && typeof onCloseProp === 'function';
  const isOpen = isControlled ? isOpenProp : internalDisclosure.isOpen;
  const onOpen = isControlled ? onOpenProp : internalDisclosure.onOpen;
  const onClose = isControlled ? onCloseProp : internalDisclosure.onClose;
  const { 
    isOpen: isNewsletterOpen, 
    onOpen: onNewsletterOpen, 
    onClose: onNewsletterClose 
  } = useDisclosure();
  
  const location = useLocation();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const toast = useToast();

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      setNewsletterStatus('error');
      return;
    }
    setIsSubmitting(true);
    setNewsletterStatus(null);
    
    try {
      console.log('📧 [Newsletter] Submitting to:', `${API_URL}/newsletter/subscribe`);
      console.log('📧 [Newsletter] Email:', newsletterEmail.trim());
      
      const res = await fetch(`${API_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail.trim() })
      });
      
      console.log('📧 [Newsletter] Response status:', res.status);
      
      if (!res.ok) {
        const errData = await res.text();
        console.error('📧 [Newsletter] Error response:', errData);
        throw new Error(`HTTP ${res.status}: ${errData}`);
      }
      
      const json = await res.json();
      console.log('📧 [Newsletter] Response JSON:', json);
      
      if (json.duplicated) {
        toast({
          status: "info",
          title: "Déjà inscrit",
          description: "Cet email est déjà dans notre liste de diffusion.",
          duration: 3000
        });
      } else {
        toast({
          status: "success",
          title: "Inscription réussie",
          description: "Vous recevrez nos prochaines actualités !",
          duration: 3000
        });
      }
      
      setNewsletterStatus('ok');
      setNewsletterEmail('');
      setTimeout(() => {
        setNewsletterStatus(null);
        onNewsletterClose();
      }, 1500);
      
    } catch (e) {
      console.error('❌ [Newsletter] Subscribe error:', e);
      setNewsletterStatus('error');
      toast({
        status: "error",
        title: "Erreur d'inscription",
        description: e.message || "Une erreur est survenue. Veuillez réessayer.",
        duration: 4000
      });
      setTimeout(() => setNewsletterStatus(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewsletterClick = () => {
    if (onNewsletterClick) {
      onNewsletterClick();
    } else {
      onNewsletterOpen();
    }
  };

  const items = [
    { to: "/", label: "Accueil" },
    { to: "/parc", label: "Parc de Véhicules" },
    { to: "/evenements", label: "Événements" },
    { to: "/retromerch", label: "RétroMerch" },
    // { to: "/omsi2", label: "AddOn OMSI 2" }, // ← temporairement désactivé
    { to: "/contact", label: "Contact" },
  ];

  // Derive a first name if provided or stored locally (must be declared before any early return)
  const firstName = useMemo(() => {
    if (userName && typeof userName === 'string') return userName;
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('prenom') ||
        localStorage.getItem('firstName') ||
        localStorage.getItem('firstname') ||
        localStorage.getItem('name') ||
        null
      );
    }
    return null;
  }, [userName]);

  if (!isMobile) {
    return (
      <nav className="site-nav" aria-label="Navigation principale" style={{ position: 'relative' }}>
        {/* Contenu navigation centré */}
        <Box
            className="site-nav__inner"
            display="flex"
            alignItems="center"
            justifyContent="center"
            px={4}
            gap={8}
        >
          <HStack gap={2}>
            {items.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                className={`nav-btn ${location.pathname === it.to ? "active" : ""}`}
                aria-current={location.pathname === it.to ? "page" : undefined}
              >
                {it.label}
              </Link>
            ))}
          </HStack>
        </Box>

        {/* Icônes complètement à droite (hors flux) */}
        <HStack
          spacing={5}
          position="absolute"
          right="12px"
          top="50%"
          transform="translateY(-50%)"
          pr={{ base: 2, lg: 4 }}
        >
          <Tooltip label="Soutenir l'association" hasArrow placement="bottom">
            <Box
              as="button"
              onClick={onDonateClick}
              display="flex"
              alignItems="center"
              justifyContent="center"
              transition="all .25s"
              _hover={{ transform: "scale(1.15)" }}
              _active={{ transform: "scale(1.05)" }}
              aria-label="Faire un don"
            >
              {donateIcon}
            </Box>
          </Tooltip>
          <Tooltip label="S'inscrire à la newsletter" hasArrow placement="bottom">
            <Box
              as="button"
              onClick={handleNewsletterClick}
              display="flex"
              alignItems="center"
              justifyContent="center"
              transition="all .25s"
              _hover={{ transform: "scale(1.15)" }}
              _active={{ transform: "scale(1.05)" }}
              aria-label="Inscription newsletter"
            >
              {newsletterIcon}
            </Box>
          </Tooltip>
        </HStack>
      </nav>
    );
  }

  // Mobile
  return (
    <>
      {!embedded && (
        <Box
          position="fixed"
          top="20px"
          right="20px"
          zIndex={1000}
          display={{ base: "block", md: "none" }}
        >
          <IconButton
            icon={<HamburgerIcon />}
            onClick={onOpen}
            variant="solid"
            bg="whiteAlpha.900"
            color="var(--rbe-red)"
            size="lg"
            borderRadius="full"
            boxShadow="lg"
            _hover={{ bg: "var(--rbe-red)", color: "white" }}
            aria-label="Menu de navigation"
          />
        </Box>
      )}

      <Drawer isOpen={isOpen} onClose={onClose} placement="right">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader bg="var(--rbe-red)" color="white" display="flex" flexDirection="column" alignItems="flex-start" gap={1}>
            <HStack spacing={2} alignItems="baseline">
              <Box as="span" fontWeight="bold">Association RétroBus Essonne</Box>
              {siteVersion && (
                <Box as="span" fontSize="xs" color="whiteAlpha.900">v{siteVersion}</Box>
              )}
            </HStack>
            {firstName && (
              <Text fontSize="sm" color="whiteAlpha.900" mt={1}>
                👋 Bonjour {firstName}
              </Text>
            )}
          </DrawerHeader>
          <DrawerBody p={0}>
            <VStack spacing={0} align="stretch">
              {items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    p={4}
                    bg={location.pathname === item.to ? "var(--rbe-red)" : "white"}
                    color={location.pathname === item.to ? "white" : "gray.700"}
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    _hover={{ bg: "gray.50" }}
                    transition="all 0.2s"
                    fontWeight="600"
                  >
                    {item.label}
                  </Box>
                </Link>
              ))}

              <Box
                p={4}
                display="flex"
                gap={6}
                justifyContent="center"
                borderTop="1px solid"
                borderColor="gray.200"
              >
                <Box
                  as="button"
                  onClick={() => { onDonateClick(); onClose(); }}
                  aria-label="Faire un don"
                >
                  {donateIcon}
                </Box>
                <Box
                  as="button"
                  onClick={() => { onNewsletterClick(); onClose(); }}
                  aria-label="Inscription newsletter"
                >
                  {newsletterIcon}
                </Box>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Newsletter Modal (inchangé) */}
      <Modal isOpen={isNewsletterOpen} onClose={onNewsletterClose} isCentered>
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
        <ModalContent 
          bg="linear-gradient(135deg, var(--rbe-red) 0%, var(--rbe-accent) 100%)"
          color="white"
          borderRadius="xl"
          maxW="md"
        >
          <ModalHeader fontSize="xl" fontWeight="bold">
            📧 Newsletter RétroBus Essonne
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6} pt={4}>
            <VStack align="stretch" spacing={4}>
              <Text fontSize="sm" color="gray.100">
                Recevez les actualités, événements et infos du parc directement par email.
              </Text>
              <form onSubmit={handleNewsletterSubmit}>
                <VStack align="stretch" spacing={3}>
                  <FormControl>
                    <FormLabel fontSize="sm" mb={1} color="white">
                      Votre email
                    </FormLabel>
                    <Input
                      type="email"
                      placeholder="vous@example.com"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      required
                      bg="white"
                      color="black"
                      _placeholder={{ color: "gray.500" }}
                    />
                  </FormControl>
                  
                  {newsletterStatus === "ok" && (
                    <Text fontSize="sm" color="green.200">
                      ✅ Inscription enregistrée !
                    </Text>
                  )}
                  
                  {newsletterStatus === "error" && (
                    <Text fontSize="sm" color="red.200">
                      ❌ Erreur. Vérifiez votre email.
                    </Text>
                  )}
                  
                  <Button
                    type="submit"
                    colorScheme="whiteAlpha"
                    bg="whiteAlpha.200"
                    color="white"
                    _hover={{ bg: "whiteAlpha.300" }}
                    isLoading={isSubmitting}
                    loadingText="Inscription..."
                  >
                    M'inscrire
                  </Button>
                </VStack>
              </form>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
