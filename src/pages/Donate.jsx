import { Box, Heading, Text, Button } from "@chakra-ui/react";
import SEO from "../components/SEO";

export default function Donate(){
  return (
    <>
      <SEO 
        title="Nous Soutenir - Adhésion & Dons | RétroBus Essonne"
        description="Soutenez la préservation du patrimoine automobile ! Adhérez à l'association RétroBus Essonne ou faites un don pour aider à restaurer et entretenir nos véhicules historiques. Chaque contribution compte."
        keywords="don, adhésion, soutien, contribuer, HelloAsso, faire un don, adhérer association, devenir membre, soutenir patrimoine, financement restauration"
        url="https://www.association-rbe.fr/donate"
      />
      <Heading as="h1">Adhesion / Don</Heading>
      <Box className="card" mt={6}>
        <Text>Adherer a l association ou faire un don.</Text>
        <Button as="a" href="https://www.helloasso.com/" target="_blank" rel="noreferrer" mt={4} colorScheme="yellow">HelloAsso</Button>
      </Box>
    </>
  );
}
