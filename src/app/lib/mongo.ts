import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;
  if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
  if (process.env.NODE_ENV !== "production") {
    try {
      const preview = process.env.MONGODB_URI
        .replace(/:\S+@/, ":***@")
        .replace(/(\?.*)$/, "");
      console.log("[DB] Connecting", { uri: preview, nodeEnv: process.env.NODE_ENV });
    } catch {}
  }
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}
