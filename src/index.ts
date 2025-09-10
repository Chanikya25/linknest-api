import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import pool from './db'; // <-- IMPORT THE DATABASE POOL

dotenv.config();
console.log("✅ Application is starting...");

// This new function will test the database connection
const testDbConnection = async () => {
  try {
    console.log("🟡 Trying to connect to the database...");
    const client = await pool.connect(); // Try to get a client from the pool
    console.log("✅ Database connection successful!");
    client.release(); // Release the client back to the pool
  } catch (error) {
    console.error("🔴 FATAL: Database connection failed!", error);
    process.exit(1); // Exit the application if DB connection fails
  }
};

const startServer = async () => {
  await testDbConnection(); // Run the DB test before starting the server

  const app = express();
  const PORT = process.env.PORT || 3001;

  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/posts', postRoutes);
  console.log("✅ Routes are set up.");

  app.listen(PORT, () => {
      console.log(`🚀 Server is running and listening on port ${PORT}`);
  });
};

startServer(); // Start the whole process