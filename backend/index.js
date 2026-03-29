import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

const app = express()
const PORT = 3000

app.use(cors());
app.use(express.json());

const DB_URI = process.env.URI;

mongoose.connect(DB_URI)
  .then(() => {
    console.log('✅ [Success] MongoDB에 성공적으로 연결되었습니다!');
  })
  .catch((err) => {
    console.error('❌ [Error] DB 연결 중 오류 발생:', err);
  });

// Mongoose 스키마 정의
const todoSchema = new mongoose.Schema({
  content: { 
    type: String, 
    required: [true, '할 일 내용을 작성해야 합니다.'] 
  },
  completed: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Todo = mongoose.model('Todo', todoSchema);

// GET: 모든 할 일 목록 가져오기
app.get('/todos', async (req, res) => {
  // try-catch 블록으로 에러 처리
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: "데이터를 불러오는 중 오류가 발생했습니다.", error: err });
  }
});

// POST: 새로운 할 일 추가하기
app.post('/todos', async (req, res) => {
  // try-catch 블록으로 에러 처리
  try {
    const newTodo = new Todo({
      content: req.body.content,
      completed: req.body.completed || false
    });

    const savedTodo = await newTodo.save();
    console.log("데이터 받음!")
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(400).json({ message: "할 일을 저장할 수 없습니다.", error: err.message });
  }
});

// 1. 할 일 상태 수정하기 (PATCH)
app.patch('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;
        
        // ID로 찾아서 상태만 업데이트
        const updatedTodo = await Todo.findByIdAndUpdate(
            id, 
            { completed }, 
            { new: true } // 업데이트된 후의 데이터를 반환
        );
        
        res.json(updatedTodo);
    } catch (err) {
        res.status(404).json({ message: "수정할 항목을 찾을 수 없습니다." });
    }
});

// 2. 할 일 삭제하기 (DELETE)
app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Todo.findByIdAndDelete(id);
        res.status(204).send(); // 204: 성공했지만 돌려줄 데이터는 없음
    } catch (err) {
        res.status(404).json({ message: "삭제할 항목을 찾을 수 없습니다." });
    }
});

// 서버 가동
app.listen(PORT, () => {
  console.log(`📡 [Server] http://localhost:${PORT} 에서 서버가 대기 중입니다.`);
});