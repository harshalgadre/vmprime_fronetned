// API service for frontend-backend communication

// For production, we use relative paths since frontend and backend are served from the same origin
// For development, we use the full URL to the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Admin authentication header (in a real app, this would come from a login)
const ADMIN_AUTH_HEADER = {
  'x-admin-auth': 'admin-secret-key'
};

// Product API calls
export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);
  return response.json();
};

export const getProductById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  return response.json();
};

export const createProduct = async (productData) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...ADMIN_AUTH_HEADER
    },
    body: JSON.stringify(productData)
  });
  return response.json();
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...ADMIN_AUTH_HEADER
    },
    body: JSON.stringify(productData)
  });
  return response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: ADMIN_AUTH_HEADER
  });
  return response.json();
};

// Order API calls
export const getOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: ADMIN_AUTH_HEADER
  });
  return response.json();
};

export const getOrderById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    headers: ADMIN_AUTH_HEADER
  });
  return response.json();
};

export const createOrder = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  });
  return response.json();
};

export const updateOrderStatus = async (id, status) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...ADMIN_AUTH_HEADER
    },
    body: JSON.stringify({ status })
  });
  return response.json();
};

// Contact API calls
export const submitContactForm = async (contactData) => {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contactData)
  });
  return response.json();
};

export const getContacts = async () => {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    headers: ADMIN_AUTH_HEADER
  });
  return response.json();
};