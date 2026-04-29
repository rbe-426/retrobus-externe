// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider, Center, Spinner, Box, Heading, Text, Image } from "@chakra-ui/react";
import { HelmetProvider } from "react-helmet-async";
import system from "./theme";

// Activation du mode événement en dev
if (import.meta.env.DEV) {
  import('./utils/activateDevEventMode.js').then(module => {
    console.log('🎪 Module mode événement chargé');
    // Auto-activer le mode événement pour le dev
    // module.activateJEPEventMode();
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <ChakraProvider theme={system}>
        <App />
      </ChakraProvider>
    </HelmetProvider>
  </React.StrictMode>
);
