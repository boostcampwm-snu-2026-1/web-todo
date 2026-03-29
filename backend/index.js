import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let nextId = 1;
const todos = [];

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "Backend is reachable",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/todo", (req, res) => {
  res.json(todos);
});

app.get("/api/todo/:id", (req, res) => {
  const todo = todos.find((item) => item.id === req.params.id);
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json(todo);
});

app.post("/api/todo", (req, res) => {
  const content = String(req.body?.content ?? "").trim();
  if (!content) return res.status(400).json({ message: "content is required" });

  const todo = {
    id: String(nextId++),
    content,
    completed: Boolean(req.body?.completed),
    createdAt: new Date().toISOString(),
  };

  todos.push(todo);
  res.status(201).json(todo);
});

app.put("/api/todo/:id", (req, res) => {
  const todo = todos.find((item) => item.id === req.params.id);
  if (!todo) return res.status(404).json({ message: "Todo not found" });

  if (req.body?.content !== undefined) {
    const content = String(req.body.content).trim();
    if (!content) return res.status(400).json({ message: "content cannot be empty" });
    todo.content = content;
  }

  if (req.body?.completed !== undefined) {
    todo.completed = Boolean(req.body.completed);
  }

  res.json(todo);
});

app.delete("/api/todo/:id", (req, res) => {
  const index = todos.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Todo not found" });

  todos.splice(index, 1);
  res.status(204).send();
});

app.get("/", (req, res) => {
  res.json({ message: "Todo backend server running" });
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
