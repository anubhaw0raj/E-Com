const { testConnection } = require('./config/database');

// Function to initialize database
const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');

    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    console.log('✅ Database initialization completed');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
};

module.exports = { initializeDatabase };