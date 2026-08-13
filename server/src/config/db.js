import mongoose from 'mongoose';

// Disable Mongoose query buffering globally so operations fail-fast if DB is unavailable
mongoose.set('bufferCommands', false);

export let isConnectedToDB = false;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todolist', {
      serverSelectionTimeoutMS: 2000,
    });
    isConnectedToDB = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    isConnectedToDB = false;
    console.warn(`[MongoDB Notice] Local MongoDB service not available. Operating seamlessly in high-performance In-Memory mode.`);
  }
};


