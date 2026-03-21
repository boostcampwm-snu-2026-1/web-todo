# Web Todo App

Vite와 mockapi.io를 활용한 간단한 Todo 웹 애플리케이션

## 기능

- 할 일 추가 (POST)
- 완료 체크/해제 (PUT)
- 할 일 삭제 (DELETE)
- 전체/활성 항목 개수 표시
- 서버 데이터 동기화 (GET)

## 기술 스택

- **Vite** - 빠른 개발 서버 및 빌드 도구
- **ESM (ES Modules)** - 모듈 단위 개발
- **Fetch API** - 비동기 데이터 통신
- **mockapi.io** - REST API 서버

## 설치

```bash
npm install
```

## 실행

### 개발 모드

```bash
npm run dev
```

브라우저에서 표시되는 URL (보통 http://localhost:5173) 접속

## 프로젝트 구조

```
web-todo/
├── index.html      # 메인 HTML
├── app.js          # 애플리케이션 로직 (UI, 이벤트 처리)
├── api.js          # API 통신 함수 (fetch 요청)
├── style.css       # 스타일
└── package.json    # 프로젝트 설정
```

## API 서버

- **Base URL**: `https://69b93728e69653ffe6a6f07b.mockapi.io/todos`
- **GET** `/` - 모든 todo 가져오기
- **POST** `/` - 새 todo 생성
- **PUT** `/:id` - todo 완료 상태 변경
- **DELETE** `/:id` - todo 삭제