/**
 * index.js — 백엔드 API 서버
 *
 * Express.js로 HTTP 서버를 구동하고, Mongoose를 통해 MongoDB Atlas와 통신한다.
 * 프론트엔드(Vite)가 요청하는 RESTful API 엔드포인트 4개를 제공한다.
 *
 * 제공하는 엔드포인트:
 *   GET    /todos       — 전체 할일 목록 조회 (최신순)
 *   POST   /todos       — 새 할일 생성
 *   PUT    /todos/:id   — 특정 할일 완료 상태 수정
 *   DELETE /todos/:id   — 특정 할일 삭제
 *
 * 서버가 반환하는 할일 객체 구조 (MongoDB 문서):
 *   { _id: ObjectId, content: string, completed: boolean, createdAt: Date, updatedAt: Date }
 *
 * 프론트엔드(api.js)에서 이 구조를 앱 내부 형식으로 변환해 사용한다.
 *
 * 실행 방법:
 *   .env 파일에 MONGODB_URI를 설정한 뒤 `npm run dev` 또는 `npm start`
 */


/* ════════════════════════════════════════════
   외부 모듈 로드
   ────────────────────────────────────────────
   require() 는 Node.js의 CommonJS 모듈 시스템으로 패키지를 불러온다.
   (프론트엔드의 ES Module import 와 동일한 역할)
════════════════════════════════════════════ */

/**
 * dotenv: .env 파일의 KEY=VALUE 쌍을 process.env에 주입한다.
 * 가장 먼저 호출해야 이후 코드에서 환경변수를 정상적으로 읽을 수 있다.
 * .env 파일이 없으면 조용히 무시하므로 프로덕션 환경에서도 안전하다.
 */
require('dotenv').config();

/** Express: Node.js 기반의 웹 프레임워크. HTTP 라우팅·미들웨어를 간결하게 작성할 수 있다. */
const express = require('express');

/**
 * cors: Cross-Origin Resource Sharing 미들웨어.
 * 브라우저는 보안상 다른 출처(origin)의 서버에 요청을 막는다.
 * 프론트엔드(Vite, localhost:5173)와 백엔드(localhost:3000)는 포트가 달라 출처가 다르므로,
 * 이 미들웨어가 없으면 브라우저가 요청을 차단한다.
 */
const cors = require('cors');

/**
 * mongoose: MongoDB ODM(Object Document Mapper).
 * MongoDB 문서를 JavaScript 객체처럼 다룰 수 있게 해주고,
 * 스키마 정의·유효성 검사·쿼리 빌더 등을 제공한다.
 */
const mongoose = require('mongoose');


/* ════════════════════════════════════════════
   앱 초기화
════════════════════════════════════════════ */

/**
 * Express 애플리케이션 인스턴스.
 * 미들웨어 등록·라우트 정의·서버 실행의 기준 객체다.
 */
const app = express();

/**
 * 서버가 수신할 포트 번호.
 * .env에 PORT를 지정하면 그 값을, 없으면 기본값 3000을 사용한다.
 * 환경에 따라 포트를 유연하게 바꿀 수 있도록 환경변수로 관리한다.
 */
const PORT = process.env.PORT || 3000;


/* ════════════════════════════════════════════
   미들웨어 등록
   ────────────────────────────────────────────
   미들웨어는 요청(req)이 라우트 핸들러에 도달하기 전에
   순서대로 거치는 처리 함수다. app.use()로 전역 등록한다.
════════════════════════════════════════════ */

/**
 * CORS 허용.
 * 기본 설정으로 호출하면 모든 출처의 요청을 허용한다.
 * 필요하면 { origin: 'http://localhost:5173' } 처럼 특정 출처만 허용할 수 있다.
 */
app.use(cors());

/**
 * JSON 요청 본문(body) 파싱.
 * Content-Type: application/json 인 요청의 body를 자동으로 파싱해
 * req.body 객체로 접근할 수 있게 해준다.
 * 이 미들웨어가 없으면 req.body가 undefined가 된다.
 */
app.use(express.json());


/* ════════════════════════════════════════════
   MongoDB 연결
   ────────────────────────────────────────────
   mongoose.connect()는 Promise를 반환한다.
   연결에 성공하거나 실패하면 각각의 콜백이 실행된다.
════════════════════════════════════════════ */

/**
 * MongoDB Atlas에 연결한다.
 * MONGODB_URI는 .env 파일에 저장된 Atlas 연결 문자열이다.
 * 형식: mongodb+srv://<user>:<password>@<cluster>/<dbname>?appName=<name>
 *
 * 연결 실패 시 process.exit(1)로 서버를 즉시 종료한다.
 * 연결도 안 된 채 서버가 계속 실행되면 모든 DB 요청이 오류를 낼 것이므로
 * 처음부터 명확하게 실패시키는 것이 낫다.
 */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB 연결 성공'))
  .catch((err) => {
    console.error('MongoDB 연결 실패:', err.message);
    process.exit(1); // 비정상 종료 코드 1로 프로세스를 끝낸다
  });


/* ════════════════════════════════════════════
   스키마 & 모델 정의
   ────────────────────────────────────────────
   스키마(Schema): MongoDB 문서의 필드 구조와 타입·제약을 정의한다.
   모델(Model)  : 스키마를 바탕으로 실제 DB 컬렉션과 연결된 클래스.
                  Todo.find(), Todo.create() 등의 쿼리 메서드를 제공한다.
════════════════════════════════════════════ */

/**
 * 할일(Todo) 스키마.
 *
 * 필드:
 *   content   {String}  — 할일 내용. 빈 값은 허용하지 않는다(required).
 *   completed {Boolean} — 완료 여부. 새 항목은 항상 미완료(false)로 시작한다.
 *
 * 두 번째 인수 { timestamps: true }:
 *   Mongoose가 createdAt, updatedAt 필드를 자동으로 추가하고 관리한다.
 *   직접 날짜를 다룰 필요가 없어 편리하다.
 */
const todoSchema = new mongoose.Schema(
  {
    content:   { type: String,  required: true  },
    completed: { type: Boolean, default:  false },
  },
  { timestamps: true }
);

/**
 * Todo 모델.
 * mongoose.model('Todo', todoSchema)는 MongoDB의 'todos' 컬렉션과 연결된다.
 * (Mongoose는 모델 이름 'Todo'를 소문자·복수형 'todos'로 자동 변환한다.)
 */
const Todo = mongoose.model('Todo', todoSchema);


/* ════════════════════════════════════════════
   라우트 핸들러
   ────────────────────────────────────────────
   각 핸들러는 async 함수로 선언한다.
   DB 쿼리는 모두 비동기(Promise)이므로 await로 결과를 기다리고,
   오류는 try/catch로 잡아 적절한 HTTP 상태 코드와 함께 응답한다.

   HTTP 상태 코드 규칙:
     200 OK          — 조회·수정·삭제 성공 (기본값, res.json()은 200을 자동으로 쓴다)
     201 Created     — 생성 성공
     400 Bad Request — 클라이언트가 잘못된 데이터를 보냈을 때
     404 Not Found   — 해당 id의 문서가 DB에 없을 때
     500 Internal    — 서버·DB 내부 오류
════════════════════════════════════════════ */

/**
 * GET /todos — 전체 할일 목록 조회.
 *
 * DB에서 모든 Todo 문서를 가져와 배열로 반환한다.
 * sort({ createdAt: -1 }): 최신 항목이 앞에 오도록 내림차순 정렬한다.
 * (-1 = 내림차순, 1 = 오름차순)
 *
 * 응답 예시:
 *   [{ _id, content, completed, createdAt, updatedAt }, ...]
 */
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos); // 200 OK + JSON 배열
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /todos — 새 할일 생성.
 *
 * 요청 body에서 content를 꺼내 새 Todo 문서를 DB에 저장한다.
 * content가 없거나 공백만 있으면 400을 반환해 잘못된 요청을 거부한다.
 * 저장에 성공하면 MongoDB가 부여한 _id·createdAt이 포함된 문서를 반환한다.
 *
 * 요청 body: { content: string }
 * 응답 예시: { _id, content, completed: false, createdAt, updatedAt }
 */
app.post('/todos', async (req, res) => {
  const { content } = req.body;

  // 유효성 검사: content가 없거나 공백만 있으면 거부
  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'content는 필수입니다.' });
  }

  try {
    // Todo.create()는 새 문서를 DB에 저장하고 저장된 문서를 반환한다
    const todo = await Todo.create({ content: content.trim() });
    res.status(201).json(todo); // 201 Created
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /todos/:id — 특정 할일의 완료 상태 수정.
 *
 * URL 파라미터 :id로 수정할 문서를 특정하고,
 * 요청 body의 completed 값으로 완료 상태를 덮어쓴다.
 *
 * findByIdAndUpdate 옵션 { new: true }:
 *   기본적으로 업데이트 이전 문서를 반환하는데,
 *   { new: true }를 주면 업데이트된 최신 문서를 반환한다.
 *   프론트엔드가 서버의 실제 최신 상태를 확인할 수 있어 안전하다.
 *
 * 요청 body: { completed: boolean }
 * 응답 예시: { _id, content, completed, createdAt, updatedAt }
 */
app.put('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,                    // URL의 :id로 문서를 찾는다
      { completed: req.body.completed }, // 변경할 필드만 전달한다
      { new: true }                      // 업데이트 후의 문서를 반환
    );

    // 해당 id의 문서가 없으면 404
    if (!todo) return res.status(404).json({ error: '항목을 찾을 수 없습니다.' });

    res.json(todo); // 200 OK + 수정된 문서
  } catch (err) {
    // ObjectId 형식이 잘못됐을 때도 이 블록으로 온다 (CastError)
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /todos/:id — 특정 할일 삭제.
 *
 * URL 파라미터 :id로 삭제할 문서를 찾아 DB에서 제거한다.
 * findByIdAndDelete는 삭제된 문서를 반환하므로,
 * 존재하지 않는 id라면 null을 반환한다 → 404로 처리.
 *
 * 응답 예시: { _id, content, completed, createdAt, updatedAt } (삭제된 문서)
 * 프론트엔드(events.js)는 이 응답값을 사용하지 않는다.
 */
app.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    // 해당 id의 문서가 없으면 404
    if (!todo) return res.status(404).json({ error: '항목을 찾을 수 없습니다.' });

    res.json(todo); // 200 OK + 삭제된 문서
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ════════════════════════════════════════════
   서버 실행
════════════════════════════════════════════ */

/**
 * 지정한 포트로 HTTP 서버를 시작한다.
 * 콜백은 서버가 준비됐을 때 한 번 실행된다.
 * mongoose.connect()와는 독립적으로 실행되므로,
 * DB 연결이 완료되기 전에 요청이 오면 쿼리가 실패할 수 있다.
 * (실제로는 연결 시간(수십ms)보다 첫 요청이 늦게 오므로 문제가 없다.)
 */
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
