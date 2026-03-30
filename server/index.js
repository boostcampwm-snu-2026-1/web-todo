import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dns from "dns";
import "dotenv/config";

// 윈도우 DNS 이슈 해결
dns.setServers(['8.8.8.8']); 

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect(process.env.URI)
  .then(() => console.log(" MongoDB 연결 성공"))
  .catch(err => console.error("MongoDB 연결 실패:", err));

// 데이터 구조
const todoSchema = new mongoose.Schema({
  content: { type: String, required: true },
  done: { type: Boolean, default: false },
});
const Todo = mongoose.model("Todo", todoSchema);

// [GET] 목록 조회
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// [POST] 할 일 추가
app.post("/todos", async (req, res) => {
  const newTodo = new Todo({ content: req.body.content });
  await newTodo.save();
  res.status(201).json(newTodo);
});

// [PATCH] 완료 상태 수정
app.patch("/todos/:id", async (req, res) => {
  const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    { done: req.body.done },
    { new: true }
  );
  res.json(updatedTodo);
});

// [DELETE] 할 일 삭제
app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "삭제 성공" });
});

app.listen(port, () => console.log(`서버 가동: http://localhost:${port}`));