/**
 * app.js
 * 앱 진입점 - 각 모듈을 조합하여 앱 초기화 (단일책임: 조율/조합)
 */

import { getTodos, setTodos, addTodo, updateTodo, deleteTodo, getStats } from './store.js';
import {
  createTodoElement,
  renderTodoList,
  updateTodoItemUI,
  renderStats,
  toggleEmptyState,
  renderDate,
} from './dom.js';
import { bindListEvents, bindFormSubmit } from './events.js';
import { fetchTodos, createTodo, patchTodo, removeTodo } from './api.js';

/* ─── DOM 참조 ─── */
const formEl = document.getElementById('todo-form');
const inputEl = document.getElementById('todo-input');
const listEl = document.getElementById('todo-list');
const statsEl = document.getElementById('todo-stats');
const emptyEl = document.getElementById('empty-state');
const dateEl = document.getElementById('today-date');

/** 통계 + empty state를 현재 상태에 맞게 갱신 */
const syncUI = () => {
  const stats = getStats();
  renderStats(statsEl, stats);
  toggleEmptyState(emptyEl, stats.total === 0);
};

/** todo 추가 핸들러 */
const handleAdd = async (text) => {
  const todo = await createTodo(text);
  addTodo(todo);
  const li = createTodoElement(todo);
  listEl.prepend(li);
  syncUI();
};

/** todo 토글 핸들러 */
const handleToggle = async (id) => {
  const updated = await patchTodo(id);
  updateTodo(updated);
  updateTodoItemUI(listEl, updated);
  syncUI();
};

/** todo 삭제 핸들러 */
const handleDelete = async (id) => {
  await removeTodo(id);
  deleteTodo(id);
  const li = listEl.querySelector(`[data-id="${id}"]`);
  li?.remove();
  syncUI();
};

/** 앱 초기화 */
const init = async () => {
  renderDate(dateEl);

  const todos = await fetchTodos();
  setTodos(todos);
  renderTodoList(listEl, getTodos());
  syncUI();

  bindFormSubmit(formEl, inputEl, handleAdd);
  bindListEvents(listEl, { onToggle: handleToggle, onDelete: handleDelete });
};

init();
