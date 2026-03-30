import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Todo from "./models/Todo.js";

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

    app.get("/todos", async (_req, res) => {
      const todos = await Todo.find();
      res.json(todos);
    });

    app.post("/todos", async (req, res) => {
      const todo = await Todo.create({ content: req.body.content });
      res.status(201).json(todo);
    });

    app.put("/todos/:id", async (req, res) => {
      const update = {};
      if (req.body.done !== undefined) update.done = req.body.done;
      if (req.body.content !== undefined) update.content = req.body.content;
      const todo = await Todo.findByIdAndUpdate(req.params.id, update, {
        returnDocument: "after",
      });
      res.status(200).json(todo);
    });

    app.delete("/todos/:id", async (req, res) => {
      await Todo.findByIdAndDelete(req.params.id);
      res.status(204).end();
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

startServer();
