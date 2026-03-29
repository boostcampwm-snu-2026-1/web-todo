import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import Todo from "./Todo.js";

const app = express();
const PORT = process.env.PORT || 3000;
const URI = process.env.URI;

app.use(cors());
app.use(express.json());

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/todos", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return res
        .status(400)
        .json({ message: "content는 비어 있지 않은 문자열이어야 합니다." });
    }

    const newTodo = await Todo.create({
      content: content.trim(),
      done: false,
    });

    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content, done } = req.body;

    const updateData = {};

    if (content !== undefined) {
      if (typeof content !== "string" || !content.trim()) {
        return res
          .status(400)
          .json({ message: "content는 비어 있지 않은 문자열이어야 합니다." });
      }
      updateData.content = content.trim();
    }

    if (done !== undefined) {
      if (typeof done !== "boolean") {
        return res.status(400).json({ message: "done은 boolean이어야 합니다." });
      }
      updateData.done = done;
    }

    const updatedTodo = await Todo.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo를 찾을 수 없습니다." });
    }

    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo를 찾을 수 없습니다." });
    }

    res.status(200).json({
      message: "삭제 완료",
      deletedTodo,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

mongoose
  .connect(URI)
  .then(() => {
    console.log("✅ MongoDB 연결 성공!");
    app.listen(PORT, () => {
      console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB 연결 실패:", err.message);
  });