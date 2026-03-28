import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = Number(process.env.PORT) || 3000;
const uri = process.env.URI;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

async function connectDatabase() {
  if (!uri) {
    throw new Error("URI is missing. Please set URI in .env");
  }

  await mongoose.connect(uri);
  console.log(`✅ MongoDB connected (${mongoose.connection.name})`);
}

async function closeDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log("ℹ️ MongoDB disconnected");
  }
}

async function startServer() {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`🚀 Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled rejection:", reason);
});

process.on("SIGINT", async () => {
  await closeDatabase();
  process.exit(0);
});

startServer();
