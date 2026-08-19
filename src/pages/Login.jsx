import {
  Box, Button, Card, CardBody, CardHeader, FormControl, FormLabel, IconButton,
  Heading, Input, InputGroup, InputRightElement, Link, Stack, Text, useToast,
  Image, HStack, Divider
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useUser } from "../context/UserContext";
import logo from "../assets/retro_intranet_essonne.svg";

export default function Login() {
  const { setMatricule } = useUser();
  const [matricule, setMat] = useState("");
  const [password, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const nav = useNavigate();

  const quickFill = (m) => {
    setMat(m);
    setPwd("••••••••"); // placeholder visuel
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!matricule.trim()) {
      toast({ status: "warning", title: "Matricule requis" });
      return;
    }
    // Ici tu pluggeras plus tard une vraie auth (API). Pour l’instant: login local.
    try {
      setLoading(true);
      // petite latence pour UX
      await new Promise(r => setTimeout(r, 350));
      // enregistre le matricule dans le contexte (et localStorage via ton provider)
      setMatricule(matricule.trim());
      nav("/dashboard/retrobus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100dvh"
      bgGradient="linear(to-r, #1f4b86 0%, #2f3f73 45%, #6b3453 70%, #b4251a 100%)"
      display="grid"
      placeItems="center"
      px={4}
    >
      {/* Logo haut */}
      <Box position="absolute" top={{ base: 4, md: 8 }} left={{ base: 4, md: 8 }}>
        <Image src={logo} alt="RétroBus Essonne" h={{ base: "48px", md: "64px" }} />
      </Box>

      {/* Carte “verre dépoli” */}
      <Card
        w="100%"
        maxW="440px"
        bg="rgba(255,255,255,0.12)"
        border="1px solid rgba(255,255,255,0.35)"
        backdropFilter="blur(10px)"
        boxShadow="0 20px 60px rgba(0,0,0,.35)"
        color="white"
      >
        <CardHeader pb={2}>
          <Heading size="lg" textAlign="center">Connexion</Heading>
          <Text mt={2} textAlign="center" opacity={0.9}>
            Intranet RétroBus Essonne
          </Text>
        </CardHeader>
        <CardBody pt={2}>
          <Box as="form" onSubmit={onSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Matricule</FormLabel>
                <Input
                  value={matricule}
                  onChange={(e) => setMat(e.target.value)}
                  placeholder="ex: w.belaidi"
                  bg="whiteAlpha.900"
                  color="gray.900"
                  _placeholder={{ color: "gray.500" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Mot de passe</FormLabel>
                <InputGroup>
                  <Input
                    value={password}
                    onChange={(e) => setPwd(e.target.value)}
                    type={show ? "text" : "password"}
                    placeholder="••••••••"
                    bg="whiteAlpha.900"
                    color="gray.900"
                    _placeholder={{ color: "gray.500" }}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={show ? "Masquer" : "Afficher"}
                      icon={show ? <ViewOffIcon /> : <ViewIcon />}
                      variant="ghost"
                      onClick={() => setShow((s) => !s)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button type="submit" colorScheme="blue" isLoading={loading}>
                Se connecter
              </Button>

              {/* Liens rapides comptes existants */}
              <Box>
                <Divider my={2} borderColor="whiteAlpha.400" />
                <Text fontSize="sm" opacity={0.9} mb={2}>Connexions rapides</Text>
                <HStack spacing={3} flexWrap="wrap">
                  <Button size="sm" variant="outline" onClick={() => quickFill("w.belaidi")}>
                    w.belaidi · Waiyl
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => quickFill("m.ravichandran")}>
                    m.ravichandran · Méthusan
                  </Button>
                </HStack>
              </Box>

              <Text fontSize="xs" opacity={0.8} textAlign="center" mt={2}>
                Besoin d’aide ?{" "}
                <Link as={RouterLink} to="/dashboard/retromail" textDecoration="underline">
                  RétroMail
                </Link>
              </Text>
            </Stack>
          </Box>
        </CardBody>
      </Card>

      {/* Mentions */}
      <Text mt={6} color="whiteAlpha.800" fontSize="xs" textAlign="center">
        © {new Date().getFullYear()} RétroBus Essonne — Accès réservé
      </Text>
    </Box>
  );
}
