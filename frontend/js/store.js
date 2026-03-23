/**
 * store.js
 * Todo 데이터 상태 관리 모듈 (단일책임: 데이터 CRUD)
 */

let todos = [];

/** 전체 todo 목록 반환 */
export const getTodos = () => [...todos];

/** 서버에서 받아온 목록으로 초기화 */
export const setTodos = (newTodos) => {
  todos = [...newTodos];
};

/** 새 todo 추가 (서버에서 반환된 todo 객체를 그대로 사용) */
export const addTodo = (todo) => {
  todos = [todo, ...todos];
};

/** todo 완료 상태 업데이트 (서버 응답 반영) */
export const updateTodo = (updatedTodo) => {
  todos = todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t));
};

/** todo 삭제 */
export const deleteTodo = (id) => {
  todos = todos.filter((t) => t.id !== id);
};

/** 완료/전체 개수 반환 */
export const getStats = () => ({
  total: todos.length,
  done: todos.filter((t) => t.done).length,
});
