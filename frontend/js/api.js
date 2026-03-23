/**
 * api.js
 * 서버 통신 모듈 (단일책임: fetch 요청/응답 처리)
 *
 * 모든 API 호출은 이 모듈에 집중되어 있어,
 * 엔드포인트 변경 시 이 파일만 수정하면 된다.
 */

const BASE_URL = 'http://localhost:3001';

/** GET /todos - 전체 목록 조회 */
export const fetchTodos = async () => {
  const res = await fetch(`${BASE_URL}/todos`);
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
};

/** POST /todos - 새 todo 추가 */
export const createTodo = async (text) => {
  const res = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to create todo');
  return res.json();
};

/** PATCH /todos/:id - 완료 토글 */
export const patchTodo = async (id) => {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Failed to update todo');
  return res.json();
};

/** DELETE /todos/:id - 삭제 */
export const removeTodo = async (id) => {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete todo');
};
