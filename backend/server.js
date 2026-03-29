/**
 * server.js
 * Todo REST API 서버 (Express + MongoDB Atlas)
 *
 * GET    /todos       - 전체 목록 조회
 * POST   /todos       - 새 todo 추가
 * PATCH  /todos/:id   - 완료 토글
 * DELETE /todos/:id   - 삭제
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

/* ─── Mongoose Todo 스키마 ─── */
const todoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Todo = mongoose.model('Todo', todoSchema);

/* ─── GET /todos ─── */
app.get('/todos', (req, res) => {
  res.json(todos);
});

/* ─── POST /todos ─── */
app.post('/todos', (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }

  const todo = {
    id: nextId++,
    text: text.trim(),
    done: false,
    createdAt: Date.now(),
  };

  todos = [todo, ...todos];
  res.status(201).json(todo);
});

/* ─── PATCH /todos/:id (완료 토글) ─── */
app.patch('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const target = todos.find((t) => t.id === id);

  if (!target) {
    return res.status(404).json({ error: 'todo not found' });
  }

  target.done = !target.done;
  res.json(target);
});

/* ─── DELETE /todos/:id ─── */
app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const exists = todos.some((t) => t.id === id);

  if (!exists) {
    return res.status(404).json({ error: 'todo not found' });
  }

  todos = todos.filter((t) => t.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Todo API server running at http://localhost:${PORT}`);
});
