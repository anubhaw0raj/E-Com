import { Request, Response } from "express";
import { PrismaClient, OrderStatus, PaymentStatus } from "../generated/prisma/index.js";

// Initialize Prisma Client
const prisma = new PrismaClient();

interface CheckoutRequest extends Request {
  body: {
    userId: string;
    address?: string;
    paymentMethod?: string;
  };
}

interface GetOrdersRequest extends Request {
  query: {
    userId?: string;
  };
}

interface CancelOrderRequest extends Request {
  query: {
    userId?: string;
  };
  params: {
    id: string;
  };
}

interface UpdateOrderStatusRequest extends Request {
  body: {
    status: OrderStatus;
  };
  params: {
    id: string;
  };
}

// Confirm checkout and create new order
const checkout = async (req: CheckoutRequest, res: Response): Promise<Response> => {
  const { userId, address, paymentMethod = "COD" } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  if (!address) {
    return res.status(400).json({ message: "Shipping address required" });
  }

  try {
    const userIdInt = parseInt(userId);
    
    if (isNaN(userIdInt)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { user_id: userIdInt },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total amount and validate stock
    let totalAmount = 0;
    const orderItems: {
      product_id: number;
      quantity: number;
      price: any;
    }[] = [];

    for (const cartItem of cart.items) {
      const product = cartItem.product;
      
      // Check stock availability
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${cartItem.quantity}` 
        });
      }

      const itemTotal = parseFloat(product.price.toString()) * cartItem.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product_id: product.id,
        quantity: cartItem.quantity,
        price: product.price
      });
    }

    // Create order in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          user_id: userIdInt,
          total_amount: totalAmount,
          status: OrderStatus.PENDING,
          shipping_address: address,
          payment_method: paymentMethod,
          payment_status: PaymentStatus.PENDING,
          items: {
            create: orderItems
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // Update product stock
      for (const cartItem of cart.items) {
        await tx.product.update({
          where: { id: cartItem.product_id },
          data: {
            stock: {
              decrement: cartItem.quantity
            }
          }
        });
      }

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { cart_id: cart.id }
      });

      return order;
    });

    // Transform order data for response
    const transformedOrder = {
      id: result.id,
      userId: result.user_id,
      totalAmount: parseFloat(result.total_amount.toString()),
      status: result.status,
      shippingAddress: result.shipping_address,
      paymentMethod: result.payment_method,
      paymentStatus: result.payment_status,
      items: result.items.map(item => ({
        id: item.id,
        productId: item.product_id,
        name: item.product.name,
        quantity: item.quantity,
        price: parseFloat(item.price.toString()),
        total: parseFloat(item.price.toString()) * item.quantity
      })),
      createdAt: result.created_at,
      updatedAt: result.updated_at
    };

    return res.status(201).json({
      message: "Order placed successfully",
      order: transformedOrder
    });

  } catch (error: any) {
    console.error("Checkout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all orders for a user
const getOrders = async (req: GetOrdersRequest, res: Response): Promise<Response> => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  try {
    const userIdInt = parseInt(userId as string);
    
    if (isNaN(userIdInt)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const orders = await prisma.order.findMany({
      where: { user_id: userIdInt },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Transform orders data for response
    const transformedOrders = orders.map(order => ({
      id: order.id,
      userId: order.user_id,
      totalAmount: parseFloat(order.total_amount.toString()),
      status: order.status,
      shippingAddress: order.shipping_address,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.product_id,
        name: item.product.name,
        images: item.product.images,
        quantity: item.quantity,
        price: parseFloat(item.price.toString()),
        total: parseFloat(item.price.toString()) * item.quantity
      })),
      createdAt: order.created_at,
      updatedAt: order.updated_at
    }));

    return res.json(transformedOrders);
  } catch (error: any) {
    console.error("Get orders error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get a specific order by ID
const getOrderById = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  try {
    const orderId = parseInt(id);
    const userIdInt = parseInt(userId as string);
    
    if (isNaN(orderId) || isNaN(userIdInt)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        user_id: userIdInt
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
                description: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Transform order data for response
    const transformedOrder = {
      id: order.id,
      userId: order.user_id,
      totalAmount: parseFloat(order.total_amount.toString()),
      status: order.status,
      shippingAddress: order.shipping_address,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.product_id,
        name: item.product.name,
        images: item.product.images,
        description: item.product.description,
        quantity: item.quantity,
        price: parseFloat(item.price.toString()),
        total: parseFloat(item.price.toString()) * item.quantity
      })),
      createdAt: order.created_at,
      updatedAt: order.updated_at
    };

    return res.json(transformedOrder);
  } catch (error: any) {
    console.error("Get order by ID error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update order status
const updateOrderStatus = async (req: UpdateOrderStatusRequest, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const orderId = parseInt(id);
    
    if (isNaN(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    // Transform order data for response
    const transformedOrder = {
      id: updatedOrder.id,
      userId: updatedOrder.user_id,
      totalAmount: parseFloat(updatedOrder.total_amount.toString()),
      status: updatedOrder.status,
      shippingAddress: updatedOrder.shipping_address,
      paymentMethod: updatedOrder.payment_method,
      paymentStatus: updatedOrder.payment_status,
      items: updatedOrder.items.map(item => ({
        id: item.id,
        productId: item.product_id,
        name: item.product.name,
        quantity: item.quantity,
        price: parseFloat(item.price.toString()),
        total: parseFloat(item.price.toString()) * item.quantity
      })),
      createdAt: updatedOrder.created_at,
      updatedAt: updatedOrder.updated_at
    };

    return res.json({
      message: "Order status updated successfully",
      order: transformedOrder
    });
  } catch (error: any) {
    console.error("Update order status error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Cancel order (only if status is PENDING or CONFIRMED)
const cancelOrder = async (req: CancelOrderRequest, res: Response): Promise<Response> => {
  const { userId } = req.query;
  const orderId = parseInt(req.params.id);

  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  try {
    const userIdInt = parseInt(userId as string);
    
    if (isNaN(userIdInt) || isNaN(orderId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    // Find the order
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        user_id: userIdInt
      },
      include: {
        items: true
      }
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if order can be cancelled
    if (order.status === OrderStatus.DELIVERED || 
        order.status === OrderStatus.CANCELLED || 
        order.status === OrderStatus.REFUNDED) {
      return res.status(400).json({ message: "Order cannot be cancelled" });
    }

    // Cancel order in transaction
    await prisma.$transaction(async (tx) => {
      // Update order status to cancelled
      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED }
      });

      // Restore product stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.product_id },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        });
      }
    });

    return res.json({ 
      message: "Order cancelled successfully", 
      orderId 
    });
  } catch (error: any) {
    console.error("Cancel order error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Cleanup function for Prisma client
const cleanup = async (): Promise<void> => {
  await prisma.$disconnect();
};

export { checkout, getOrders, getOrderById, updateOrderStatus, cancelOrder, cleanup };