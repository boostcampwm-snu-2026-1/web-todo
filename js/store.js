// 상태 관리 모듈 (mockapi.io 연동)
import { fetchTodos, createTodo, removeTodo, updateTodo } from './api.js';

let todos = [];

export async function loadTodos() {
  const data = await fetchTodos();
  todos = data.map(item => ({
    id: item.id,
    text: item.title,
    completed: item.completed,
  }));
  return todos;
}

export function getTodos() {
  return todos;
}

export function findTodoById(id) {
  return todos.find(t => String(t.id) === String(id));
}

export async function addTodo(text) {
  const data = await createTodo(text);
  const todo = { id: data.id, text: data.title, completed: data.completed };
  todos.push(todo);
  return todo;
}

export async function toggleTodo(id) {
  const todo = findTodoById(id);
  if (!todo) return;
  const newCompleted = !todo.completed;
  await updateTodo(id, { completed: newCompleted });
  todo.completed = newCompleted;
}

export async function deleteTodo(id) {
  await removeTodo(id);
  todos = todos.filter(t => String(t.id) !== String(id));
}

export async function updateTodoText(id, newText) {
  const todo = findTodoById(id);
  if (!todo) return;
  await updateTodo(id, { title: newText });
  todo.text = newText;
}
