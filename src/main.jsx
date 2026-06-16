// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { HelmetProvider } from "react-helmet-async";

// Mode événement désactivé en auto-dev
// Pour activer : aller sur /dashboard/event-mode ou créer un événement JEP

// Détection automatique du mode événement au démarrage
import('./utils/autoDetectEventMode.js').then(module => {
  module.autoDetectAndActivateEventMode();
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
