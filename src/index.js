import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

const app = express()
const port = 3000

app.use(cors());
app.use(express.json());

// 모델 정의
const todoSchema = new mongoose.Schema({
  content: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

todoSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

const Todo = mongoose.model("Todo", todoSchema);

// DB 연결
mongoose.connect(process.env.URI);

// 할 일 조회
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
})

// 할 일 추가
app.post("/todos", async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save();
  res.status(201).json(newTodo);
})

// 할 일 완료
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  const updatedTodo = await Todo.findByIdAndUpdate(
    id,
    { completed },
    { new: true }
  );

  res.json(updatedTodo);
})

// 할 일 삭제
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const deletedTodo = await Todo.findByIdAndDelete(id);

  res.json({ message: "삭제 성공" });
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});