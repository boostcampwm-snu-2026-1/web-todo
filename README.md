## 기능

- 할 일 추가
- 완료 체크/해제
- 할 일 삭제
- 전체/활성 항목 개수 표시

## 설치

```bash
npm install json-server
```

## 실행

### 개발 모드 (권장)

API 서버와 웹 서버를 동시에 실행:

```bash
npm run dev
```

- API: http://localhost:3000
- 웹앱: http://localhost:8080

### API 서버만 실행

```bash
npm start
```

그 다음 별도 터미널에서:

```bash
python3 -m http.server 8080
```

브라우저에서 http://localhost:8080 접속

## 프로젝트 구조

```
web-todo/
├── index.html      # 메인 HTML
├── app.js          # 애플리케이션 로직
├── api.js          # API 통신
├── style.css       # 스타일
├── db.json         # JSON Server 데이터베이스
└── package.json
```