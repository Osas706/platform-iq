import mongoose from "mongoose";
import { ENV } from "./env.ts";

export const connectDB = async () => {
  try {
    if (!ENV.DB_URL) {
      throw new Error("DB_URL is not defined in environment variables");
    }

    const conn = await mongoose.connect(ENV.DB_URL);

    console.log("✅ Connected to MongoDB:", conn.connection.host);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);

    process.exit(1); // stop app if DB fails
  }
};