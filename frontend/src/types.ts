// Shared domain types matching the shapes returned by the backend API

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string | null;
  role: string;
  createdAt: string;
  orderCount?: number;
  cartCount?: number;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  category_slug: string;
  price: number;
  rating: number;
  description: string;
  images: string[];
  about: string[];
  specs: Record<string, string>;
  stock: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface CartItem {
  id: number; // product id
  name: string;
  price: number;
  image: string;
  stock: number;
  quantity: number;
  category: string;
}

export interface OrderItem {
  id: number | null;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: number;
  status: OrderStatus;
  address: string;
  payment_method: string;
  subtotal: number;
  tax: number;
  delivery_fee: number;
  total: number;
  created_at: string;
  items: OrderItem[];
}

export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  username: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
