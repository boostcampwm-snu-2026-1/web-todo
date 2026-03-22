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
 *   import { fetchTodos } from './api.js';
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
