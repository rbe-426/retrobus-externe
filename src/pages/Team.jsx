import { Helmet } from "react-helmet-async";
import {
  Box, Container, Heading, VStack, Text, HStack, Badge, Button
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const teamMembers = [
  {
    id: 1,
    name: "Waiyl Belaidi",
    role: "Président de l'association",
    joinDate: "Mars 2025",
    memberType: "Membre fondateur",
    catchphrase: "RBE c'est surtout une famille de mordus d'automobile",
    image: "https://via.placeholder.com/250x300?text=Waiyl",
    expertise: ["Infos techniques", "SAEIV", "Médias"]
  },
  {
    id: 2,
    name: "Méthusan Ravichandran",
    role: "Vice-Président",
    joinDate: "Mars 2025",
    memberType: "Membre fondateur",
    catchphrase: "RBE c'est surtout une famille de mordus d'automobile",
    image: "https://via.placeholder.com/250x300?text=Méthusan",
    expertise: ["Médias", "Formations"]
  },
  {
    id: 3,
    name: "Jaffer-Salim Camaroudine",
    role: "Membre du Bureau",
    joinDate: "Mars 2025",
    memberType: "Membre fondateur",
    catchphrase: "Préserver les véhicules que je voyais rouler quand j'étais enfant, c'est un rêve",
    image: "https://via.placeholder.com/250x300?text=Jaffer-Salim",
    expertise: ["Conduite", "Formations", "Itinéraires", "Idées"]
  },
  {
    id: 4,
    name: "Sophie Martin",
    role: "Historienne & Documentaliste",
    joinDate: "2008",
    memberType: "Membre",
    catchphrase: "Préserver la mémoire, c'est aussi écrire l'avenir.",
    image: "https://via.placeholder.com/250x300?text=Sophie",
    expertise: ["Historique", "Documentation", "Recherche"]
  },
  {
    id: 5,
    name: "Luc Rousseau",
    role: "Responsable Événements",
    joinDate: "2010",
    memberType: "Membre",
    catchphrase: "Les sorties patrimoine, c'est notre passion partagée !",
    image: "https://via.placeholder.com/250x300?text=Luc",
    expertise: ["Événements", "Coordination", "Communication"]
  },
  {
    id: 6,
    name: "Isabelle Leclerc",
    role: "Webmaster & Communication",
    joinDate: "2015",
    memberType: "Membre",
    catchphrase: "Connecter les passionnés sur le digital.",
    image: "https://via.placeholder.com/250x300?text=Isabelle",
    expertise: ["Web", "Communication", "Social Media"]
  }
];

export default function Team() {
  return (
    <>
      <Helmet>
        <title>L'équipe RétroBus Essonne - Les passionnés derrière l'association</title>
        <meta name="description" content="Rencontrez l'équipe de RétroBus Essonne : passionnés d'automobile, mécaniciens, carrossiers, historiens et bénévoles." />
      </Helmet>

      <Box pt={20} pb={20} bg="white">
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
                <Box w={{ base: "100%", md: "40%" }} flexShrink={0}>
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
                </Box>
              );

              const contentBox = (
                <VStack spacing={4} align="start" w={{ base: "100%", md: "60%" }}>
                  <VStack spacing={1} align="start">
                    <Heading as="h3" size="lg" color="var(--rbe-red)">
                      {member.name}
                    </Heading>
                    <Text fontSize="sm" fontWeight="600" color="gray.600">
                      {member.role}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Depuis {member.joinDate} - {member.memberType}
                    </Text>
                  </VStack>

                  <Text fontSize="md" color="gray.700" fontStyle="italic" fontWeight="500">
                    "{member.catchphrase}"
                  </Text>

                  {/* Expertise Tags */}
                  <HStack spacing={2} flexWrap="wrap" pt={2}>
                    {member.expertise.map((exp, idx) => (
                      <Badge
                        key={idx}
                        colorScheme="red"
                        variant="outline"
                        fontSize="xs"
                      >
                        {exp}
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
