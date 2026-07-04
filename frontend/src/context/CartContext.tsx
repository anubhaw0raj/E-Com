import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { api } from "../api/client";
import { useAuth } from "./AuthContext";
import type { CartItem } from "../types";

interface CartContextValue {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const refreshCart = useCallback(async () => {
    if (!isLoggedIn) {
      setCartItems([]);
      return;
    }
    try {
      setCartItems(await api.get<CartItem[]>("/api/cart"));
    } catch {
      setCartItems([]);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(async (productId: number, quantity = 1) => {
    setCartItems(await api.post<CartItem[]>("/api/cart", { productId, quantity }));
  }, []);

  const updateQuantity = useCallback(async (productId: number, quantity: number) => {
    setCartItems(await api.put<CartItem[]>(`/api/cart/${productId}`, { quantity }));
  }, []);

  const removeFromCart = useCallback(async (productId: number) => {
    setCartItems(await api.delete<CartItem[]>(`/api/cart/${productId}`));
  }, []);

  const clearCart = useCallback(async () => {
    setCartItems(await api.delete<CartItem[]>("/api/cart"));
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, addToCart, updateQuantity, removeFromCart, clearCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
