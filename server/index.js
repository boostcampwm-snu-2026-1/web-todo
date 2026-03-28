const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──
app.use(cors());
app.use(express.json());

// ── MongoDB 연결 ──
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas 연결 성공'))
  .catch((err) => {
    console.error('MongoDB 연결 실패:', err.message);
    process.exit(1);
  });

// ── Mongoose Schema & Model ──
const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Todo = mongoose.model('Todo', todoSchema);

// ── RESTful API Routes ──

// GET /api/todos - 전체 할 일 조회
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: '할 일 목록을 불러오는데 실패했습니다.' });
  }
});

// GET /api/todos/:id - 특정 할 일 조회
app.get('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: '해당 할 일을 찾을 수 없습니다.' });
    }
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: '잘못된 요청입니다.' });
  }
});

// POST /api/todos - 새 할 일 생성
app.post('/api/todos', async (req, res) => {
  try {
    const { title, completed } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'title은 필수입니다.' });
    }
    const todo = await Todo.create({ title: title.trim(), completed: !!completed });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: '할 일을 생성하는데 실패했습니다.' });
  }
});

// PUT /api/todos/:id - 할 일 수정
app.put('/api/todos/:id', async (req, res) => {
  try {
    const updates = {};
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.completed !== undefined) updates.completed = req.body.completed;

    const todo = await Todo.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!todo) {
      return res.status(404).json({ error: '해당 할 일을 찾을 수 없습니다.' });
    }
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: '잘못된 요청입니다.' });
  }
});

// DELETE /api/todos/:id - 할 일 삭제
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: '해당 할 일을 찾을 수 없습니다.' });
    }
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: '잘못된 요청입니다.' });
  }
});

// ── 서버 시작 ──
app.listen(PORT, () => {
  console.log(`백엔드 API 서버 실행 중: http://localhost:${PORT}`);
});
