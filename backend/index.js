import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";


const URI = process.env.URI; // <-.env 파일에 URI 정보로 정의

const app = express()
app.use(cors());
const port = 3000

const todoSchema = new mongoose.Schema({
  content: String,
  done: Boolean,
});

const Todos = mongoose.model("Todos", todoSchema);

mongoose.connect(URI)
  .then(async () => {
    console.log("✅ MongoDB 연결 성공! (DB: todo-db)");

// 데이터 조회 
    const todos = await Todos.find();
    console.log(`📋 todos 컬렉션 (${todos.length}건):`);
    todos.forEach((t) => {
      console.log(`  _id: ${t._id} | id: ${t.id} | content: ${t.content} | done: ${t.done}`);
    });

    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ 연결 실패:", err.message);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.json({ Hello: "world" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})