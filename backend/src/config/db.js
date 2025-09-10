import mongoose from 'mongoose';

export async function connectDB() {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mini_store';
    await mongoose.connect(uri);
    const { host, name } = mongoose.connection;
    console.log(`MongoDB connected ${host} db: ${name}`);
}

export async function disconnectDB() {
    await mongoose.disconnect();
}