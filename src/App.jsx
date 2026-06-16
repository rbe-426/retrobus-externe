import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import theme from "./theme.js";
import "./styles.css"; // CSS personnalisé AVANT Chakra

// Components
const Header = lazy(() => import("./components/Header.jsx"));
const EventHeader = lazy(() => import("./components/EventHeader.jsx"));
const Footer = lazy(() => import("./components/Footer.jsx"));

// Pages
const Home = lazy(() => import("./pages/Home.jsx"));
const EventHome = lazy(() => import("./pages/EventHome.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Vehicles = lazy(() => import("./pages/Vehicles.jsx"));
const VehicleDetails = lazy(() => import("./pages/VehicleDetails.jsx"));
const Events = lazy(() => import("./pages/Events.jsx"));
const EventRegistration = lazy(() => import("./pages/EventRegistration.jsx"));
const HelloAssoCallback = lazy(() => import("./pages/HelloAssoCallback.jsx"));
const Photos = lazy(() => import("./pages/Photos.jsx"));
const Donate = lazy(() => import("./pages/Donate.jsx"));
const RetroMerch = lazy(() => import("./pages/RetroMerch.jsx"));
const NousSoutenir = lazy(() => import("./pages/NousSoutenir.jsx"));
const Changelog = lazy(() => import("./pages/Changelog.jsx"));
const Newsletter = lazy(() => import("./pages/Newsletter"));
const Team = lazy(() => import("./pages/Team.jsx"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales.jsx"));
const RGPD = lazy(() => import("./pages/RGPD.jsx"));
const BulletinSignature = lazy(() => import("./pages/BulletinSignature.jsx"));

// Event Mode
import { useEventMode } from "./utils/eventModeConfig.js";

const isDev = import.meta.env.DEV; // true en dev, false en prod

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
      <Suspense fallback={null}>
        <HeaderComponent 
          navDisclosure={navDisclosure}
          onNewsletterClick={newsletterDisclosure.onOpen}
        />
      </Suspense>
      <main 
        className="site-main"
        style={isEventModeActive ? { paddingTop: '150px' } : undefined}
      >
        {children}
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
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
        <Layout>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<HomeComponent />} />
              <Route path="/parc" element={<Vehicles />} />
              <Route path="/vehicles/:id" element={<VehicleDetails />} />
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
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/rgpd" element={<RGPD />} />
              <Route path="/statuts.pdf" element={<MentionsLegales />} />
              <Route path="/rgpd.pdf" element={<RGPD />} />
              {/* Route standalone sans Header/Footer */}
              <Route path="/bulletin/sign/:token" element={<BulletinSignature />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </ChakraProvider>
  );
}
