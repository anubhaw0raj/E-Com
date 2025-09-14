import {
  ApiResponse,
  ErrorResponse,
  User,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  Product,
  Category,
  CartItem,
  AddToCartRequest,
  UpdateCartItemRequest,
  ClearCartRequest,
  Order,
  CheckoutRequest,
  CheckoutResponse,
  UpdateOrderStatusRequest,
  ProductsQueryParams,
  CartQueryParams,
  OrdersQueryParams
} from './index';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message || 'An error occurred');
  }
  return response.json();
};

// Auth API calls
export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
    });
    return handleResponse<ApiResponse>(response);
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/auth/users`);
    return handleResponse<User[]>(response);
  },
};

// Products API calls
export const productsApi = {
  getProducts: async (params?: ProductsQueryParams): Promise<Product[]> => {
    const queryParams = params ? Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value != null)
    ) : {};
    const queryString = new URLSearchParams(queryParams as Record<string, string>).toString();
    const url = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url);
    return handleResponse<Product[]>(response);
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return handleResponse<Product>(response);
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/products/categories`);
    return handleResponse<Category[]>(response);
  },
};

// Cart API calls
export const cartApi = {
  getCart: async (params: CartQueryParams): Promise<CartItem[]> => {
    const queryString = new URLSearchParams(params as unknown as Record<string, string>).toString();
    const response = await fetch(`${API_BASE_URL}/cart?${queryString}`);
    return handleResponse<CartItem[]>(response);
  },

  addToCart: async (data: AddToCartRequest): Promise<CartItem[]> => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<CartItem[]>(response);
  },

  updateCartItem: async (id: number, data: UpdateCartItemRequest): Promise<CartItem[]> => {
    const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<CartItem[]>(response);
  },

  removeFromCart: async (id: number, userId: string): Promise<CartItem[]> => {
    const response = await fetch(`${API_BASE_URL}/cart/${id}?userId=${userId}`, {
      method: 'DELETE',
    });
    return handleResponse<CartItem[]>(response);
  },

  clearCart: async (data: ClearCartRequest): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse>(response);
  },
};

// Orders API calls
export const ordersApi = {
  checkout: async (data: CheckoutRequest): Promise<CheckoutResponse> => {
    const response = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<CheckoutResponse>(response);
  },

  getOrders: async (params: OrdersQueryParams): Promise<Order[]> => {
    const queryString = new URLSearchParams(params as unknown as Record<string, string>).toString();
    const response = await fetch(`${API_BASE_URL}/checkout/orders?${queryString}`);
    return handleResponse<Order[]>(response);
  },

  getOrderById: async (id: number, userId: string): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/checkout/orders/${id}?userId=${userId}`);
    return handleResponse<Order>(response);
  },

  updateOrderStatus: async (id: number, data: UpdateOrderStatusRequest): Promise<{ message: string; order: Order }> => {
    const response = await fetch(`${API_BASE_URL}/checkout/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ message: string; order: Order }>(response);
  },

  cancelOrder: async (id: number, userId: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/checkout/orders/${id}/cancel?userId=${userId}`, {
      method: 'PUT',
    });
    return handleResponse<ApiResponse>(response);
  },
};