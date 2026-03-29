import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(express.json());

async function startServer() {
  try {
    await mongoose.connection.asPromise();
    console.log("Connected to MongoDB");

    app.get("/", (req, res) => {
      res.send("Hello, World!");
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

startServer();
