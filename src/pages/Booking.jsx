import { Helmet } from "react-helmet-async";

export default function Booking(){
  return (
    <>
      <Helmet><title>Reserver â€” RBE</title></Helmet>
      <Heading as="h1">Reserver une prestation</Heading>
      <Box className="card" mt={6} as="form" onSubmit={e=>e.preventDefault()}>
        <FormControl isRequired mb={4}>
          <FormLabel>Nom / Organisation</FormLabel>
          <Input placeholder="Votre nom ou organisation"/>
        </FormControl>
        <FormControl isRequired mb={4}>
          <FormLabel>Email</FormLabel>
          <Input type="email" placeholder="vous@domaine.fr"/>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Choix du vehicule</FormLabel>
          <Select placeholder="Selectionner">
            <option>Mercedes Citaro 1</option>
            <option>Setra S415 NF</option>
            <option>GX 427 BHNS</option>
          </Select>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Date souhaitee</FormLabel>
          <Input type="date"/>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Details</FormLabel>
          <Textarea rows={5} placeholder="Lieu, horaires, effectif, etc."/>
        </FormControl>
        <Button type="submit" colorScheme="yellow">Demander un devis</Button>
      </Box>
    </>
  );
}
