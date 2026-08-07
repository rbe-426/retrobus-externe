import React, { useEffect, useState } from "react";
import {
  Box, Heading, HStack, VStack, Button, Table, Thead, Tbody, Tr, Th, Td,
  Input, useToast, Tag, TagLabel, TagCloseButton, IconButton, Text, Flex
} from "@chakra-ui/react";
import { FiRefreshCw, FiTrash2, FiMail, FiPlus } from "react-icons/fi";

const API = import.meta.env.VITE_API_URL || 'https://attractive-kindness-rbe-serveurs.up.railway.app';

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const toast = useToast();

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/newsletter`);
      if (!res.ok) throw new Error("Erreur API");
      const data = await res.json();
      setSubscribers(data);
    } catch (e) {
      toast({ status: "warning", title: "Mode local", description: "Utilisation de données factices" });
      setSubscribers([
        { id: "demo1", email: "demo@example.com", status: "CONFIRMED", createdAt: new Date().toISOString() },
        { id: "demo2", email: "test@rbe.fr", status: "PENDING", createdAt: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleAdd = async () => {
    if (!newEmail.includes("@")) {
      toast({ status: "error", title: "Email invalide" });
      return;
    }
    setAdding(true);
    try {
      const res = await fetch(`${API}/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail })
      });
      if (!res.ok) throw new Error("Erreur API");
      toast({ status: "success", title: "Ajouté" });
      setNewEmail("");
      fetchSubscribers();
    } catch {
      toast({ status: "error", title: "Échec d'ajout" });
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet abonné ?")) return;
    try {
      const res = await fetch(`${API}/newsletter/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({ status: "success", title: "Supprimé" });
      setSubscribers(prev => prev.filter(s => s.id !== id));
    } catch {
      toast({ status: "error", title: "Échec suppression" });
    }
  };

  return (
    <Box p={6}>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Gestion Newsletter</Heading>
        <HStack>
          <Button
            leftIcon={<FiRefreshCw />}
            size="sm"
            onClick={fetchSubscribers}
            isLoading={loading}
            variant="outline"
          >
            Rafraîchir
          </Button>
          <Button
            leftIcon={<FiMail />}
            size="sm"
            colorScheme="blue"
            variant="solid"
            disabled
            title="À venir"
          >
            Envoyer campagne (bientôt)
          </Button>
        </HStack>
      </HStack>

      <Flex mb={6} gap={3} flexWrap="wrap" align="center">
        <Input
          placeholder="nouvel.abonne@email..."
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          maxW="280px"
        />
        <Button
          leftIcon={<FiPlus />}
          onClick={handleAdd}
          isLoading={adding}
          colorScheme="green"
        >
          Ajouter
        </Button>
        <Tag size="lg" variant="subtle" colorScheme="purple">
          <TagLabel>{subscribers.length} inscrits</TagLabel>
          {subscribers.length > 0 && (
            <TagCloseButton
              onClick={() => {
                if (confirm("Vider la liste locale affichée ? (Pas en base)")) setSubscribers([]);
              }}
            />
          )}
        </Tag>
      </Flex>

      <Box borderWidth="1px" borderRadius="lg" overflowX="auto">
        <Table size="sm">
          <Thead bg="gray.50">
            <Tr>
              <Th>Email</Th>
              <Th>Statut</Th>
              <Th>Inscription</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {subscribers.map(sub => (
              <Tr key={sub.id}>
                <Td fontWeight="semibold">{sub.email}</Td>
                <Td>
                  <Text
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="md"
                    bg={sub.status === "CONFIRMED" ? "green.100" : "yellow.100"}
                    display="inline-block"
                  >
                    {sub.status}
                  </Text>
                </Td>
                <Td fontSize="xs">
                  {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : "-"}
                </Td>
                <Td>
                  <IconButton
                    aria-label="Supprimer"
                    icon={<FiTrash2 />}
                    size="xs"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleDelete(sub.id)}
                  />
                </Td>
              </Tr>
            ))}
            {subscribers.length === 0 && !loading && (
              <Tr>
                <Td colSpan={4}>
                  <Text fontSize="sm" color="gray.500" textAlign="center" py={8}>
                    Aucun abonné pour le moment.
                  </Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      <Box mt={8} fontSize="xs" color="gray.500">
        <Text>Roadmap :</Text>
        <ul style={{ marginLeft: "16px", lineHeight: 1.5 }}>
          <li>✔ Ajout / suppression manuelle</li>
          <li>⏳ Import CSV</li>
          <li>⏳ Double opt-in (mail de confirmation)</li>
          <li>⏳ Campagnes e-mail (HelloAsso / Sendinblue / Mailjet)</li>
        </ul>
      </Box>
    </Box>
  );
}