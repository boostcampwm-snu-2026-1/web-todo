import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config({ path: new URL("./.env", import.meta.url) });
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
app.use(cors());
app.use(express.json());

// Mongoose Schema & Model
const todoSchema = new mongoose.Schema({
  item: { type: String, required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

// _id → id 변환 (프론트엔드 호환)
todoSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const Todo = mongoose.model("Todo", todoSchema);

// ─── RESTful API Routes ───

// GET /todos - 전체 조회
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: 1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// POST /todos - 생성
app.post("/todos", async (req, res) => {
  const { item, completed } = req.body;

  if (!item || typeof item !== "string" || item.trim() === "") {
    return res.status(400).json({ error: "item is required" });
  }

  try {
    const todo = await Todo.create({ item: item.trim(), completed: !!completed });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// PUT /todos/:id - 수정 (update & toggle)
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid todo id" });
  }

  try {
    const todo = await Todo.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// DELETE /todos/:id - 삭제
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid todo id" });
  }

  try {
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// ─── MongoDB 연결 & 서버 시작 ───
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI 환경변수가 설정되지 않았습니다. .env 파일을 확인하세요.");
  process.exit(1);
}

console.log("MongoDB 연결 시도 중...");

mongoose.connect(MONGODB_URI, {
  tlsAllowInvalidCertificates: true,
  family: 4,
  serverSelectionTimeoutMS: 10000,
})
  .then(() => {
    console.log("========================================");
    console.log("MongoDB 연결 성공!");
    console.log("========================================");
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`서버 실행 중: http://localhost:${PORT}`);
      console.log(`테스트: http://localhost:${PORT}/todos 에서 확인`);
    });
  })
  .catch((err) => {
    console.error("========================================");
    console.error("MongoDB 연결 실패:", err.message);
    console.error("========================================");
  });
