import mongoose from 'mongoose';

export const connectDB = async (URI: string | undefined) => {
  if (URI === undefined) {
    throw new Error('DB_URI is not defined');
  }
  await mongoose.connect(URI);
};
