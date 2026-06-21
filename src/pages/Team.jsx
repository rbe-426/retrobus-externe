import {
  Box, Container, Heading, VStack, Text, HStack, Badge, Button
} from "@chakra-ui/react";
import SEO from "../components/SEO";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import * as teamService from "../services/teamService";

// Hooks pour bloquer screenshots et téléchargements
const useScreenshotProtection = ({ allowImageDrag = false } = {}) => {
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
      if (allowImageDrag) return;
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
  }, [allowImageDrag]);
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
  const cleanPath = String(imagePath).split('#')[0];
  if (cleanPath.startsWith('/uploads/')) {
    return `${API_BASE}${cleanPath}`;
  }
  return cleanPath;
};

const getImagePosition = (imagePath) => {
  const { x, y } = getImageMeta(imagePath);
  return `${x}% ${y}%`;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const toPercentPair = ({ x, y }) => `${x}% ${y}%`;

const getImageMeta = (imagePath) => {
  const raw = String(imagePath || '');
  const [_, hash = ''] = raw.split('#');

  let x = 50;
  let y = 50;
  let z = 1;

  if (hash) {
    const params = new URLSearchParams(hash);
    const xy = params.get('xy');
    const zoom = Number(params.get('z'));

    if (xy) {
      const [rawX, rawY] = xy.split(',');
      x = clamp(Number(rawX) || 50, 0, 100);
      y = clamp(Number(rawY) || 50, 0, 100);
    }

    if (Number.isFinite(zoom) && zoom > 0) {
      z = clamp(zoom, 1, 1.8);
    }
  }

  return { x, y, z };
};

const buildImageWithMeta = (imagePath, meta) => {
  const base = String(imagePath || '').split('#')[0];
  const x = clamp(Math.round((meta?.x ?? 50) * 10) / 10, 0, 100);
  const y = clamp(Math.round((meta?.y ?? 50) * 10) / 10, 0, 100);
  const z = clamp(Math.round((meta?.z ?? 1) * 100) / 100, 1, 1.8);
  return `${base}#xy=${x},${y}&z=${z}`;
};

const getPositionFromImage = (imagePath) => {
  const { x, y } = getImageMeta(imagePath);
  return { x, y };
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
  const isLocalTeamEditor = typeof window !== 'undefined'
    && window.location.hostname === 'localhost'
    && window.location.port === '3000';

  useScreenshotProtection({ allowImageDrag: isLocalTeamEditor });
  
  const [teamMembers, setTeamMembers] = useState(DEFAULT_TEAM_MEMBERS);
  const [loading, setLoading] = useState(true);
  const [localAdjustments, setLocalAdjustments] = useState({});
  const [dragState, setDragState] = useState(null);
  const [isSavingServer, setIsSavingServer] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const photoRefs = useRef({});

  useEffect(() => {
    if (!isLocalTeamEditor || typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('rbe:teamPhotoAdjustments');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        setLocalAdjustments(parsed);
      }
    } catch (error) {
      console.warn('Impossible de lire les positions locales team:', error);
    }
  }, [isLocalTeamEditor]);

  useEffect(() => {
    if (!isLocalTeamEditor || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('rbe:teamPhotoAdjustments', JSON.stringify(localAdjustments));
    } catch (error) {
      console.warn('Impossible de sauvegarder les positions locales team:', error);
    }
  }, [isLocalTeamEditor, localAdjustments]);

  useEffect(() => {
    if (!dragState || !isLocalTeamEditor) return;

    const handleMouseMove = (event) => {
      const container = photoRefs.current[dragState.memberId];
      if (!container) return;

      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      const dx = event.clientX - dragState.startX;
      const dy = event.clientY - dragState.startY;

      const nextX = clamp(Math.round((dragState.originX + (dx / width) * 100) * 10) / 10, 0, 100);
      const nextY = clamp(Math.round((dragState.originY + (dy / height) * 100) * 10) / 10, 0, 100);

      setLocalAdjustments((prev) => ({
        ...prev,
        [dragState.memberId]: {
          ...(prev[dragState.memberId] || {}),
          x: nextX,
          y: nextY
        }
      }));
    };

    const handleMouseUp = () => {
      setDragState(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, isLocalTeamEditor]);

  const getMemberImagePosition = (member) => {
    if (isLocalTeamEditor && localAdjustments[member.id]) {
      const current = localAdjustments[member.id];
      return toPercentPair({ x: current.x ?? 50, y: current.y ?? 50 });
    }
    return getImagePosition(member.image);
  };

  const getMemberImageZoom = (member) => {
    if (isLocalTeamEditor && localAdjustments[member.id]?.z) {
      return localAdjustments[member.id].z;
    }
    return getImageMeta(member.image).z;
  };

  const startDrag = (event, member) => {
    if (!isLocalTeamEditor || !member?.image) return;
    event.preventDefault();
    const current = localAdjustments[member.id] || getImageMeta(member.image);
    setDragState({
      memberId: member.id,
      startX: event.clientX,
      startY: event.clientY,
      originX: current.x ?? 50,
      originY: current.y ?? 50
    });
  };

  const resetMemberPosition = (memberId) => {
    setLocalAdjustments((prev) => {
      const next = { ...prev };
      delete next[memberId];
      return next;
    });
  };

  const updateMemberZoom = (member, zoomValue) => {
    if (!isLocalTeamEditor || !member?.image) return;
    const fallback = getImageMeta(member.image);
    const current = localAdjustments[member.id] || fallback;
    const nextZoom = clamp(Math.round(zoomValue * 100) / 100, 1, 1.8);
    setLocalAdjustments((prev) => ({
      ...prev,
      [member.id]: {
        x: current.x ?? 50,
        y: current.y ?? 50,
        z: nextZoom
      }
    }));
  };

  const saveAdjustmentsToServer = async () => {
    if (!isLocalTeamEditor || isSavingServer) return;

    const memberIds = Object.keys(localAdjustments);
    if (memberIds.length === 0) {
      setSaveMessage('Aucun changement local à sauvegarder.');
      return;
    }

    setIsSavingServer(true);
    setSaveMessage('Sauvegarde serveur en cours...');

    try {
      let savedCount = 0;
      const updatedMembers = [...teamMembers];

      for (const memberId of memberIds) {
        const member = updatedMembers.find((m) => String(m.id) === String(memberId));
        if (!member?.image) continue;

        const baseMeta = getImageMeta(member.image);
        const localMeta = localAdjustments[memberId] || {};
        const finalMeta = {
          x: localMeta.x ?? baseMeta.x,
          y: localMeta.y ?? baseMeta.y,
          z: localMeta.z ?? baseMeta.z
        };

        const nextImage = buildImageWithMeta(member.image, finalMeta);
        await teamService.updateTeamMemberImage(member.id, nextImage);

        member.image = nextImage;
        savedCount += 1;
      }

      setTeamMembers(updatedMembers);
      setSaveMessage(`Sauvegarde serveur OK (${savedCount} photo${savedCount > 1 ? 's' : ''}).`);
    } catch (error) {
      console.error('Erreur sauvegarde serveur team:', error);
      setSaveMessage(`Erreur sauvegarde serveur: ${error.message || 'inconnue'}`);
    } finally {
      setIsSavingServer(false);
    }
  };

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
      <SEO 
        title="Notre Équipe - RétroBus Essonne | Les Passionnés du Patrimoine Automobile"
        description="Rencontrez l'équipe de RétroBus Essonne : passionnés d'automobile, mécaniciens, carrossiers, historiens et bénévoles dévoués à la préservation du patrimoine des transports. Découvrez les talents qui font vivre notre association."
        keywords="équipe, membres, bénévoles, passionnés automobile, mécaniciens, carrossiers, historiens, équipe RétroBus, association bénévole, équipe patrimoine"
        url="https://www.association-rbe.fr/team"
      />

      <Box pt={8} pb={20} bg="white" userSelect="none" sx={{ WebkitUserSelect: 'none' }}>
        <Container maxW="7xl">
          {isLocalTeamEditor && (
            <Box
              mb={6}
              p={3}
              borderRadius="md"
              bg="yellow.50"
              border="1px solid"
              borderColor="yellow.300"
            >
              <VStack align="stretch" spacing={3}>
                <Text fontSize="sm" color="gray.700">
                  Mode local actif (localhost:3000): fais glisser une photo pour ajuster le cadrage, puis utilise +/- pour dézoomer/zoomer.
                </Text>
                <HStack>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={saveAdjustmentsToServer}
                    isLoading={isSavingServer}
                  >
                    Sauvegarder sur le serveur
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setLocalAdjustments({});
                      setSaveMessage('Ajustements locaux réinitialisés.');
                    }}
                  >
                    Vider ajustements locaux
                  </Button>
                </HStack>
                {saveMessage ? (
                  <Text fontSize="sm" color="gray.600">{saveMessage}</Text>
                ) : null}
              </VStack>
            </Box>
          )}

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
                <Box
                  w={{ base: "100%", md: "40%" }}
                  flexShrink={0}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  ref={(node) => {
                    if (node) photoRefs.current[member.id] = node;
                  }}
                  cursor={isLocalTeamEditor && member.image ? (dragState?.memberId === member.id ? 'grabbing' : 'grab') : 'default'}
                  position="relative"
                >
                  {member.image ? (
                    <>
                      <Box
                        position="relative"
                        w="100%"
                        h="250px"
                        borderRadius="lg"
                        overflow="hidden"
                        boxShadow="md"
                        bg="transparent"
                      >
                        <Box
                          as="img"
                          src={getImageUrl(member.image)}
                          alt={member.name}
                          position="absolute"
                          inset={0}
                          w="100%"
                          h="100%"
                          objectFit="cover"
                          objectPosition={getMemberImagePosition(member)}
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                          sx={{
                            WebkitUserDrag: 'none',
                            userDrag: 'none',
                            pointerEvents: 'none',
                            transform: `scale(${getMemberImageZoom(member)})`,
                            transformOrigin: getMemberImagePosition(member),
                            transition: 'transform 120ms ease-out'
                          }}
                        />

                        {isLocalTeamEditor && (
                          <>
                            <Box
                              position="absolute"
                              top={2}
                              right={2}
                              zIndex={3}
                            >
                              <Button
                                size="xs"
                                colorScheme="blackAlpha"
                                onClick={() => resetMemberPosition(member.id)}
                              >
                                Reset cadrage
                              </Button>
                            </Box>

                            <HStack
                              position="absolute"
                              left={2}
                              bottom={2}
                              zIndex={3}
                              bg="rgba(0, 0, 0, 0.45)"
                              borderRadius="md"
                              px={2}
                              py={1}
                              spacing={2}
                            >
                              <Button
                                size="xs"
                                colorScheme="blackAlpha"
                                onClick={() => updateMemberZoom(member, getMemberImageZoom(member) - 0.05)}
                              >
                                -
                              </Button>
                              <Text fontSize="xs" color="white" minW="58px" textAlign="center">
                                {(getMemberImageZoom(member) * 100).toFixed(0)}%
                              </Text>
                              <Button
                                size="xs"
                                colorScheme="blackAlpha"
                                onClick={() => updateMemberZoom(member, getMemberImageZoom(member) + 0.05)}
                              >
                                +
                              </Button>
                            </HStack>

                            <Box
                              position="absolute"
                              inset={0}
                              borderRadius="lg"
                              bg="transparent"
                              onMouseDown={(event) => startDrag(event, member)}
                              zIndex={2}
                            />
                          </>
                        )}
                      </Box>
                    </>
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
