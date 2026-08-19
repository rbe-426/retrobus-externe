// theme.test.js - Thème de test pour tester les variantes et configurations
import { extendTheme } from '@chakra-ui/react';

const themeTest = extendTheme({
  // === TYPOGRAPHY ===
  fonts: {
    heading: 'Montserrat, system-ui, sans-serif',
    body: 'Montserrat, system-ui, sans-serif',
  },

  // === GLOBAL STYLES ===
  styles: {
    global: {
      body: {
        fontFamily: 'Montserrat, system-ui, sans-serif',
        bg: 'gray.50',
        color: 'gray.800',
      },
      '*': {
        borderColor: 'gray.200',
      },
    },
  },

  // === COLORS - VERSION TEST ===
  colors: {
    // Couleurs RBE de test (variante claire/sombre)
    rbe: {
      50: '#fff5f7',
      100: '#ffe4eb',
      200: '#ffc9d5',
      300: '#ffb3c1',
      400: '#ff99ad',
      500: '#FF6B9D', // Variante test - plus vif
      600: '#E74C8C', // Rouge test
      700: '#D4317B',
      800: '#C1166A',
      900: '#A00554',
    },
    // Palette test - bleu
    brand: {
      50: '#E3F2FD',
      100: '#BBDEFB',
      200: '#90CAF9',
      300: '#64B5F6',
      400: '#42A5F5',
      500: '#2196F3', // Bleu test
      600: '#1E88E5',
      700: '#1976D2',
      800: '#1565C0',
      900: '#0D47A1',
    },
    // Couleurs d'état
    success: {
      50: '#E8F5E9',
      100: '#C8E6C9',
      200: '#A5D6A7',
      300: '#81C784',
      400: '#66BB6A',
      500: '#4CAF50',
      600: '#43A047',
      700: '#388E3C',
      800: '#2E7D32',
      900: '#1B5E20',
    },
    warning: {
      50: '#FFF3E0',
      100: '#FFE0B2',
      200: '#FFCC80',
      300: '#FFB74D',
      400: '#FFA726',
      500: '#FF9800',
      600: '#FB8C00',
      700: '#F57C00',
      800: '#E65100',
      900: '#BF360C',
    },
    error: {
      50: '#FFEBEE',
      100: '#FFCDD2',
      200: '#EF9A9A',
      300: '#E57373',
      400: '#EF5350',
      500: '#F44336',
      600: '#E53935',
      700: '#D32F2F',
      800: '#C62828',
      900: '#B71C1C',
    },
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },

  // === SEMANTIC TOKENS ===
  semanticTokens: {
    colors: {
      primary: {
        default: 'rbe.500',
        _dark: 'rbe.400',
      },
      accent: {
        default: 'brand.500',
        _dark: 'brand.300',
      },
      text: {
        default: 'gray.800',
        _dark: 'gray.100',
      },
      bg: {
        default: 'gray.50',
        _dark: 'gray.900',
      },
    },
  },

  // === COMPOSANT SIZES ===
  sizes: {
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },

  // === SPACING ===
  space: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },

  // === RADII ===
  radii: {
    none: '0',
    sm: '0.25rem',
    base: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },

  // === COMPONENT OVERRIDES - TEST ===
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'md',
      },
      sizes: {
        xs: {
          h: '1.5rem',
          fontSize: 'xs',
          px: '0.5rem',
        },
        sm: {
          h: '2rem',
          fontSize: 'sm',
          px: '1rem',
        },
        md: {
          h: '2.5rem',
          fontSize: 'md',
          px: '1rem',
        },
        lg: {
          h: '3rem',
          fontSize: 'lg',
          px: '1.5rem',
        },
      },
      variants: {
        solid: {
          bg: 'rbe.500',
          color: 'white',
          _hover: {
            bg: 'rbe.600',
          },
          _active: {
            bg: 'rbe.700',
          },
        },
        outline: {
          borderWidth: '2px',
          borderColor: 'rbe.500',
          color: 'rbe.500',
          _hover: {
            bg: 'rbe.50',
          },
        },
        ghost: {
          color: 'rbe.500',
          _hover: {
            bg: 'rbe.100',
          },
        },
      },
      defaultProps: {
        variant: 'solid',
        size: 'md',
      },
    },
    Card: {
      baseStyle: {
        borderRadius: 'lg',
        boxShadow: 'sm',
        p: '1.5rem',
      },
    },
    Input: {
      sizes: {
        xs: {
          h: '1.75rem',
          fontSize: 'xs',
          px: '0.5rem',
        },
        sm: {
          h: '2rem',
          fontSize: 'sm',
          px: '0.75rem',
        },
        md: {
          h: '2.5rem',
          fontSize: 'md',
          px: '1rem',
        },
        lg: {
          h: '3rem',
          fontSize: 'lg',
          px: '1rem',
        },
      },
    },
  },

  // === CONFIG ===
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export default themeTest;
