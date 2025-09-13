const { Pool } = require('pg');

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce',
  password: '',
  port: 5432,
});

// Test the connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('💡 Please ensure:');
    console.log('   - PostgreSQL is running');
    console.log('   - Database "ecommerce" exists');
    console.log('   - Username "postgres" with password "postgres" has access');
    return false;
  }
};

module.exports = { pool, testConnection };