import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types/product';

interface CartItem {
  product: Product;
  color: {
    name: string;
    color: string;
  };
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, color: { name: string; color: string }, quantity: number) => void;
  removeFromCart: (product: Product, color: { name: string; color: string }) => void;
  updateQuantity: (product: Product, color: { name: string; color: string }, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initial render
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Calculate cart count
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (product: Product, color: { name: string; color: string }, quantity: number) => {
    setCart(prevCart => {
      // Check if item already exists in cart (same product and color)
      const existingItemIndex = prevCart.findIndex(
        item => item.product._id === product._id && item.color.name === color.name
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new item to cart
        return [...prevCart, { product, color, quantity }];
      }
    });
  };

  const removeFromCart = (product: Product, color: { name: string; color: string }) => {
    setCart(prevCart => 
      prevCart.filter(item => 
        !(item.product._id === product._id && item.color.name === color.name)
      )
    );
  };

  const updateQuantity = (product: Product, color: { name: string; color: string }, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(product, color);
      return;
    }

    setCart(prevCart => 
      prevCart.map(item => 
        item.product._id === product._id && item.color.name === color.name
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};