import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";


const URI = process.env.URI; // <-.env 파일에 URI 정보로 정의

const app = express()
const PORT = 3000

app.use(cors());
app.use(express.json());

const DB_URI = process.env.URI;

mongoose.connect(DB_URI)
  .then(() => {
    console.log('✅ [Success] MongoDB Atlas에 성공적으로 연결되었습니다!');
  })
  .catch((err) => {
    console.error('❌ [Error] DB 연결 중 오류 발생:', err);
  });

// 4. 서버 생존 확인용 라우트
app.get('/ping', (req, res) => {
  res.send('pong! 서버가 정상적으로 작동 중입니다. 🚀');
});

// 5. 서버 가동
app.listen(PORT, () => {
  console.log(`📡 [Server] http://localhost:${PORT} 에서 서버가 대기 중입니다.`);
});