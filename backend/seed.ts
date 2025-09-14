import { PrismaClient } from './generated/prisma/index.js';
import products from './data/products';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data (in development only)
    console.log('🗑️  Clearing existing data...');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.users.deleteMany();

    // Create categories
    console.log('📝 Creating categories...');
    const categoryMap = new Map();
    const uniqueCategories = [...new Set(products.map(p => p.category.toLowerCase()))];
    
    for (const categoryName of uniqueCategories) {
      const category = await prisma.category.create({
        data: {
          name: categoryName,
          description: `Products in the ${categoryName} category`
        }
      });
      categoryMap.set(categoryName, category.id);
      console.log(`✅ Created category: ${categoryName}`);
    }

    // Create products
    console.log('📦 Creating products...');
    for (const product of products) {
      const categoryId = categoryMap.get(product.category.toLowerCase());
      
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          rating: product.rating,
          images: product.images,
          about: product.about,
          specs: product.specs,
          stock: Math.floor(Math.random() * 100) + 10, // Random stock between 10-110
          category_id: categoryId
        }
      });
      console.log(`✅ Created product: ${product.name}`);
    }

    // Create a test user
    console.log('👤 Creating test user...');
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const testUser = await prisma.users.create({
      data: {
        email: 'test@example.com',
        username: 'testuser',
        password: hashedPassword
      }
    });
    console.log(`✅ Created test user: ${testUser.username}`);

    // Create a cart for the test user
    console.log('🛒 Creating test cart...');
    const testCart = await prisma.cart.create({
      data: {
        user_id: testUser.id
      }
    });
    console.log(`✅ Created cart for user: ${testUser.username}`);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Categories: ${uniqueCategories.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Users: 1 (test user)`);
    console.log(`   - Carts: 1`);
    console.log('\n🔑 Test user credentials:');
    console.log(`   Email: test@example.com`);
    console.log(`   Username: testuser`);
    console.log(`   Password: password123`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });