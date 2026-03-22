import { clearTodos, loadTodos, saveTodos } from "../storage.js";

function normalizeId(id) {
  if (id === null || id === undefined || id === "") return null;
  return String(id);
}

function isSameTodoId(a, b) {
  const left = normalizeId(a);
  const right = normalizeId(b);
  if (!left || !right) return false;
  return left === right;
}

export function getTodos() {
  return loadTodos();
}

export function setTodos(todos) {
  saveTodos(todos);
  return todos;
}

export function appendTodo(todo) {
  const todos = loadTodos();
  todos.push(todo);
  saveTodos(todos);
  return todos;
}

export function replaceTodo(updatedTodo) {
  const todos = loadTodos();
  const updatedTodos = todos.map((todo) => {
    if (!isSameTodoId(todo.id, updatedTodo.id)) return todo;
    return updatedTodo;
  });

  saveTodos(updatedTodos);
  return updatedTodos;
}

export function findTodoById(todoId) {
  const todos = loadTodos();
  return todos.find((todo) => isSameTodoId(todo.id, todoId));
}

export function updateTodoText(todoId, text) {
  const todos = loadTodos();
  const updatedTodos = todos.map((todo) => {
    if (!isSameTodoId(todo.id, todoId)) return todo;
    return { ...todo, text };
  });

  saveTodos(updatedTodos);
  return updatedTodos;
}

export function deleteTodo(todoId) {
  const todos = loadTodos();
  const updatedTodos = todos.filter((todo) => !isSameTodoId(todo.id, todoId));
  saveTodos(updatedTodos);
  return updatedTodos;
}

export function resetAllTodos() {
  clearTodos();
  return [];
}
