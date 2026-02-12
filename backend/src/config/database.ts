import mongoose from 'mongoose';
import config from './index.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongodb.uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB Disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB Error:', error);
});
