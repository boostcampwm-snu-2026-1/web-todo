/**
 * store.js
 * Todo 데이터 상태 관리 모듈 (단일책임: 데이터 CRUD)
 */

let todos = [];
let nextId = 1;

/** 전체 todo 목록 반환 */
export const getTodos = () => [...todos];

/** 새 todo 추가 */
export const addTodo = (text) => {
  const todo = {
    id: nextId++,
    text: text.trim(),
    done: false,
    createdAt: Date.now(),
  };
  todos = [todo, ...todos];
  return todo;
};

/** todo 완료 상태 토글 */
export const toggleTodo = (id) => {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, done: !todo.done } : todo
  );
  return todos.find((todo) => todo.id === id);
};

/** todo 삭제 */
export const deleteTodo = (id) => {
  todos = todos.filter((todo) => todo.id !== id);
};

/** 완료/전체 개수 반환 */
export const getStats = () => ({
  total: todos.length,
  done: todos.filter((t) => t.done).length,
});
