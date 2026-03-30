import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- DB connection ---
const { URI } = process.env;

if (!URI) {
  console.error("URI is not defined. Check your .env file.");
  process.exit(1);
}

mongoose
  .connect(URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

// --- Schema & Model ---
const todoSchema = new mongoose.Schema({
  content: { type: String, required: true },
  done: { type: Boolean, default: false },
  createdAt: { type: Number, default: () => Math.floor(Date.now() / 1000) },
});

// Expose virtual `id` (string) in JSON; strip internal Mongoose fields
todoSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Todo = mongoose.model("Todo", todoSchema);

// --- Routes ---

// GET /todos — return all todos ordered by creation time
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: 1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /todos — create a new todo
app.post("/todos", async (req, res) => {
  try {
    const { content, done } = req.body;
    const todo = await new Todo({ content, done }).save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /todos/:id — update done status
app.put("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { done: req.body.done },
      { new: true }
    );
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /todos/:id — remove a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
