import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();
const port = 3000;
//미들웨어 설정
app.use(express.json()); 
app.use(cors()); 

const URI = process.env.URI; // <-.env 파일에 URI 정보로 정의
//스키마 및 모델 설정
const todoSchema = new mongoose.Schema({
  content: String,
  done: Boolean,
});
const Todos = mongoose.model("Todos", todoSchema);
//DB 연결
mongoose.connect(URI)
  .then(async () => {
    console.log("✅ MongoDB 연결 성공! (DB: todo-db)");

    const todos = await Todos.find();
    console.log(`📋 todos 컬렉션 (${todos.length}건):`);
    todos.forEach((t) => {
      console.log(`  _id: ${t._id} | id: ${t.id} | content: ${t.content} | done: ${t.done}`);
    });
    app.listen(port, () => {
      console.log(`서버가 http://localhost:${port} 에서 대기 중입니다.`);
    });
  })
  .catch((err) => {
    console.error("❌ 연결 실패:", err.message);
    process.exit(1);
  });

