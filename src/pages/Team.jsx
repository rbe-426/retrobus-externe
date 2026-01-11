import { Helmet } from "react-helmet-async";
import {
  Box, Container, Heading, SimpleGrid, VStack, Text, HStack, Badge, Button
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const teamMembers = [
  {
    id: 1,
    name: "Jean Dubois",
    role: "Président & Mécanicien",
    passion: "Restauration complète de moteurs",
    image: "https://via.placeholder.com/200?text=Jean",
    expertise: ["Moteurs", "Transmission", "Diagnostique"]
  },
  {
    id: 2,
    name: "Marie Bernard",
    role: "Trésorière & Carrossière",
    passion: "Peinture et tôlerie",
    image: "https://via.placeholder.com/200?text=Marie",
    expertise: ["Carrosserie", "Peinture", "Restauration"]
  },
  {
    id: 3,
    name: "Pierre Lefevre",
    role: "Électricien Senior",
    passion: "Systèmes électriques historiques",
    image: "https://via.placeholder.com/200?text=Pierre",
    expertise: ["Électricité", "Systèmes", "Câblage"]
  },
  {
    id: 4,
    name: "Sophie Martin",
    role: "Historienne & Documentaliste",
    passion: "Archivage et mémoire RATP",
    image: "https://via.placeholder.com/200?text=Sophie",
    expertise: ["Historique", "Documentation", "Recherche"]
  },
  {
    id: 5,
    name: "Luc Rousseau",
    role: "Responsable Événements",
    passion: "Sorties patrimoine & animation",
    image: "https://via.placeholder.com/200?text=Luc",
    expertise: ["Événements", "Coordination", "Communication"]
  },
  {
    id: 6,
    name: "Isabelle Leclerc",
    role: "Webmaster & Communication",
    passion: "Digital et présence en ligne",
    image: "https://via.placeholder.com/200?text=Isabelle",
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

          {/* Team Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} mb={16}>
            {teamMembers.map(member => (
              <Box
                key={member.id}
                bg="white"
                borderRadius="xl"
                overflow="hidden"
                boxShadow="sm"
                transition="all 0.3s ease"
                _hover={{
                  boxShadow: "lg",
                  transform: "translateY(-4px)"
                }}
                border="1px solid"
                borderColor="gray.200"
              >
                {/* Photo Placeholder */}
                <Box
                  bg="gray.100"
                  h="200px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="4xl"
                  fontWeight="bold"
                  color="gray.400"
                >
                  {member.name.split(" ")[0][0]}{member.name.split(" ")[1][0]}
                </Box>

                {/* Content */}
                <VStack spacing={3} p={6} align="stretch">
                  <VStack spacing={1} align="start">
                    <Heading as="h3" size="md" color="var(--rbe-red)">
                      {member.name}
                    </Heading>
                    <Text fontSize="sm" fontWeight="600" color="gray.600">
                      {member.role}
                    </Text>
                  </VStack>

                  <Text fontSize="sm" color="gray.700" fontStyle="italic">
                    "{member.passion}"
                  </Text>

                  {/* Expertise Tags */}
                  <HStack spacing={2} flexWrap="wrap" pt={2}>
                    {member.expertise.map((exp, idx) => (
                      <Badge
                        key={idx}
                        colorScheme="red"
                        variant="subtle"
                        fontSize="xs"
                      >
                        {exp}
                      </Badge>
                    ))}
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>

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
