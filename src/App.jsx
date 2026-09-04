import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import theme from "./theme.js";
import "./styles.css"; // CSS personnalisé AVANT Chakra

// Components
import Header from "./components/Header.jsx";
import EventHeader from "./components/EventHeader.jsx";
import Footer from "./components/Footer.jsx";
import TrafficTracker from "./components/TrafficTracker.jsx";

// Pages
import Home from "./pages/Home.jsx";
import EventHome from "./pages/EventHome.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/ContactDirectory.jsx";
import Vehicles from "./pages/Vehicles.jsx";
import VehicleDetails from "./pages/VehicleDetails.jsx";
import Events from "./pages/Events.jsx";
import EventRegistration from "./pages/EventRegistration.jsx";
import HelloAssoCallback from "./pages/HelloAssoCallback.jsx";
import Photos from "./pages/Photos.jsx";
import Donate from "./pages/Donate.jsx";
import RetroMerch from "./pages/RetroMerch.jsx";
import NousSoutenir from "./pages/NousSoutenir.jsx";
import Changelog from "./pages/Changelog.jsx";
import Newsletter from "./pages/Newsletter";
import Team from "./pages/Team.jsx";
import MentionsLegales from "./pages/MentionsLegales.jsx";
import RGPD from "./pages/RGPD.jsx";
import BulletinSignature from "./pages/BulletinSignature.jsx";
import MobileRedirect from "./pages/MobileRedirect.jsx";
import OmsiAddon from "./pages/OmsiAddon.jsx";
import Actualites from "./pages/Actualites.jsx";

// Event Mode
import { useEventMode } from "./utils/eventModeConfig.js";

const isDev = import.meta.env.DEV;

function ScrollToTop() {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname, location.search]);

  return null;
}

// Layout avec Header/Footer conditionnels
function Layout({ children }) {
  const location = useLocation();
  const { isActive: isEventModeActive } = useEventMode();
  const navDisclosure = useDisclosure();
  const newsletterDisclosure = useDisclosure();

  // Routes sans Header/Footer (mode standalone)
  const isStandalonePage = location.pathname.startsWith('/bulletin/sign');

  const HeaderComponent = isEventModeActive ? EventHeader : Header;

  if (isStandalonePage) {
    return children; // Pas de Header/Footer
  }

  return (
    <>
      <HeaderComponent 
        navDisclosure={navDisclosure}
        onNewsletterClick={newsletterDisclosure.onOpen}
      />
      <main 
        className="site-main"
        style={isEventModeActive ? { paddingTop: '150px' } : undefined}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const { isActive: isEventModeActive } = useEventMode();
  
  // Choisir le bon composant Home selon le mode événement
  const HomeComponent = isEventModeActive ? EventHome : Home;

  console.log('🎪 Mode événement actif:', isEventModeActive);

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <ScrollToTop />
        <TrafficTracker />
        <Layout>
          <Routes>
            <Route path="/" element={<HomeComponent />} />
            <Route path="/parc" element={<Vehicles />} />
            <Route path="/vehicles/:id" element={<VehicleDetails />} />
            <Route path="/vehicules/:id" element={<VehicleDetails />} />
            <Route path="/vehicles" element={<Navigate to="/parc" replace />} />
            <Route path="/evenements" element={<Events />} />
            <Route path="/evenement/:eventId/inscription" element={<EventRegistration />} />
            <Route path="/evenement/:eventSlug-inscription" element={<EventRegistration />} />
            <Route path="/helloasso-callback" element={<HelloAssoCallback />} />
            <Route path="/events" element={<Navigate to="/evenements" replace />} />
            <Route path="/event-registration" element={<Navigate to="/evenements" replace />} />
            <Route path="/retromerch" element={<RetroMerch />} />
            <Route path="/nous-soutenir" element={<NousSoutenir />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/photos" element={<Photos />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/team" element={<Team />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/urbex" element={<OmsiAddon />} />
            <Route path="/omsi-addon" element={<Navigate to="/urbex" replace />} />
            <Route path="/actualites" element={isDev ? <Actualites /> : <Navigate to="/" replace />} />
            <Route path="/nos-actions" element={<Navigate to={isDev ? "/actualites" : "/"} replace />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/rgpd" element={<RGPD />} />
            <Route path="/statuts.pdf" element={<MentionsLegales />} />
            <Route path="/rgpd.pdf" element={<RGPD />} />
            <Route path="/mobile/v/:parc" element={<MobileRedirect />} />
            {/* Route standalone sans Header/Footer */}
            <Route path="/bulletin/sign/:token" element={<BulletinSignature />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ChakraProvider>
  );
}
