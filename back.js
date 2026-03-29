import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const todoSchema = new mongoose.Schema({
    title: String,
    done: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", todoSchema);

mongoose.connect(process.env.URI)
    .then(() => console.log("MongoDB 연결 성공!"))
    .catch(err => console.error("연결 실패:", err.message));

// GET /todos - 전체 조회
app.get("/todos", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: "서버 오류" });
    }
});

// POST /todos - 생성
app.post("/todos", async (req, res) => {
    try {
        const todo = new Todo({ title: req.body.title, done: false });
        const saved = await todo.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: "잘못된 요청" });
    }
});

// PUT /todos/:id - 수정
app.put("/todos/:id", async (req, res) => {
    try {
        const updated = await Todo.findByIdAndUpdate(
            req.params.id,
            { done: req.body.done },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Todo를 찾을 수 없습니다" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: "잘못된 요청" });
    }
});

// DELETE /todos/:id - 삭제
app.delete("/todos/:id", async (req, res) => {
    try {
        const deleted = await Todo.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Todo를 찾을 수 없습니다" });
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ message: "잘못된 요청" });
    }
});

app.listen(port, () => {
    console.log(`서버 실행 중: http://localhost:${port}`);
});
