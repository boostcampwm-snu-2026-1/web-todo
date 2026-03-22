/**
 * api.js — MockAPI 통신 모듈
 *
 * 서버(MockAPI)와의 HTTP 통신을 전담한다.
 * 서버 데이터 구조와 앱 내부 구조가 다르므로,
 * 응답을 받은 즉시 앱이 사용하는 형태로 변환(transform)해 반환한다.
 *
 * 서버 데이터 구조:
 *   { id: string, content: string, completed: boolean, createdAt: string(ISO 8601) }
 *
 * 앱 내부 데이터 구조:
 *   { id: string, text: string, done: boolean, createdAt: number(Unix ms) }
 *
 * 다른 모듈에서 import해 사용한다:
 *   import { fetchTodos, postTodo } from './api.js';
 */


/** MockAPI 베이스 URL */
const BASE_URL = 'https://69b9372ce69653ffe6a6f090.mockapi.io';


/* ════════════════════════════════════════════
   데이터 변환 (Transform)
   ────────────────────────────────────────────
   서버 필드명과 앱 필드명이 다르므로
   네트워크 응답을 앱 내부 형식으로 일괄 변환한다.
   이 함수 안에서만 서버 구조를 알면 되므로,
   나머지 모듈은 서버 스펙 변경에 영향받지 않는다.
════════════════════════════════════════════ */

/**
 * 서버에서 받은 할일 항목 하나를 앱 내부 형식으로 변환한다.
 *
 * 변환 규칙:
 *   content   → text      (필드명 변경)
 *   completed → done      (필드명 변경)
 *   createdAt → createdAt (ISO 8601 문자열 → Unix 타임스탬프(ms))
 *
 * @param {{ id: string, content: string, completed: boolean, createdAt: string }} item
 * @returns {{ id: string, text: string, done: boolean, createdAt: number }}
 */
function transformTodo(item) {
  return {
    id: item.id,
    text: item.content,                        // content → text
    done: item.completed,                      // completed → done
    createdAt: new Date(item.createdAt).getTime(), // ISO 문자열 → Unix ms
  };
}


/* ════════════════════════════════════════════
   공개 API 함수 (export)
════════════════════════════════════════════ */

/**
 * /todos 엔드포인트에서 전체 할일 목록을 가져온다.
 *
 * 응답이 정상이면 각 항목을 transformTodo로 변환한 배열을 반환한다.
 * 네트워크 오류나 비정상 HTTP 상태(4xx, 5xx)이면 Error를 던진다.
 * 호출부(main.js)에서 try/catch로 오류를 처리해 localStorage 폴백으로 넘어간다.
 *
 * @returns {Promise<{ id: string, text: string, done: boolean, createdAt: number }[]>}
 * @throws {Error} 네트워크 오류 또는 HTTP 오류 상태일 때
 */
export async function fetchTodos() {
  const response = await fetch(`${BASE_URL}/todos`);

  // HTTP 상태가 2xx가 아니면 명시적으로 오류를 던진다
  // (fetch는 네트워크 오류만 reject하고 4xx/5xx는 reject하지 않는다)
  if (!response.ok) {
    throw new Error(`API 오류: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // 배열의 각 항목을 앱 내부 형식으로 일괄 변환해 반환
  return data.map(transformTodo);
}

/**
 * 새 할일을 서버에 저장한다 (POST /todos).
 *
 * 서버에 보내는 body:
 *   { content: string, completed: false }
 *   - content   : 사용자가 입력한 할일 텍스트
 *   - completed : 새 항목은 항상 미완료 상태로 생성
 *
 * 서버 응답 (생성된 항목 전체):
 *   { id: string, content: string, completed: boolean, createdAt: string }
 *   - id, createdAt 은 서버가 자동으로 부여한다.
 *
 * 응답을 transformTodo로 변환해 앱 내부 형식으로 반환한다.
 * 호출부(events.js)에서 반환된 객체를 store에 삽입해 UI를 갱신한다.
 *
 * @param {string} text — 사용자가 입력한 할일 내용
 * @returns {Promise<{ id: string, text: string, done: boolean, createdAt: number }>}
 * @throws {Error} 네트워크 오류 또는 HTTP 오류 상태일 때
 */
export async function postTodo(text) {
  const response = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // 서버 필드명(content, completed)으로 변환해서 전송
    body: JSON.stringify({ content: text, completed: false }),
  });

  if (!response.ok) {
    throw new Error(`API 오류: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // 서버가 반환한 생성 항목을 앱 내부 형식으로 변환해 반환
  // (id, createdAt은 서버가 부여한 값을 그대로 사용)
  return transformTodo(data);
}

/**
 * 특정 할일의 완료 상태를 서버에 반영한다 (PUT /todos/:id).
 *
 * 서버에 보내는 body:
 *   { completed: boolean }
 *   - MockAPI는 전달된 필드만 덮어쓰므로 변경할 필드만 보낸다.
 *
 * 서버 응답: 수정된 항목 전체 ({ id, content, completed, createdAt })
 * 반환값은 사용하지 않으므로 void로 처리한다.
 * 실패 시 호출부(events.js)에서 낙관적 업데이트를 롤백한다.
 *
 * @param {string} id — 수정할 할일의 id
 * @param {boolean} completed — 새로운 완료 상태
 * @returns {Promise<void>}
 * @throws {Error} 네트워크 오류 또는 HTTP 오류 상태일 때
 */
export async function putTodo(id, completed) {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });

  if (!response.ok) {
    throw new Error(`API 오류: ${response.status} ${response.statusText}`);
  }
}

/**
 * 특정 할일을 서버에서 삭제한다 (DELETE /todos/:id).
 *
 * 서버 응답: 삭제된 항목 전체 (반환값은 사용하지 않는다)
 * 실패 시 호출부(events.js)에서 renderAll()로 항목을 화면에 복원한다.
 *
 * @param {string} id — 삭제할 할일의 id
 * @returns {Promise<void>}
 * @throws {Error} 네트워크 오류 또는 HTTP 오류 상태일 때
 */
export async function removeTodo(id) {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`API 오류: ${response.status} ${response.statusText}`);
  }
}
