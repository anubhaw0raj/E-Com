import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/index.js";

// Initialize Prisma Client
const prisma = new PrismaClient();

interface GetCartRequest extends Request {
  query: {
    userId?: string;
  };
}

interface AddToCartRequest extends Request {
  body: {
    userId: string;
    productId: number;
    quantity?: number;
  };
}

interface UpdateCartItemRequest extends Request {
  body: {
    userId: string;
    quantity: number;
  };
  params: {
    id: string;
  };
}

interface RemoveFromCartRequest extends Request {
  query: {
    userId?: string;
  };
  params: {
    id: string;
  };
}

// Helper function to get or create cart for user
const getOrCreateCart = async (userId: number) => {
  let cart = await prisma.cart.findUnique({
    where: { user_id: userId }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { user_id: userId }
    });
  }

  return cart;
};

// Get all cart items for a user
const getCart = async (req: GetCartRequest, res: Response): Promise<Response> => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  try {
    const userIdInt = parseInt(userId);
    
    if (isNaN(userIdInt)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Get or create cart for user
    const cart = await getOrCreateCart(userIdInt);

    // Get all cart items with product details
    const cartItems = await prisma.cartItem.findMany({
      where: { cart_id: cart.id },
      include: {
        product: {
          include: {
            category: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    // Transform data to match expected frontend format
    const transformedCartItems = cartItems.map(item => ({
      id: item.product.id,
      name: item.product.name,
      category: item.product.category.name,
      price: parseFloat(item.product.price.toString()),
      rating: parseFloat(item.product.rating.toString()),
      description: item.product.description,
      images: item.product.images,
      about: item.product.about,
      specs: item.product.specs,
      stock: item.product.stock,
      quantity: item.quantity,
      cartItemId: item.id
    }));

    return res.json(transformedCartItems);
  } catch (error: any) {
    console.error("Get cart error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Add product to cart
const addToCart = async (req: AddToCartRequest, res: Response): Promise<Response> => {
  const { userId, productId, quantity = 1 } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  try {
    const userIdInt = parseInt(userId);
    
    if (isNaN(userIdInt)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if there's enough stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Get or create cart for user
    const cart = await getOrCreateCart(userIdInt);

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        cart_id_product_id: {
          cart_id: cart.id,
          product_id: productId
        }
      }
    });

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity }
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cart_id: cart.id,
          product_id: productId,
          quantity
        }
      });
    }

    // Return updated cart
    const cartItems = await prisma.cartItem.findMany({
      where: { cart_id: cart.id },
      include: {
        product: {
          include: {
            category: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    const transformedCartItems = cartItems.map(item => ({
      id: item.product.id,
      name: item.product.name,
      category: item.product.category.name,
      price: parseFloat(item.product.price.toString()),
      rating: parseFloat(item.product.rating.toString()),
      description: item.product.description,
      images: item.product.images,
      about: item.product.about,
      specs: item.product.specs,
      stock: item.product.stock,
      quantity: item.quantity,
      cartItemId: item.id
    }));

    return res.json(transformedCartItems);
  } catch (error: any) {
    console.error("Add to cart error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update cart item quantity
const updateCartItem = async (req: UpdateCartItemRequest, res: Response): Promise<Response> => {
  const { userId, quantity } = req.body;
  const cartItemId = parseInt(req.params.id);

  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  try {
    const userIdInt = parseInt(userId);
    
    if (isNaN(userIdInt) || isNaN(cartItemId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    // Get user's cart
    const cart = await getOrCreateCart(userIdInt);

    // Find the cart item
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart_id: cart.id
      },
      include: {
        product: true
      }
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (quantity <= 0) {
      // Remove item from cart
      await prisma.cartItem.delete({
        where: { id: cartItemId }
      });
    } else {
      // Check stock availability
      if (cartItem.product.stock < quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      // Update quantity
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity }
      });
    }

    // Return updated cart
    const cartItems = await prisma.cartItem.findMany({
      where: { cart_id: cart.id },
      include: {
        product: {
          include: {
            category: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    const transformedCartItems = cartItems.map(item => ({
      id: item.product.id,
      name: item.product.name,
      category: item.product.category.name,
      price: parseFloat(item.product.price.toString()),
      rating: parseFloat(item.product.rating.toString()),
      description: item.product.description,
      images: item.product.images,
      about: item.product.about,
      specs: item.product.specs,
      stock: item.product.stock,
      quantity: item.quantity,
      cartItemId: item.id
    }));

    return res.json(transformedCartItems);
  } catch (error: any) {
    console.error("Update cart item error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Remove product from cart
const removeFromCart = async (req: RemoveFromCartRequest, res: Response): Promise<Response> => {
  const { userId } = req.query;
  const cartItemId = parseInt(req.params.id);

  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  try {
    const userIdInt = parseInt(userId as string);
    
    if (isNaN(userIdInt) || isNaN(cartItemId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    // Get user's cart
    const cart = await getOrCreateCart(userIdInt);

    // Find and delete the cart item
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart_id: cart.id
      }
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId }
    });

    // Return updated cart
    const cartItems = await prisma.cartItem.findMany({
      where: { cart_id: cart.id },
      include: {
        product: {
          include: {
            category: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    const transformedCartItems = cartItems.map(item => ({
      id: item.product.id,
      name: item.product.name,
      category: item.product.category.name,
      price: parseFloat(item.product.price.toString()),
      rating: parseFloat(item.product.rating.toString()),
      description: item.product.description,
      images: item.product.images,
      about: item.product.about,
      specs: item.product.specs,
      stock: item.product.stock,
      quantity: item.quantity,
      cartItemId: item.id
    }));

    return res.json(transformedCartItems);
  } catch (error: any) {
    console.error("Remove from cart error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Clear entire cart for a user
const clearCart = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  try {
    const userIdInt = parseInt(userId);
    
    if (isNaN(userIdInt)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { user_id: userIdInt }
    });

    if (cart) {
      // Delete all cart items
      await prisma.cartItem.deleteMany({
        where: { cart_id: cart.id }
      });
    }

    return res.json({ message: "Cart cleared successfully" });
  } catch (error: any) {
    console.error("Clear cart error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Cleanup function for Prisma client
const cleanup = async (): Promise<void> => {
  await prisma.$disconnect();
};

export { getCart, addToCart, updateCartItem, removeFromCart, clearCart, cleanup };