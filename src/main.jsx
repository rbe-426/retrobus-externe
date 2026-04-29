// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider, Center, Spinner, Box, Heading, Text, Image } from "@chakra-ui/react";
import { HelmetProvider } from "react-helmet-async";
import system from "./theme";

// Désactivation du mode événement en dev
if (import.meta.env.DEV) {
  // Supprimer le mode événement du localStorage
  localStorage.removeItem('rbe:public-event-mode');
  console.log('🎪 Mode événement désactivé');
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
