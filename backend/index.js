import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = 3000;
const URI = process.env.URI;

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    order: { type: Number, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret._id;
        return ret;
      },
    },
  }
);

const Todo = mongoose.model("Todo", todoSchema);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ Hello: "world" });
});

app.get("/todos", async (_req, res) => {
  const todos = await Todo.find().sort({ order: 1 });
  res.json(todos);
});

app.get("/todos/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  return res.json(todo);
});

app.post("/todos", async (req, res) => {
  const todo = await Todo.create(req.body);
  res.status(201).json(todo);
});

app.put("/todos/:id", async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  return res.json(todo);
});

app.delete("/todos/:id", async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  return res.status(204).send();
});

mongoose
  .connect(URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
