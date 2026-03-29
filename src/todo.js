import { fetchTodos, createTodo, deleteTodo as apiDeleteTodo, toggleTodo as apiToggleTodo } from './api.js';
import { renderTodo, removeTodoElement, updateTodoElement } from './render.js';

let todos = [];

export function getTodos() {
  return todos;
}

export async function loadTodos() {
  todos = await fetchTodos();
  todos.forEach(renderTodo);
}

export async function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const todo = await createTodo(trimmed);
  todos.push(todo);
  renderTodo(todo);
}

export async function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  const updated = await apiToggleTodo(id, !todo.done);
  todo.done = updated.done;
  updateTodoElement(id, todo.done);
}

export async function deleteTodo(id) {
  await apiDeleteTodo(id);
  todos = todos.filter(t => t.id !== id);
  removeTodoElement(id);
}
