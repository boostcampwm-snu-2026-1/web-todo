import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const todoSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

todoSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Todo = mongoose.model("Todo", todoSchema);

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("MONGODB_URI is missing in .env");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
  
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch todos" });
  }
});

app.post("/todos", async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || typeof content !== "string") {
      return res.status(400).json({ message: "Content is required" });
    }
    const newTodo = await Todo.create({ content: content.trim() });
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: "Failed to create todo" });
  }
});

app.patch("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed, content } = req.body;
    const update = {};

    if (typeof completed === "boolean") update.completed = completed;
    if (typeof content === "string" && content.trim() !== "") {
      update.content = content.trim();
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(id, update, { new: true });

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: "Failed to update todo" });
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete todo" });
  }
});


app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
