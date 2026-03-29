import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const { MONGODB_URI, PORT = 3000 } = process.env;

const app = express();

app.use(cors());
app.use(express.json());

const Todo = mongoose.model(
  "Todo",
  new mongoose.Schema(
    {
      task: { type: String, required: true, trim: true, maxlength: 200 },
      done: { type: Boolean, default: false },
    },
    { versionKey: false },
  ),
);

function toTodo(todo) {
  return {
    id: todo._id.toString(),
    task: todo.task,
    done: todo.done,
  };
}

app.get("/api/todos", async (_req, res) => {
  try {
    const todos = await Todo.find().sort({ _id: -1 });
    res.status(200).json(todos.map(toTodo));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/api/todos", async (req, res) => {
  const { task, done = false } = req.body ?? {};

  if (typeof task !== "string" || !task.trim()) {
    res.status(400).json({ message: "task must be a non-empty string." });
    return;
  }

  if (typeof done !== "boolean") {
    res.status(400).json({ message: "done must be a boolean." });
    return;
  }

  try {
    const todo = await Todo.create({ task: task.trim(), done });
    res.status(201).json(toTodo(todo));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { task, done } = req.body ?? {};

  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid todo id." });
    return;
  }

  if (typeof task !== "string" || !task.trim()) {
    res.status(400).json({ message: "task must be a non-empty string." });
    return;
  }

  if (typeof done !== "boolean") {
    res.status(400).json({ message: "done must be a boolean." });
    return;
  }

  try {
    const todo = await Todo.findByIdAndUpdate(
      id,
      { task: task.trim(), done },
      { returnDocument: "after", runValidators: true },
    );

    if (!todo) {
      res.status(404).json({ message: "Todo not found." });
      return;
    }

    res.status(200).json(toTodo(todo));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid todo id." });
    return;
  }

  try {
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      res.status(404).json({ message: "Todo not found." });
      return;
    }

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Express server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB.", error);
    process.exit(1);
  });
