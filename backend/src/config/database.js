const sql = require('mssql');
const config = require('../../config/database');

let pool;

const connectDB = async () => {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log('✅ Database connected successfully');
    }
    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return pool;
};

const closeDB = async () => {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('🔌 Database connection closed');
    }
  } catch (error) {
    console.error('Error closing database connection:', error.message);
  }
};

module.exports = {
  connectDB,
  getPool,
  closeDB,
  sql
};
