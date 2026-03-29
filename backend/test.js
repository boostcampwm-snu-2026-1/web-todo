import mongoose from "mongoose";
import "dotenv/config";

// todo-db 데이터베이스로 연결
const URI = process.env.URI; // <-.env 환경변수에 URI 정보로 정의 

const todoSchema = new mongoose.Schema({
  id: Number,       // web-todo를 메모리에 저장할 때 사용했던 id. _id (mongoose가 자동으로 생성하는 unique id 값을 의미)와 상관없음
  content: String,
  done: Boolean,
});

const Todos = mongoose.model("Todos", todoSchema);

mongoose.connect(URI)
  .then(async () => {
    console.log("✅ MongoDB 연결 성공! (DB: todo-db)");

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

