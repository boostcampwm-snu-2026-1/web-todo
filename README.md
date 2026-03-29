# Web Todo App

Vite + Express + MongoDB Atlas를 활용한 Todo 웹 애플리케이션

## 기능

- 할 일 추가 (POST)
- 완료 체크/해제 (PUT)
- 할 일 삭제 (DELETE)
- 전체/활성 항목 개수 표시
- 서버 재시작 후에도 데이터 유지 (MongoDB Atlas)

## 기술 스택

- **Vite** - 프론트엔드 개발 서버
- **Express** - 백엔드 API 서버
- **Mongoose** - MongoDB ODM
- **MongoDB Atlas** - 클라우드 데이터베이스
- **ESM (ES Modules)** - 모듈 단위 개발
- **Fetch API** - 비동기 데이터 통신

## 설치

```bash
npm install
```

## 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성 후 MongoDB Atlas 연결 정보 입력:

```
URI=mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/todo-db?appName=Cluster0
```

## 실행

백엔드와 프론트엔드를 각각 실행해야 합니다.

```bash
# 터미널 1 - 백엔드 서버 (port 3000)
npm run back

# 터미널 2 - 프론트엔드 (port 5173)
npm run dev
```

## 프로젝트 구조

```
web-todo/
├── index.html      # 메인 HTML
├── app.js          # 애플리케이션 로직 (UI, 이벤트 처리)
├── api.js          # API 통신 함수 (fetch 요청)
├── back.js         # Express 백엔드 서버 (Mongoose, CRUD API)
├── style.css       # 스타일
└── package.json    # 프로젝트 설정
```

## API

- **Base URL**: `http://localhost:3000`
- **GET** `/todos` - 모든 todo 가져오기
- **POST** `/todos` - 새 todo 생성
- **PUT** `/todos/:id` - todo 완료 상태 변경
- **DELETE** `/todos/:id` - todo 삭제
