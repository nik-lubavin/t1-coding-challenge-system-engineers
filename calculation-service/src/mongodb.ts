import mongoose from "mongoose";

export async function mongoDBConnect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/mydatabase", {});
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}
