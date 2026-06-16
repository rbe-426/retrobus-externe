import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import SEO from "../components/SEO";

export default function Photos(){
  return (
    <>
      <SEO 
        title="Galerie Photos - RétroBus Essonne | Collection & Événements"
        description="Découvrez notre galerie photos : véhicules historiques restaurés, événements patrimoine, sorties bus vintage et moments forts de l'association RétroBus Essonne. Images haute qualité de notre collection unique."
        keywords="galerie photos, photos bus anciens, images véhicules historiques, photos événements, galerie collection, photos sorties, images autobus vintage, photothèque patrimoine"
        url="https://www.association-rbe.fr/photos"
      />
      <Heading as="h1">Photos</Heading>
      <SimpleGrid columns={{ base:2, md:4 }} spacing={6} mt={6}>
        {[1,2,3,4,5,6,7,8].map(i => (
          <Box key={i} className="card" p={0}>
            <img src={`/assets/photos/p${i}.jpg`} alt={`Photo ${i}`} style={{ width:"100%", display:"block", borderRadius:12 }} />
          </Box>
        ))}
      </SimpleGrid>
    </>
  );
}
