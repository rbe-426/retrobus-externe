import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Grid,
  GridItem,
  Image,
  Card,
  CardBody,
  CardFooter,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Spinner,
  Flex,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react";
import { FiShoppingCart, FiX, FiMinus, FiPlus } from "react-icons/fi";

export default function RetroMerch() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen: isCartOpen, onOpen: onCartOpen, onClose: onCartClose } = useDisclosure();
  const { isOpen: isCheckoutOpen, onOpen: onCheckoutOpen, onClose: onCheckoutClose } = useDisclosure();
  const toast = useToast();

  // Charger les produits et catégories
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/retromerch/products`),
        fetch(`${import.meta.env.VITE_API_URL}/api/retromerch/categories`),
      ]);

      if (productsRes.ok && categoriesRes.ok) {
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        setProducts(productsData.filter((p) => p.active));
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error("Erreur chargement boutique:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits",
        status: "error",
        duration: 3,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les produits
  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((p) => p.categoryId === selectedCategory);

  // Ajouter au panier
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.productId === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ]);
    }
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté`,
      status: "success",
      duration: 2,
      isClosable: true,
    });
  };

  // Modifier quantité
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Retirer du panier
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  // Calculer le total
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Soumettre la commande
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast({
        title: "Panier vide",
        description: "Veuillez ajouter des produits avant de commander",
        status: "warning",
        duration: 3,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData(e.target);

      const orderData = {
        customerName: formData.get("name"),
        customerEmail: formData.get("email"),
        customerPhone: formData.get("phone"),
        shippingAddress: formData.get("address"),
        items: cart,
        totalAmount: totalPrice,
        notes: formData.get("notes"),
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/retromerch/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        toast({
          title: "Commande créée!",
          description: "Votre commande a été reçue avec succès",
          status: "success",
          duration: 3,
          isClosable: true,
        });
        setCart([]);
        onCheckoutClose();
        e.target.reset();
      } else {
        throw new Error("Erreur lors de la création de la commande");
      }
    } catch (error) {
      console.error("Erreur commande:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la commande",
        status: "error",
        duration: 3,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>RétroMerch - La boutique RétroBus Essonne</title>
        <meta name="description" content="Boutique officielle de RétroBus Essonne - Produits rétro et vintage." />
      </Helmet>

      <Container maxW="container.xl" py={10}>
        <VStack spacing={8} align="stretch">
          {/* En-tête */}
          <Flex justify="space-between" align="center">
            <VStack align="flex-start" spacing={2}>
              <Heading as="h1" size="2xl">
                RétroMerch
              </Heading>
              <Text color="gray.600" fontSize="lg">
                La boutique officielle de RétroBus Essonne
              </Text>
            </VStack>
            <Button
              leftIcon={<Icon as={FiShoppingCart} />}
              colorScheme="red"
              size="lg"
              onClick={onCartOpen}
              position="relative"
            >
              Panier ({totalItems})
            </Button>
          </Flex>

          {/* Filtres */}
          {!isLoading && (
            <HStack spacing={4} overflowX="auto" pb={2}>
              <Button
                variant={selectedCategory === "all" ? "solid" : "outline"}
                colorScheme="red"
                onClick={() => setSelectedCategory("all")}
              >
                Tous les produits
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "solid" : "outline"}
                  colorScheme="red"
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </Button>
              ))}
            </HStack>
          )}

          {/* Grille de produits */}
          {isLoading ? (
            <Flex justify="center" py={20}>
              <Spinner size="xl" color="red.500" />
            </Flex>
          ) : filteredProducts.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Text fontSize="lg" color="gray.500">
                Aucun produit disponible dans cette catégorie
              </Text>
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {filteredProducts.map((product) => (
                <Card key={product.id} borderRadius="lg" overflow="hidden" boxShadow="md">
                  <CardBody p={0}>
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        h="250px"
                        w="100%"
                        objectFit="cover"
                      />
                    ) : (
                      <Box bg="gray.200" h="250px" display="flex" alignItems="center" justifyContent="center">
                        <Text color="gray.500">Pas d'image</Text>
                      </Box>
                    )}
                  </CardBody>

                  <CardBody>
                    <VStack align="flex-start" spacing={2}>
                      <Heading size="md" noOfLines={2}>
                        {product.name}
                      </Heading>
                      <Text color="gray.600" noOfLines={2} fontSize="sm">
                        {product.description}
                      </Text>
                      <HStack w="100%" justify="space-between">
                        <Heading size="lg" color="red.500">
                          {product.price.toFixed(2)}€
                        </Heading>
                        <Badge colorScheme={product.stock > 0 ? "green" : "red"}>
                          {product.stock > 0 ? `${product.stock} en stock` : "Rupture"}
                        </Badge>
                      </HStack>
                    </VStack>
                  </CardBody>

                  <CardFooter>
                    <Button
                      w="100%"
                      colorScheme="red"
                      onClick={() => addToCart(product)}
                      isDisabled={product.stock === 0}
                    >
                      Ajouter au panier
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>

      {/* Modal Panier */}
      <Modal isOpen={isCartOpen} onClose={onCartClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mon panier ({totalItems})</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {cart.length === 0 ? (
              <Text color="gray.500" textAlign="center" py={8}>
                Votre panier est vide
              </Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {cart.map((item) => (
                  <HStack key={item.productId} p={3} bg="gray.50" borderRadius="md" justify="space-between">
                    <HStack spacing={3} flex={1}>
                      {item.image && (
                        <Image src={item.image} alt={item.name} h="60px" w="60px" objectFit="cover" borderRadius="md" />
                      )}
                      <VStack align="flex-start" spacing={1}>
                        <Text fontWeight="bold">{item.name}</Text>
                        <Text color="gray.600">{item.price.toFixed(2)}€</Text>
                      </VStack>
                    </HStack>
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Icon as={FiMinus} />
                      </Button>
                      <Text fontWeight="bold" w="40px" textAlign="center">
                        {item.quantity}
                      </Text>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Icon as={FiPlus} />
                      </Button>
                      <Button size="sm" colorScheme="red" variant="ghost" onClick={() => removeFromCart(item.productId)}>
                        <Icon as={FiX} />
                      </Button>
                    </HStack>
                  </HStack>
                ))}
                <Box pt={4} borderTop="1px solid" borderColor="gray.200">
                  <HStack justify="space-between" mb={4}>
                    <Text fontWeight="bold" fontSize="lg">
                      Total:
                    </Text>
                    <Text fontWeight="bold" fontSize="lg" color="red.500">
                      {totalPrice.toFixed(2)}€
                    </Text>
                  </HStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCartClose}>
              Fermer
            </Button>
            <Button
              colorScheme="red"
              isDisabled={cart.length === 0}
              onClick={() => {
                onCartClose();
                onCheckoutOpen();
              }}
            >
              Passer la commande
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Formulaire de commande */}
      <Modal isOpen={isCheckoutOpen} onClose={onCheckoutClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmer votre commande</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmitOrder}>
            <ModalBody>
              <VStack spacing={4}>
                {/* Récapitulatif */}
                <Box w="100%" p={3} bg="gray.50" borderRadius="md">
                  <Text fontWeight="bold" mb={2}>
                    Récapitulatif ({totalItems} article{totalItems > 1 ? "s" : ""})
                  </Text>
                  {cart.map((item) => (
                    <HStack key={item.productId} justify="space-between" fontSize="sm">
                      <Text>
                        {item.name} x{item.quantity}
                      </Text>
                      <Text>{(item.price * item.quantity).toFixed(2)}€</Text>
                    </HStack>
                  ))}
                  <HStack justify="space-between" fontWeight="bold" pt={2} borderTop="1px solid" borderColor="gray.200">
                    <Text>Total:</Text>
                    <Text color="red.500">{totalPrice.toFixed(2)}€</Text>
                  </HStack>
                </Box>

                {/* Formulaire */}
                <FormControl isRequired>
                  <FormLabel>Nom complet</FormLabel>
                  <Input name="name" placeholder="Jean Dupont" />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input name="email" type="email" placeholder="jean@example.com" />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Téléphone</FormLabel>
                  <Input name="phone" placeholder="06 12 34 56 78" />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Adresse de livraison</FormLabel>
                  <Textarea name="address" placeholder="123 Rue de la Paix, 91000 Évry" rows={3} />
                </FormControl>

                <FormControl>
                  <FormLabel>Notes (optionnel)</FormLabel>
                  <Textarea name="notes" placeholder="Demandes spéciales..." rows={2} />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onCheckoutClose} isDisabled={isSubmitting}>
                Annuler
              </Button>
              <Button colorScheme="red" type="submit" isLoading={isSubmitting}>
                Confirmer la commande
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
