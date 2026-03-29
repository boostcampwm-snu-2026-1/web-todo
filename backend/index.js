import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

// todo-db 데이터베이스로 연결
const URI = process.env.URI; // <-.env 파일에 URI 정보로 정의
mongoose.connect(URI)
  .then(async () => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// todo 스키마
const todoSchema = new mongoose.Schema({
  content: { type: String, required: true },
  done: { type: Boolean, default: false },
});

const Todos = mongoose.model("Todos", todoSchema);


app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todos.find();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/todos', async (req, res) => {
    try {
        // 요청으로 받은 데이터를 이용하여 새로운 todo 생성
        const newTodo = new Todos(req.body);

        // DB에 데이터 저장
        await newTodo.save();
        
        // 새로 생성된 사용자 정보를 응답
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})