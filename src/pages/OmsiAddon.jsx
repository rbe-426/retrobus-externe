import React from "react";
import SEO from "../components/SEO";
import { Box, Container, VStack, Heading, Text, Button } from "@chakra-ui/react";
import { FaDiscord } from "react-icons/fa";

// Fallback multi-extensions pour les images
function getVariants(path) {
  const exts = [".jpg", ".jpeg", ".png", ".webp"];
  const hasExt = /\.[a-zA-Z0-9]+$/.test(path);
  const base = hasExt ? path.replace(/\.[a-zA-Z0-9]+$/, "") : path;
  const first = hasExt ? [path] : [];
  const variants = [...first, ...exts.map((ext) => `${base}${ext}`)];
  return Array.from(new Set(variants));
}
function CompatImg({ path, alt = "", className }) {
  const variants = React.useMemo(() => getVariants(path), [path]);
  const [idx, setIdx] = React.useState(0);
  const src = variants[idx];
  const onError = React.useCallback(() => {
    setIdx((i) => (i + 1 < variants.length ? i + 1 : i));
  }, [variants.length]);
  return <img className={className} src={src} alt={alt} loading="lazy" onError={onError} />;
}

// Premier hero: image nommée "hero" (extension agnostique)
const FIRST_HERO_IMAGE = "/assets/omsi/hero";

// Slides: liste sans extension (CompatImg essaie .jpg/.jpeg/.png/.webp)
const OMSI_IMAGES = [
  "/assets/omsi/screenshot1",
  "/assets/omsi/screenshot2",
  "/assets/omsi/screenshot3",
  "/assets/omsi/screenshot4",
  "/assets/omsi/screenshot5",
  "/assets/omsi/screenshot6",
];

const DISCORD_INVITE = "https://discord.gg/RbwNrX4rdu";

export default function OmsiAddon() {
  return (
    <>
      <SEO 
        title="AddOn Réseau TICE pour OMSI 2 | RétroBus Essonne"
        description="L'AddOn Réseau TICE est un DLC en cours de développement par RétroBus Essonne pour le simulateur OMSI 2. Découvrez notre projet de reconstitution virtuelle du réseau de transport TICE avec véhicules historiques authentiques."
        keywords="OMSI 2, addon, DLC, réseau TICE, simulateur bus, simulation transport, mod OMSI, addon bus, réseau virtuel, TICE simulation"
        url="https://www.association-rbe.fr/omsi-addon"
      />

      {/* HERO (single colonne): image + titre + description + CTA */}
      <Box as="section" className="full-bleed omsi-hero single">
        {/* image de fond (multi-extensions) */}
        <CompatImg className="omsi-hero__img" path={FIRST_HERO_IMAGE} alt="AddOn Réseau TICE - hero" />
        <div className="omsi-hero-inner">
          <div className="omsi-hero-copy">
            <Heading as="h1" size="2xl" className="page-title">
              AddOn Réseau TICE
            </Heading>
            <Text className="page-subtitle" style={{ color: "rgba(255,255,255,.9)" }}>
              L'AddOn Réseau TICE est un futur DLC en cours de construction par l'Association RétroBus Essonne.
              Son principe ? Rouler virtuellement sur le territoire Essonnien avec les lignes TICE, tout en
              conservant l'idée du patrimoine roulant. Son développement est en cours pour la carte, les objets
              mais aussi les véhicules.
            </Text>
            <Button
              as="a"
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              mt={6}
              bg="var(--rbe-red)"
              color="white"
              _hover={{ opacity: 0.9 }}
              leftIcon={<FaDiscord />}
            >
              Rester informé
            </Button>
          </div>
        </div>
      </Box>

      {/* Succession de heros (une section par image) */}
      {OMSI_IMAGES.map((p, idx) => (
        <Box
          as="section"
          key={idx}
          className={`full-bleed omsi-hero-slide ${idx % 2 === 0 ? "left" : "right"}`}
          aria-label={`Aperçu AddOn Réseau TICE #${idx + 1}`}
        >
          <CompatImg
            className="omsi-hero-slide__img"
            path={p}
            alt={`Capture AddOn Réseau TICE #${idx + 1}`}
          />
          <div className="omsi-hero-slide__inner">
            {/* Légende optionnelle */}
            {/* <div className="omsi-hero-slide__copy">
              <Heading as="h2" size="lg" color="white">Aperçu {idx + 1}</Heading>
              <Text color="whiteAlpha.800">Sous-titre éventuel.</Text>
            </div> */}
          </div>
        </Box>
      ))}
    </>
  );
}