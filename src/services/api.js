// API service for frontend-backend communication

// API base URL configuration
// In development: VITE_API_URL should be set to http://localhost:5000/api
// In production: VITE_API_URL should be set to https://vmptime-backend.onrender.com/api
// Fallback: /api (for proxy setups)
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://vmptime-backend.onrender.com/api' : '/api');

// Admin authentication header (in a real app, this would come from a login)
const ADMIN_AUTH_HEADER = {
  'x-admin-auth': 'admin-secret-key'
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  // Check if the response is OK
  if (!response.ok) {
    // Try to parse the error response
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.text();
      // If it's HTML (like a 404 page), don't include it in the error
      if (!errorData.startsWith('<!DOCTYPE html>')) {
        errorMessage = errorData || errorMessage;
      }
    } catch (e) {
      // If parsing fails, use the default error message
    }
    throw new Error(errorMessage);
  }
  
  // For DELETE requests that might not return JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    // Return text or empty object for non-JSON responses
    try {
      return await response.text();
    } catch {
      return {};
    }
  }
};

// Product API calls
export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);
  return handleResponse(response);
};

export const getProductById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  return handleResponse(response);
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
  return handleResponse(response);
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
  return handleResponse(response);
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: ADMIN_AUTH_HEADER
  });
  return handleResponse(response);
};

// Order API calls
export const getOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: ADMIN_AUTH_HEADER
  });
  return handleResponse(response);
};

export const getOrderById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    headers: ADMIN_AUTH_HEADER
  });
  return handleResponse(response);
};

export const createOrder = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  });
  return handleResponse(response);
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
  return handleResponse(response);
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
  return handleResponse(response);
};

export const getContacts = async () => {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    headers: ADMIN_AUTH_HEADER
  });
  return handleResponse(response);
};