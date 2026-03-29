import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const PORT = Number(process.env.PORT) || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI 환경 변수가 필요합니다.');
  process.exit(1);
}

const todoSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        return {
          id: ret._id.toString(),
          content: ret.content,
          completed: ret.completed,
        };
      },
    },
  }
);

const Todo = mongoose.model('Todo', todoSchema);

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/todos', async (_req, res, next) => {
  try {
    const docs = await Todo.find().sort({ _id: -1 }).exec();
    res.json(docs.map((d) => d.toJSON()));
  } catch (err) {
    next(err);
  }
});

app.post('/api/todos', async (req, res, next) => {
  try {
    const { content, completed } = req.body ?? {};
    if (typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ message: 'content는 필수입니다.' });
    }
    const doc = await Todo.create({
      content: content.trim(),
      completed: Boolean(completed),
    });
    res.status(201).json(doc.toJSON());
  } catch (err) {
    next(err);
  }
});

app.put('/api/todos/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: '잘못된 id 형식입니다.' });
    }
    const { content, completed } = req.body ?? {};
    if (typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ message: 'content는 필수입니다.' });
    }
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ message: 'completed는 boolean이어야 합니다.' });
    }
    const doc = await Todo.findByIdAndUpdate(
      id,
      { content: content.trim(), completed },
      { new: true, runValidators: true }
    );
    if (!doc) {
      return res.status(404).json({ message: '할 일을 찾을 수 없습니다.' });
    }
    res.json(doc.toJSON());
  } catch (err) {
    next(err);
  }
});

app.delete('/api/todos/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: '잘못된 id 형식입니다.' });
    }
    const deleted = await Todo.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: '할 일을 찾을 수 없습니다.' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

app.use((_req, res) => {
  res.status(404).json({ message: '경로를 찾을 수 없습니다.' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: '서버 오류가 발생했습니다.' });
});

async function main() {
  await mongoose.connect(MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`서버: http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
