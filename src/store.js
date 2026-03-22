/**
 * store.js — 상태 관리 모듈
 *
 * 앱의 유일한 데이터 출처(Single Source of Truth).
 * 할일 목록(todos)과 현재 필터(currentFilter)를 이 모듈 안에서만 보관하고,
 * 외부에서는 export된 함수들을 통해서만 읽고 쓸 수 있다.
 *
 * 데이터가 바뀔 때마다 persist()를 호출해 localStorage에 자동 저장한다.
 * 다른 모듈에서 import해 사용한다:
 *   import { addTodo, getFilteredTodos } from './store.js';
 */


/* ════════════════════════════════════════════
   상수 & 내부 상태 변수
════════════════════════════════════════════ */

/** localStorage에서 데이터를 읽고 쓸 때 사용할 키 이름 */
const STORAGE_KEY = 'gruvbox-todos';

/**
 * 할일 목록 배열.
 * 각 항목의 구조: { id: string, text: string, done: boolean, createdAt: number }
 *   - id       : 항목을 식별하는 고유 UUID
 *   - text     : 할일 내용 (최대 120자)
 *   - done     : 완료 여부
 *   - createdAt: 생성 시각 (Unix timestamp, 밀리초)
 *
 * let으로 선언한 이유: deleteTodo·clearDone에서 filter()로 새 배열을 만들어
 * 참조를 교체하는 불변성 패턴을 사용하기 때문이다.
 */
let todos = [];

/**
 * 현재 선택된 필터.
 * 'all'(전체) | 'active'(진행 중) | 'done'(완료) 세 가지 값을 가진다.
 * 필터는 UI 상태이므로 localStorage에는 저장하지 않는다
 * (페이지를 새로 고침하면 '전체'로 초기화되는 게 자연스럽다).
 */
let currentFilter = 'all';


/* ════════════════════════════════════════════
   초기화
════════════════════════════════════════════ */

/**
 * 앱 시작 시 localStorage에서 이전에 저장한 할일 목록을 복원한다.
 * JSON 파싱 오류(손상된 데이터 등)가 발생하면 빈 배열로 초기화한다.
 * main.js에서 앱 부팅 첫 번째 단계로 호출된다.
 */
export function initStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    todos = raw ? JSON.parse(raw) : [];
  } catch {
    todos = []; // 데이터가 손상된 경우 조용히 빈 상태로 시작
  }
}


/* ════════════════════════════════════════════
   읽기 (조회)
════════════════════════════════════════════ */

/**
 * 현재 필터에 맞는 할일 목록을 반환한다.
 * 원본 배열을 직접 반환하지 않고 복사본(스프레드)을 반환해
 * 외부에서 실수로 배열을 수정하는 것을 막는다.
 * @returns {{ id: string, text: string, done: boolean, createdAt: number }[]}
 */
export function getFilteredTodos() {
  switch (currentFilter) {
    case 'active': return todos.filter(t => !t.done);
    case 'done':   return todos.filter(t => t.done);
    default:       return [...todos]; // 'all': 전체 복사본
  }
}

/** 전체 할일 개수를 반환한다 (통계 표시에 사용) */
export function getTotalCount() { return todos.length; }

/** 완료된 할일 개수를 반환한다 (통계 표시에 사용) */
export function getDoneCount()  { return todos.filter(t => t.done).length; }


/* ════════════════════════════════════════════
   쓰기 (변경)
════════════════════════════════════════════ */

/**
 * 새 할일을 목록 맨 앞에 추가한다 (최신 항목이 위에 표시되도록 unshift 사용).
 * 빈 문자열이면 추가하지 않고 false를 반환한다.
 * @param {string} text — 입력창에서 받은 할일 내용
 * @returns {boolean} 추가 성공 여부
 */
export function addTodo(text) {
  const trimmed = text.trim(); // 앞뒤 공백 제거
  if (!trimmed) return false;  // 공백만 입력했으면 무시

  todos.unshift({
    id: crypto.randomUUID(), // 브라우저 내장 UUID 생성기로 고유 ID 부여
    text: trimmed,
    done: false,
    createdAt: Date.now(),
  });

  persist(); // 변경 사항을 localStorage에 즉시 저장
  return true;
}

/**
 * 특정 할일의 완료 상태를 반전시킨다 (완료 ↔ 미완료).
 * @param {string} id — 토글할 할일의 UUID
 */
export function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  todo.done = !todo.done;
  persist();
}

/**
 * 특정 할일을 목록에서 삭제한다.
 * filter로 새 배열을 만들어 참조를 교체하는 방식(불변성 패턴)을 사용한다.
 * @param {string} id — 삭제할 할일의 UUID
 */
export function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  persist();
}

/**
 * 완료된 할일을 모두 삭제한다.
 * 미완료 항목만 남기는 방식으로 동작한다.
 */
export function clearDone() {
  todos = todos.filter(t => !t.done);
  persist();
}

/**
 * 현재 필터를 변경한다.
 * @param {'all'|'active'|'done'} filter
 */
export function setFilter(filter) {
  currentFilter = filter;
}


/* ════════════════════════════════════════════
   내부 유틸리티
════════════════════════════════════════════ */

/**
 * 현재 todos 배열을 JSON으로 직렬화해 localStorage에 저장한다.
 * 저장 용량 초과 등의 오류는 조용히 무시한다 (앱이 멈추면 안 되므로).
 * export하지 않아 이 모듈 내부에서만 사용한다.
 */
function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {}
}
