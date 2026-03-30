import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors'; 
import 'dotenv/config';

const app = express();
app.use(cors()); 
app.use(express.json()); 

const todoSchema = new mongoose.Schema({
  content: { type: String, required: true },
  isDone: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Todo = mongoose.model('Todo', todoSchema);

mongoose.connect(process.env.URI)
  .then(() => console.log("✅ MongoDB 연결 성공!"))
  .catch(err => console.error("❌ MongoDB 연결 실패:", err));

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "데이터 조회 실패", error })
  }
});

app.post('/todos', async (req, res) => {
  try {
    const {content} = req.body;

    const newTodo = new Todo({
      content: content, isDone: false
    });

    const savedTodo = await newTodo.save();

    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ message: "할 일 추가 실패", error});
  }
});

app.patch('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const { isDone } = req.body; 

    const updatedTodo = await Todo.findByIdAndUpdate(
      id, { isDone }, { new: true } 
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "해당 데이터를 찾을 수 없습니다." });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "수정 실패", error });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params; 

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: "삭제할 데이터를 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "삭제 성공", deletedTodo });
  } catch (error) {
    res.status(500).json({ message: "삭제 실패", error });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 달리는 중!`);
});

export default Todo;