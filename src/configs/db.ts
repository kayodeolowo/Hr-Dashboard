import mongoose from 'mongoose';

const connectDatabase = async (): Promise<void> => {
  try {
    const dbUri = process.env.DB_LOCAL_URI as string;

    if (!dbUri) {
      throw new Error('Database URI is not defined in environment variables');
    }

    await mongoose.connect(dbUri, {
      dbName: 'express-ts',
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', (error as Error).message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDatabase;
