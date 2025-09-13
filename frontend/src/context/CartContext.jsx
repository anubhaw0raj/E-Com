import { createContext, useContext, useState } from "react";

// Create context
const CartContext = createContext();

// Hook for easier usage
export function useCart() {
  return useContext(CartContext);
}

// Provider
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Add product to cart
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        // Increase quantity if product already exists
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new product with quantity = 1
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // Decrease quantity or remove product
  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === productId);
      if (existingItem.quantity > 1) {
        // Decrease quantity
        return prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        // Remove completely
        return prev.filter((item) => item.id !== productId);
      }
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}