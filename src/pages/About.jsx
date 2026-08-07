import { Box, Heading, Text } from "@chakra-ui/react";
import SEO, { jsonLdSchemas } from "../components/SEO";

export default function About(){
  return (
    <>
      <SEO 
        title="À propos de RétroBus Essonne - Notre Histoire & Mission"
        description="Découvrez l'association RétroBus Essonne : notre histoire, nos valeurs et notre mission de préservation du patrimoine automobile en Île-de-France. Association loi 1901 dédiée à la sauvegarde des bus historiques."
        keywords="à propos, histoire association, RétroBus Essonne, patrimoine automobile, mission, valeurs, association loi 1901, préservation bus historiques"
        url="https://www.association-rbe.fr/about"
        jsonLd={jsonLdSchemas.organization}
      />
      <Heading as="h1">A propos & Contact</Heading>
      <Box className="card" mt={6}>
        <Text mb={3}>Association loi 1901 basee en Essonne.</Text>
        <Text>Email : contact@retrobus-essonne.fr</Text>
        <Text>Instagram : @tc_essonnes</Text>
      </Box>
    </>
  );
}
