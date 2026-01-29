import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
// Importa el modelo de Usuario (ajusta la ruta si es necesario)
import User from "./src/models/User.js"; 

dotenv.config();
const MONGO_URL = process.env.MONGO_URL || "mongodb://mongo:27017/cesar_intranet";

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    
    const email = "heredero.cesar@gmail.com"; // <--- PON TU EMAIL AQUÍ
    const password = "Cesar1987"; // <--- PON TU PASSWORD AQUÍ
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("El usuario ya existe.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email,
      password: hashedPassword,
      role: "admin"
    });

    console.log("✅ Usuario administrador creado con éxito.");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();