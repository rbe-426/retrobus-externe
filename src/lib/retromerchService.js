/**
 * Service RetroMerch - Client API pour la boutique publique
 * Fournit des fonctions pour interagir avec les endpoints RétroMerch
 * Version pour la boutique externe (public)
 */

// Utiliser import.meta.env pour Vite (pas process.env)
const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/retromerch`
  : 'http://localhost:4000/api/retromerch';

/**
 * Helper pour les requêtes
 */
const makeRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
      throw new Error(error.message || `Erreur HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erreur API ${endpoint}:`, error);
    throw error;
  }
};

// ========== PRODUITS ==========

export const getProducts = async () => {
  return makeRequest('/products');
};

export const getProduct = async (id) => {
  return makeRequest(`/products/${id}`);
};

// ========== CATÉGORIES ==========

export const getCategories = async () => {
  return makeRequest('/categories');
};

// ========== COMMANDES ==========

export const getOrder = async (id) => {
  return makeRequest(`/orders/${id}`);
};

export const createOrder = async (orderData) => {
  return makeRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
};

// ========== STATISTIQUES ==========

export const getStats = async () => {
  return makeRequest('/stats');
};

export default {
  getProducts,
  getProduct,
  getCategories,
  getOrder,
  createOrder,
  getStats
};
