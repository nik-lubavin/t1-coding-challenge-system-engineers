import mongoose from "mongoose";

// const MONGO_URI = "mongodb://localhost:27017/mydatabase";
const MONGO_URI = "mongodb://host.docker.internal:27017/mydatabase";

export async function mongoDBConnect() {
  try {
    await mongoose.connect(MONGO_URI, {});
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}
