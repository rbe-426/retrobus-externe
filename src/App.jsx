import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.js";
import "./styles.css"; // CSS personnalisé AVANT Chakra

// Components
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

// Pages
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Vehicles from "./pages/Vehicles.jsx";
import VehicleDetails from "./pages/VehicleDetails.jsx";
import Events from "./pages/Events.jsx";
import EventRegistration from "./pages/EventRegistration.jsx";
import HelloAssoCallback from "./pages/HelloAssoCallback.jsx";
import Photos from "./pages/Photos.jsx";
import Donate from "./pages/Donate.jsx";
import RetroMerch from "./pages/RetroMerch.jsx";
import Changelog from "./pages/Changelog.jsx";
import Newsletter from "./pages/Newsletter";
import Team from "./pages/Team.jsx";
import MentionsLegales from "./pages/MentionsLegales.jsx";
import RGPD from "./pages/RGPD.jsx";

const isDev = import.meta.env.DEV; // true en dev, false en prod

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Header />
        <main className="site-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/parc" element={<Vehicles />} />
            <Route path="/vehicles/:id" element={<VehicleDetails />} />
            <Route path="/vehicles" element={<Navigate to="/parc" replace />} />
            <Route path="/evenements" element={<Events />} />
            <Route path="/evenement/:eventId/inscription" element={<EventRegistration />} />
            <Route path="/helloasso-callback" element={<HelloAssoCallback />} />
            <Route path="/events" element={<Navigate to="/evenements" replace />} />
            <Route path="/event-registration" element={<Navigate to="/evenements" replace />} />
            <Route path="/retromerch" element={<RetroMerch />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/photos" element={<Photos />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/changelog" element={<Changelog />} />
            {isDev && <Route path="/team" element={<Team />} />}
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/rgpd" element={<RGPD />} />
            <Route path="/statuts.pdf" element={<MentionsLegales />} />
            <Route path="/rgpd.pdf" element={<RGPD />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </ChakraProvider>
  );
}
