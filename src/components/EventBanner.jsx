import React from 'react';
import {
  Box,
  Text,
  Flex,
  Badge,
  Link,
  HStack,
  Icon
} from '@chakra-ui/react';
import { FiCalendar, FiMapPin, FiExternalLink } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { formatDateFrLong, formatDateTimeFullFr } from '../utils/dateFormat.js';

// Thèmes de couleurs selon le type d'événement
const getEventTheme = (eventTitle) => {
  const title = eventTitle.toLowerCase();
  
  if (title.includes('halloween') || title.includes('horror')) {
    return {
      bg: 'linear-gradient(135deg, #ff6b35, #f7931e)',
      color: 'white',
      icon: '🎃',
      badgeColor: 'orange'
    };
  }
  
  if (title.includes('noël') || title.includes('christmas') || title.includes('hiver')) {
    return {
      bg: 'linear-gradient(135deg, #e53e3e, #38a169)',
      color: 'white',
      icon: '🎄',
      badgeColor: 'red'
    };
  }
  
  if (title.includes('été') || title.includes('summer') || title.includes('plage')) {
    return {
      bg: 'linear-gradient(135deg, #fbd38d, #f6ad55)',
      color: 'white',
      icon: '☀️',
      badgeColor: 'yellow'
    };
  }
  
  if (title.includes('vintage') || title.includes('rétro') || title.includes('classic')) {
    return {
      bg: 'linear-gradient(135deg, #805ad5, #553c9a)',
      color: 'white',
      icon: '🚌',
      badgeColor: 'purple'
    };
  }
  
  // Thème par défaut
  return {
    bg: 'linear-gradient(135deg, #4299e1, #3182ce)',
    color: 'white',
    icon: '🎪',
    badgeColor: 'blue'
  };
};

const EventBanner = ({ events }) => {
  if (!events || events.length === 0) return null;

  // Prendre le prochain événement ou le plus récent
  const event = events[0];
  const theme = getEventTheme(event.title);
  
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  const formattedDate = formatDateTimeFullFr(event.date, event.time);

  return (
    <Box
      position="relative"
      bg={theme.bg}
      color={theme.color}
      borderRadius="xl"
      p={4}
      mb={6}
      boxShadow="lg"
      border="2px solid"
      borderColor="whiteAlpha.300"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'xl'
      }}
      transition="all 0.3s ease"
    >
      {/* Badge d'état */}
      <Badge
        position="absolute"
        top={-2}
        right={-2}
        colorScheme={theme.badgeColor}
        variant="solid"
        fontSize="xs"
        px={2}
        py={1}
        borderRadius="full"
      >
        {isUpcoming ? 'À venir' : 'Participé'}
      </Badge>

      <Flex align="center" justify="space-between">
        <Flex align="center" flex={1}>
          {/* Icône thématique */}
          <Text fontSize="2xl" mr={3}>
            {theme.icon}
          </Text>
          
          <Box flex={1}>
            <Flex align="center" mb={1}>
              <Text fontWeight="bold" fontSize="lg" mr={2}>
                Ce véhicule participe à
              </Text>
              <Text 
                fontWeight="black" 
                fontSize="xl" 
                textDecoration="underline"
                textUnderlineOffset="2px"
              >
                {event.title}
              </Text>
            </Flex>
            
            <HStack spacing={4} fontSize="sm" opacity={0.9}>
              <Flex align="center">
                <Icon as={FiCalendar} mr={1} />
                <Text>{formattedDate}</Text>
                {event.time && <Text ml={1}>à {event.time}</Text>}
              </Flex>
              
              {event.location && (
                <Flex align="center">
                  <Icon as={FiMapPin} mr={1} />
                  <Text>{event.location}</Text>
                </Flex>
              )}
            </HStack>
          </Box>
        </Flex>

        {/* Lien vers l'événement */}
        <Link
          as={RouterLink}
          to={`/evenement/${event.id}`}
          bg="whiteAlpha.200"
          px={3}
          py={2}
          borderRadius="md"
          fontSize="sm"
          fontWeight="semibold"
          _hover={{
            bg: 'whiteAlpha.300',
            textDecoration: 'none'
          }}
          transition="all 0.2s"
          display="flex"
          alignItems="center"
        >
          Voir l'événement
          <Icon as={FiExternalLink} ml={1} />
        </Link>
      </Flex>

      {/* Message d'encouragement pour les événements à venir */}
      {isUpcoming && (
        <Text fontSize="xs" mt={2} opacity={0.8} fontStyle="italic">
          ✨ Venez nombreux découvrir ce véhicule d'exception lors de cet événement !
        </Text>
      )}
    </Box>
  );
};

export default EventBanner;