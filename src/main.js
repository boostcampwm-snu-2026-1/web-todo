/**
 * main.js — 앱 진입점 (Entry Point)
 *
 * index.html의 <script type="module" src="/src/main.js">가 이 파일을 로드한다.
 * 앱 부팅 순서:
 *
 *   1. API(MockAPI)에서 할일 목록 GET 요청
 *       ├─ 성공 → loadTodos()로 서버 데이터를 store에 주입
 *       └─ 실패 → initStore()로 localStorage 데이터 폴백
 *   2. renderAll()  : 초기 화면 그리기
 *   3. initEvents() : 이벤트 리스너 등록
 *
 * 이후에는 "이벤트 발생 → 상태 변경(store) → 화면 갱신(render)" 사이클이 반복된다.
 *
 * 모듈 의존 관계:
 *   main.js
 *     ├── api.js     (MockAPI 통신 + 데이터 변환)
 *     ├── store.js   (상태 관리)
 *     ├── render.js  (DOM 렌더링) → store.js
 *     └── events.js  (이벤트 처리) → store.js, render.js
 */

import { fetchTodos } from './api.js';
import { initStore, loadTodos } from './store.js';
import { renderAll } from './render.js';
import { initEvents } from './events.js';

// ── 1단계: 할일 목록 초기화 ──
// API 요청을 시도하고, 실패 시 localStorage로 폴백한다.
try {
  const todos = await fetchTodos();  // MockAPI GET /todos
  loadTodos(todos);                  // 서버 데이터를 store에 주입
} catch (err) {
  // 네트워크 오류, 서버 오류 등 API 요청이 실패한 경우
  console.warn('API 요청 실패, localStorage로 폴백합니다.', err.message);
  initStore(); // localStorage에서 마지막으로 저장된 데이터 복원
}

// ── 2단계: 초기화된 데이터로 화면을 그린다 ──
renderAll();

// ── 3단계: 사용자 입력을 받을 이벤트 리스너를 등록한다 ──
initEvents();
