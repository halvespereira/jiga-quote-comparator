import mongoose from "mongoose";

export const connectDB = () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("Missing MONGO_URI in environment");
  }
  return mongoose.connect(uri, { dbName: "task" });
};
