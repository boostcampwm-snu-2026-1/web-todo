import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import todoRoutes from "./routes/todoRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

// todo-db 데이터베이스로 연결
const URI = process.env.URI; // <-.env 파일에 URI 정보로 정의
mongoose.connect(URI)
  .then(async () => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// 라우터 연결
app.use('/api/todos', todoRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})