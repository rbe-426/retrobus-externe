/**
 * EventHeader.jsx (EXTERNE)
 * 
 * Header spécial pour le mode événement
 * Utilise header_jep.jpg comme image de fond
 */

import "../styles.css";
import { Link as RouterLink } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Box, Button, HStack, VStack, Text, Heading, Badge,
  Container, Flex, useColorModeValue, IconButton
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import logoDefault from "../assets/rbe_logo.svg";
import Navbar from "./Navbar.jsx";
import CompatImg from "./CompatImg.jsx";
import { getEventModeConfig, EVENT_TYPES } from "../utils/eventModeConfig.js";

const LOGO_PATH = "/assets/rbe_logo.svg";
const EVENT_HEADER_BG = "/assets/header_jep.png"; // Header spécial événement

export default function EventHeader({ onNewsletterClick, navDisclosure }) {
  const [eventConfig, setEventConfig] = useState(null);
  const [helloAssoUrl, setHelloAssoUrl] = useState('https://www.helloasso.com/associations/association-retrobus-essonne/formulaires/3');
  const [siteVersion, setSiteVersion] = useState('');

  useEffect(() => {
    const config = getEventModeConfig();
    setEventConfig(config);
    
    // Charger la config générale du site
    const API_BASE = import.meta.env.VITE_API_URL || 'https://attractive-kindness-rbe-serveurs.up.railway.app';
    const candidates = [
      `${(API_BASE || '').replace(/\/$/, '')}/site-config`,
      '/site-config.json',
    ];
    (async () => {
      for (const url of candidates) {
        try {
          const res = await fetch(url, { headers: { Accept: 'application/json' } });
          if (!res.ok) continue;
          const data = await res.json();
          if (data?.helloAssoUrl) setHelloAssoUrl(String(data.helloAssoUrl));
          if (data?.siteVersion) setSiteVersion(String(data.siteVersion));
          break;
        } catch {}
      }
    })();
  }, []);

  const handleDonateClick = () => {
    window.open(helloAssoUrl || 'https://www.helloasso.com/associations/retrobus-essonne', '_blank');
  };

  const event = eventConfig?.event || {};
  const eventType = EVENT_TYPES[event.type] || EVENT_TYPES.CUSTOM;
  const registration = eventConfig?.registration || {};

  // Formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  const mainColor = event.color || '#D32F2F';
  const secondaryColor = event.secondaryColor || '#FFA000';

  return (
    <>
      <Box>
        <header 
          className="site-header event-header"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            minHeight: '110px',
            height: 'auto'
          }}
        >
          {/* Background avec header_jep */}
          <div
            className="header-bg"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${EVENT_HEADER_BG})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              opacity: 1,
              zIndex: -1,
              imageRendering: 'crisp-edges'
            }}
          />
          
          {/* Content: Menu mobile uniquement */}
          <div className="header-inner" style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ flex: 1 }}></div>
            
            {/* Mobile menu trigger */}
            <Box display={{ base: "block", md: "none" }}>
              <IconButton
                icon={<HamburgerIcon />}
                onClick={navDisclosure.onOpen}
                variant="solid"
                bg="whiteAlpha.900"
                color={mainColor}
                size="md"
                borderRadius="full"
                boxShadow="sm"
                _hover={{ bg: mainColor, color: "white" }}
                aria-label="Menu"
              />
            </Box>
          </div>
        </header>

        <Box 
          position="fixed" 
          top="1px"
          left={0}
          right={0}
          zIndex={999}
          bg="white"
        >
          <Navbar
        donateIcon={<HeartIcon />}
        newsletterIcon={<EnvelopeIcon />}
        onDonateClick={handleDonateClick}
        onNewsletterClick={onNewsletterClick}
        siteVersion={siteVersion}
        isOpen={navDisclosure.isOpen}
        onOpen={navDisclosure.onOpen}
        onClose={navDisclosure.onClose}
        embedded
        userName={(typeof window !== 'undefined' && (localStorage.getItem('prenom') || localStorage.getItem('firstName') || localStorage.getItem('firstname') || localStorage.getItem('name'))) || undefined}
      />
        </Box>
      </Box>
    </>
  );
}

// Icônes simples
const HeartIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--rbe-red)" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.59 4.81 14.26 4 16 4 18.5 4 20.5 6 20.5 8.5c0 3.78-3.4 6.86-8.05 11.54L12 21.35z"/>
  </svg>
);

const EnvelopeIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--rbe-red)" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v.4L12 12 3 6.4V6Zm0 2.8V18c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.8l-9.3 5.7a1 1 0 0 1-1.05 0L3 8.8Z"/>
  </svg>
);
