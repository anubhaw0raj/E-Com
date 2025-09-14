import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/index.js";

// Initialize Prisma Client
const prisma = new PrismaClient();

interface GetProductsRequest extends Request {
  query: {
    category?: string;
    search?: string;
    limit?: string;
    offset?: string;
  };
}

interface GetProductByIdRequest extends Request {
  params: {
    id: string;
  };
}

const getProducts = async (req: GetProductsRequest, res: Response): Promise<Response> => {
  try {
    const { category, search, limit, offset } = req.query;
    
    // Build where clause for filtering
    const where: any = {};
    
    // Filter by category if provided
    if (category && category.toLowerCase() !== "all") {
      const categoryRecord = await prisma.category.findFirst({
        where: { name: { contains: category, mode: 'insensitive' } }
      });
      if (categoryRecord) {
        where.category_id = categoryRecord.id;
      }
    }
    
    // Search functionality
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Pagination
    const take = limit ? parseInt(limit) : undefined;
    const skip = offset ? parseInt(offset) : undefined;
    
    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      take,
      skip
    });
    
    // Transform data to match expected frontend format
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category.name,
      price: parseFloat(product.price.toString()),
      rating: parseFloat(product.rating.toString()),
      description: product.description,
      images: product.images,
      about: product.about,
      specs: product.specs,
      stock: product.stock
    }));
    
    return res.json(transformedProducts);
  } catch (error: any) {
    console.error("Get products error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getProductById = async (req: GetProductByIdRequest, res: Response): Promise<Response> => {
  try {
    const productId = parseInt(req.params.id);
    
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    });
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Transform data to match expected frontend format
    const transformedProduct = {
      id: product.id,
      name: product.name,
      category: product.category.name,
      price: parseFloat(product.price.toString()),
      rating: parseFloat(product.rating.toString()),
      description: product.description,
      images: product.images,
      about: product.about,
      specs: product.specs,
      stock: product.stock
    };
    
    return res.json(transformedProduct);
  } catch (error: any) {
    console.error("Get product by ID error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all categories
const getCategories = async (req: Request, res: Response): Promise<Response> => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    return res.json(categories);
  } catch (error: any) {
    console.error("Get categories error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Cleanup function for Prisma client
const cleanup = async (): Promise<void> => {
  await prisma.$disconnect();
};

export { getProducts, getProductById, getCategories, cleanup };