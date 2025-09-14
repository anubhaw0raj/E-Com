// Base response interfaces
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
}

export interface ErrorResponse {
  message: string;
}

// User related models
export interface User {
  id: number;
  email: string;
  username: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

// Product related models
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  description: string;
  images: string[];
  about: string[];
  specs: Record<string, any>; // JSON object
  stock: number;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

// Cart related models
export interface CartItem extends Product {
  quantity: number;
  cartItemId: number;
}

export interface AddToCartRequest {
  userId: string;
  productId: number;
  quantity?: number;
}

export interface UpdateCartItemRequest {
  userId: string;
  quantity: number;
}

export interface ClearCartRequest {
  userId: string;
}

// Order related models
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface OrderItem {
  id: number;
  productId: number;
  name: string;
  images?: string[];
  description?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: any; // JSON object
  paymentMethod: string | null;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutRequest {
  userId: string;
  address: any;
  paymentMethod?: string;
}

export interface CheckoutResponse {
  message: string;
  order: Order;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// API Query parameters
export interface ProductsQueryParams {
  category?: string;
  search?: string;
  limit?: string;
  offset?: string;
}

export interface CartQueryParams {
  userId: string;
}

export interface OrdersQueryParams {
  userId: string;
}

// Generic utility types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Address interface for shipping
export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber?: string;
}