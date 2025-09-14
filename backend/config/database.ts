import { PrismaClient } from '../generated/prisma/index.js';

// Prisma Client instance for database operations
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Test Prisma connection
const testPrismaConnection = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database via Prisma');
    return true;
  } catch (error: any) {
    console.error('❌ Prisma connection error:', error.message);
    return false;
  }
};

// Initialize database connections
const initializeDatabase = async (): Promise<boolean> => {
  console.log('🔄 Initializing database connections...');
  
  const prismaConnected = await testPrismaConnection();
  
  if (prismaConnected) {
    console.log('✅ All database connections established successfully');
    return true;
  } else {
    console.error('❌ Failed to establish database connections');
    return false;
  }
};

// Cleanup function to close all connections
const cleanup = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log('✅ Database connections closed');
  } catch (error: any) {
    console.error('❌ Error closing database connections:', error.message);
  }
};

export { 
  prisma, 
  testPrismaConnection, 
  initializeDatabase, 
  cleanup 
};