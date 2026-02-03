import mongoose from "mongoose";

export const connectDb = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUrl =
    process.env.MONGO_URL || "mongodb://localhost:27017/cesar_intranet";
  await mongoose.connect(mongoUrl);
  console.log("MongoDB conectado");
};
