import mongoose from "mongoose";
import "dotenv/config";
import Todo from "./models/Todo.js";

const URI = process.env.URI;

mongoose
  .connect(URI)
  .then(async () => {
    console.log("✅ MongoDB 연결 성공!");

    const todos = await Todo.find().sort({ createdAt: -1 });

    console.log(`📋 todos 컬렉션 (${todos.length}건):`);
    todos.forEach((t) => {
      console.log(
        `_id: ${t._id} | content: ${t.content} | done: ${t.done} | createdAt: ${t.createdAt}`
      );
    });

    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ 연결 실패:", err.message);
    process.exit(1);
  });