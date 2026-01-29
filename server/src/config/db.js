import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/cesar_intranet";

export const connectDb = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(MONGO_URL);
  console.log("MongoDB conectado");
};
