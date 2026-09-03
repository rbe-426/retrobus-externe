import React, { useState, useEffect } from "react";
import SEO, { jsonLdSchemas } from "../components/SEO";
import { apiUrl } from "../lib/api";
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  Button,
  Alert,
  AlertIcon,
  Spinner,
  HStack
} from "@chakra-ui/react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const previousOverflowX = document.body.style.overflowX;
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = previousOverflowX;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowError(false);
    
    try {
      // Envoi au backend pour dispatch vers l'adresse de l'association
      const API_BASE = import.meta.env.VITE_API_URL || 'https://attractive-kindness-rbe-serveurs.up.railway.app';
      console.log('📧 Submitting contact form to:', API_BASE);
      const resp = await fetch(`${API_BASE}/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });

      console.log('📧 Response status:', resp.status);
      
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err?.error || `HTTP ${resp.status}`);
      }

      const data = await resp.json();
      console.log('✅ Message submitted successfully:', data);
      setShowSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setShowSuccess(false), 5000);
      
    } catch (error) {
      console.error('❌ Erreur envoi message:', error);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "2px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "4px",
    color: "#2d3748"
  };

  return (
    <>
      <SEO 
        title="Contactez-nous - RétroBus Essonne"
        description="Contactez l'association RétroBus Essonne pour toute question, partenariat, demande d'information ou pour nous rejoindre. Notre équipe vous répondra dans les plus brefs délais."
        keywords="contact, nous joindre, email, formulaire contact, partenariat, information, nous rejoindre, adhésion"
        url="https://www.association-rbe.fr/contact"
        jsonLd={jsonLdSchemas.contactPage}
      />

      {/* Container PLEINE LARGEUR - IMAGE PLUS MONTÉE */}
      <Box
        position="relative"
        width="calc(100% + (2 * var(--mobile-gutter)))"
        height="calc(100vh - var(--header-h) - var(--nav-h) + 100px)"
        marginTop="-100px"
        marginLeft="calc(-1 * var(--mobile-gutter))"
        backgroundImage="url('/assets/photos/p4.jpg')"
        backgroundSize="cover"
        backgroundPosition="center 60%"
        backgroundRepeat="no-repeat"
        overflow="hidden"
      >
        {/* Overlay pour améliorer la lisibilité */}
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          backgroundColor="rgba(0, 0, 0, 0.4)"
          zIndex={1}
        />

        {/* Contenu CENTRÉ */}
        <Box 
          position="relative" 
          zIndex={2}
          width="100%"
          height="100%"
          paddingTop="calc(100px + 1rem)"
          paddingBottom={4}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          
          {/* Widget formulaire RÉDUIT EN HAUTEUR */}
          <Box
            w={{ base: "90%", md: "480px", lg: "520px" }}
            maxW="520px"
            bg="white"
            borderRadius="lg"
            boxShadow="2xl"
            p={6}
            maxHeight="calc(100vh - var(--header-h) - var(--nav-h) - 4rem)"
            overflowY="auto"
          >
            <VStack spacing={4} align="stretch">
              <Box textAlign="center">
                <Heading as="h1" size="lg" color="var(--rbe-red)" mb={2}>
                  Nous contacter
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Une question ? Un projet ? Écrivez-nous !
                </Text>
              </Box>

              {showSuccess && (
                <Alert status="success" mb={4}>
                  <AlertIcon />
                  Message envoyé avec succès !
                </Alert>
              )}
              
              {showError && (
                <Alert status="error" mb={4}>
                  <AlertIcon />
                  Erreur lors de l'envoi. Veuillez réessayer ou nous contacter directement.
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <VStack spacing={3} align="stretch">
                  <Box>
                    <label htmlFor="contact-name" style={labelStyle}>
                      Nom <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      required
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "var(--rbe-red)"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </Box>

                  <Box>
                    <label htmlFor="contact-email" style={labelStyle}>
                      Email <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      required
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "var(--rbe-red)"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </Box>

                  <Box>
                    <label htmlFor="contact-subject" style={labelStyle}>
                      Sujet <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Objet de votre message"
                      required
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = "var(--rbe-red)"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </Box>

                  <Box>
                    <label htmlFor="contact-message" style={labelStyle}>
                      Message <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Votre message..."
                      rows={3}
                      required
                      style={{
                        ...inputStyle,
                        resize: "vertical",
                        minHeight: "80px"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "var(--rbe-red)"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </Box>

                  <Button
                    type="submit"
                    w="100%"
                    bg="var(--rbe-red)"
                    color="white"
                    size="md"
                    borderRadius="md"
                    isDisabled={isSubmitting}
                    _hover={{ bg: "red.600" }}
                    _disabled={{ bg: "gray.400", cursor: "not-allowed" }}
                  >
                    {isSubmitting ? (
                      <HStack spacing={2}>
                        <Spinner size="sm" color="white" />
                        <Text>Envoi en cours...</Text>
                      </HStack>
                    ) : (
                      "Envoyer le message"
                    )}
                  </Button>
                </VStack>
              </form>

              <Box pt={3} borderTop="1px solid" borderColor="gray.200">
                <Text fontSize="xs" color="gray.500" textAlign="center" mb={2}>
                  Ou contactez-nous directement :
                </Text>
                <VStack spacing={1}>
                  <Text fontSize="sm" fontWeight="600" color="var(--rbe-red)">
                    📧 association.rbe@gmail.com
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    📍 Essonne, France
                  </Text>
                </VStack>
              </Box>

            </VStack>
          </Box>

        </Box>
      </Box>
    </>
  );
}