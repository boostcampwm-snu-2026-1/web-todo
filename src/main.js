/**
 * main.js — 앱 진입점 (Entry Point)
 *
 * index.html의 <script type="module" src="/src/main.js">가 이 파일을 로드한다.
 * 세 단계를 순서대로 실행해 앱을 부팅한다:
 *
 *   1. initStore()  : localStorage에서 이전 데이터 복원
 *   2. renderAll()  : 복원된 데이터로 초기 화면 그리기
 *   3. initEvents() : 사용자 입력을 받을 이벤트 리스너 등록
 *
 * 이후에는 "이벤트 발생 → 상태 변경(store) → 화면 갱신(render)" 사이클이 반복된다.
 *
 * 모듈 의존 관계:
 *   main.js
 *     ├── store.js   (상태 관리)
 *     ├── render.js  (DOM 렌더링) → store.js
 *     └── events.js  (이벤트 처리) → store.js, render.js
 */

import { initStore } from './store.js';
import { renderAll } from './render.js';
import { initEvents } from './events.js';

// ── 1단계: 저장된 할일 목록을 localStorage에서 불러온다 ──
initStore();

// ── 2단계: 불러온 데이터로 초기 화면을 그린다 ──
renderAll();

// ── 3단계: 버튼·입력창 등의 이벤트 리스너를 등록한다 ──
initEvents();
