import dns from 'dns';
// Google DNS로 강제 설정하여 윈도우 DNS의 SRV 조회 문제를 해결함
dns.setServers(['8.8.8.8']); 

const domain = 'cluster0.qkbgt7w.mongodb.net';

console.log("🔍 지호님의 진짜 DB 정보 조회 중...");

// 1. 실제 접속할 샤드(Shard) 주소 조회
dns.resolveSrv(`_mongodb._tcp.${domain}`, (err, addresses) => {
  if (err) console.error("❌ SRV 조회 실패:", err);
  else {
    console.log("✅ [진짜 샤드 주소 목록]:");
    addresses.forEach(a => console.log(`- ${a.name}:${a.port}`));
  }
});

// 2. 진짜 레플리카셋(ReplicaSet) 이름 조회
dns.resolveTxt(domain, (err, records) => {
  if (err) console.error("❌ TXT 조회 실패:", err);
  else {
    console.log("✅ [진짜 레플리카셋 정보]:", records);
  }
});