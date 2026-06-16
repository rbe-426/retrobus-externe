import { Helmet } from "react-helmet-async";
import {
  Box, Container, Heading, VStack, Text, HStack, Badge, Button
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import * as teamService from "../services/teamService";

// Hooks pour bloquer screenshots et téléchargements
const useScreenshotProtection = () => {
  useEffect(() => {
    // Bloquer les screenshots via Ctrl+Shift+S
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        return false;
      }
      // Bloquer Print Screen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        return false;
      }
    };

    // Bloquer clic droit
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Bloquer drag/drop
    const handleDragStart = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);
};

// API Base URL pour les images
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Construit l'URL complète d'une image
 * Si l'image commence par /uploads/, préfixe avec l'API_BASE
 * Sinon, retourne l'image telle quelle
 */
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('/uploads/')) {
    return `${API_BASE}${imagePath}`;
  }
  return imagePath;
};

// Données par défaut (fallback)
const DEFAULT_TEAM_MEMBERS = [
  {
    id: 1,
    name: "Waiyl Belaidi",
    role: "Président de l'association",
    roleColor: "red",
    hierarchy: 1,
    joinDate: "Mars 2025",
    memberType: "Membre fondateur",
    catchphrase: "RBE c'est surtout une famille de mordus d'automobile",
    image: "https://via.placeholder.com/250x300?text=Waiyl",
    expertise: [{ label: "Infos techniques", color: "blue" }, { label: "SAEIV", color: "blue" }, { label: "Médias", color: "blue" }]
  },
  {
    id: 2,
    name: "Méthusan Ravichandran",
    role: "Vice-Président",
    roleColor: "orange",
    hierarchy: 1,
    joinDate: "Mars 2025",
    memberType: "Membre fondateur",
    catchphrase: "RBE c'est surtout une famille de mordus d'automobile",
    image: "https://via.placeholder.com/250x300?text=Méthusan",
    expertise: [{ label: "Médias", color: "purple" }, { label: "Formations", color: "purple" }]
  },
  {
    id: 3,
    name: "Jaffer Camaroudine",
    role: "Membre du Conseil d'Administration",
    roleColor: "blue",
    hierarchy: 2,
    joinDate: "Mars 2025",
    memberType: "Membre fondateur",
    catchphrase: "Préserver les véhicules que je voyais rouler quand j'étais enfant, c'est un rêve",
    image: "/assets/team/jaffer-camaroudine.jpg",
    expertise: [{ label: "Conduite", color: "cyan" }, { label: "Formations", color: "cyan" }, { label: "Itinéraires", color: "cyan" }, { label: "Idées", color: "cyan" }]
  },
  {
    id: 4,
    name: "Jarina Amolotpavanathan",
    role: "Service Juridique",
    roleColor: "purple",
    hierarchy: 3,
    joinDate: "2026",
    memberType: "Membre",
    catchphrase: "Encadrer juridiquement nos actions pour protéger l'association et ses projets.",
    image: "https://via.placeholder.com/250x300?text=Jarina",
    expertise: [{ label: "Droit", color: "pink" }, { label: "Conformité", color: "pink" }, { label: "Contrats", color: "pink" }]
  },
  {
    id: 5,
    name: "Nour Bayoudh",
    role: "Responsable de l'Administration",
    roleColor: "green",
    hierarchy: 3,
    joinDate: "2026",
    memberType: "Membre",
    catchphrase: "Une bonne organisation est la clé de nos succès.",
    image: "https://via.placeholder.com/250x300?text=Nour",
    expertise: [{ label: "Administration", color: "teal" }, { label: "Organisation", color: "teal" }, { label: "Gestion", color: "teal" }]
  }
];

export default function Team() {
  useScreenshotProtection();
  
  const [teamMembers, setTeamMembers] = useState(DEFAULT_TEAM_MEMBERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      const members = await teamService.getAllTeamMembers(); // Mode public (sans contacts)
      setTeamMembers(Array.isArray(members) ? members : DEFAULT_TEAM_MEMBERS);
    } catch (error) {
      console.error('Erreur chargement équipe:', error);
      setTeamMembers(DEFAULT_TEAM_MEMBERS); // Fallback sur données par défaut
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>L'équipe RétroBus Essonne - Les passionnés derrière l'association</title>
        <meta name="description" content="Rencontrez l'équipe de RétroBus Essonne : passionnés d'automobile, mécaniciens, carrossiers, historiens et bénévoles." />
      </Helmet>

      <Box pt={8} pb={20} bg="white" userSelect="none" sx={{ WebkitUserSelect: 'none' }}>
        <Container maxW="7xl">
          {/* Header */}
          <VStack spacing={6} textAlign="center" mb={16}>
            <Heading as="h1" size="2xl" color="var(--rbe-red)">
              La Team RétroBus Essonne
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Découvrez les passionnés qui font vivre chaque jour l'association. 
              Une équipe diverse, complémentaire et motivée par la même passion : le patrimoine automobile.
            </Text>
          </VStack>

          {/* Team Grid - Card Layout */}
          <VStack spacing={8} align="stretch" mb={16}>
            {teamMembers.map((member, index) => {
              const isEven = index % 2 === 0;
              const photoBox = (
                <Box w={{ base: "100%", md: "40%" }} flexShrink={0} onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()}>
                  {member.image ? (
                    <Box
                      as="img"
                      src={getImageUrl(member.image)}
                      alt={member.name}
                      w="100%"
                      h="250px"
                      objectFit="cover"
                      borderRadius="lg"
                      boxShadow="md"
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      sx={{
                        WebkitUserDrag: 'none',
                        userDrag: 'none',
                        pointerEvents: 'none'
                      }}
                    />
                  ) : (
                    <Box
                      bg="gray.100"
                      h="250px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="5xl"
                      fontWeight="bold"
                      color="var(--rbe-red)"
                      borderRadius="lg"
                      boxShadow="md"
                    >
                      {member.name.split(" ")[0][0]}{member.name.split(" ")[1][0]}
                    </Box>
                  )}
                </Box>
              );

              const contentBox = (
                <VStack spacing={4} align="start" w={{ base: "100%", md: "60%" }}>
                  <VStack spacing={1} align="start">
                    <Heading as="h3" size="lg" color="var(--rbe-red)">
                      {member.name}
                    </Heading>
                    <Badge 
                      fontSize="sm" 
                      colorScheme={member.roleColor || 'red'}
                      px={3}
                      py={1}
                      borderRadius="md"
                    >
                      {member.role}
                    </Badge>
                    <Text fontSize="sm" color="gray.500">
                      Depuis {member.joinDate} - {member.memberType}
                    </Text>
                  </VStack>

                  <Text fontSize="md" color="gray.700" fontStyle="italic" fontWeight="500">
                    "{member.catchphrase}"
                  </Text>

                  {/* Expertise Tags */}
                  <HStack spacing={2} flexWrap="wrap" pt={2}>
                    {member.expertise?.map((exp, idx) => (
                      <Badge
                        key={idx}
                        colorScheme={typeof exp === 'string' ? 'red' : (exp.color || 'red')}
                        variant="outline"
                        fontSize="xs"
                      >
                        {typeof exp === 'string' ? exp : exp.label}
                      </Badge>
                    ))}
                  </HStack>
                </VStack>
              );

              return (
                <Box
                  key={member.id}
                  p={{ base: 4, md: 6 }}
                  borderRadius="2xl"
                  bg="rgba(255, 255, 255, 0.7)"
                  backdropFilter="blur(10px)"
                  position="relative"
                  overflow="hidden"
                  boxShadow="0 0 30px rgba(220, 38, 38, 0.4), 0 0 60px rgba(220, 38, 38, 0.2)"
                  _before={{
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    borderRadius: "2xl",
                    padding: "2px",
                    background: "linear-gradient(135deg, var(--rbe-red), #000000, var(--rbe-red))",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    pointerEvents: "none"
                  }}
                >
                  <HStack
                    spacing={{ base: 4, md: 8 }}
                    align="stretch"
                    position="relative"
                    zIndex={1}
                  >
                    {isEven ? (
                      <>
                        {photoBox}
                        {contentBox}
                      </>
                    ) : (
                      <>
                        {contentBox}
                        {photoBox}
                      </>
                    )}
                  </HStack>
                </Box>
              );
            })}
          </VStack>

          {/* CTA Section */}
          <Box
            bg="linear-gradient(135deg, rgba(220, 38, 38, 0.05), rgba(220, 38, 38, 0.02))"
            p={12}
            borderRadius="xl"
            border="2px solid"
            borderColor="var(--rbe-red)"
            textAlign="center"
          >
            <VStack spacing={4}>
              <Heading as="h2" size="lg" color="var(--rbe-red)">
                Rejoins l'aventure ! 🚍
              </Heading>
              <Text fontSize="md" color="gray.700" maxW="2xl">
                Tu partages notre passion pour le patrimoine automobile ? 
                Nous accueillons toujours de nouveaux bénévoles, peu importe tes compétences !
              </Text>
              <Button
                as={RouterLink}
                to="/contact"
                size="lg"
                bg="var(--rbe-red)"
                color="white"
                _hover={{ opacity: 0.9, transform: "translateY(-2px)" }}
              >
                Nous contacter
              </Button>
            </VStack>
          </Box>
        </Container>
      </Box>
    </>
  );
}
