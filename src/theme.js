// src/theme.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "'Montserrat', system-ui, sans-serif",
    body: "'Montserrat', system-ui, sans-serif",
  },
  styles: {
    global: {
      ":root": {
        "--header-h": "110px",
        "--nav-h": "56px",
      },
    },
  },
});

export default theme;
