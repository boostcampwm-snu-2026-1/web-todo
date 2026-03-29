import "dotenv/config";
import mongoose from "mongoose";
import dns from "dns";

// 윈도우 DNS 문제를 원천 차단함 
dns.setServers(['8.8.8.8']); 

const URI = process.env.URI;

async function finalTest() {
  try {
    console.log("🚀 연결중");
    await mongoose.connect(URI);
    console.log("🎉 연결 완료");
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("현재 DB 컬렉션:", collections.map(c => c.name));
    
    process.exit(0);
  } catch (err) {
    console.error("❌ 에러 메세지 출력:", err.message);
    process.exit(1);
  }
}

finalTest();