import { clearTodos, loadTodos, saveTodos } from "../storage.js";

export function createTodo(text) {
  return {
    id: Date.now(),
    text,
    completed: false,
  };
}

export function getTodos() {
  return loadTodos();
}

export function setTodos(todos) {
  saveTodos(todos);
  return todos;
}

export function findTodoById(todoId) {
  const todos = loadTodos();
  return todos.find((todo) => todo.id === todoId);
}

export function addTodo(text) {
  const todos = loadTodos();
  todos.push(createTodo(text));
  saveTodos(todos);
  return todos;
}

export function toggleTodoCompletion(todoId, completed) {
  const todos = loadTodos();
  const updatedTodos = todos.map((todo) => {
    if (todo.id !== todoId) return todo;
    return { ...todo, completed };
  });

  saveTodos(updatedTodos);
  return updatedTodos;
}

export function updateTodoText(todoId, text) {
  const todos = loadTodos();
  const updatedTodos = todos.map((todo) => {
    if (todo.id !== todoId) return todo;
    return { ...todo, text };
  });

  saveTodos(updatedTodos);
  return updatedTodos;
}

export function deleteTodo(todoId) {
  const todos = loadTodos();
  const updatedTodos = todos.filter((todo) => todo.id !== todoId);
  saveTodos(updatedTodos);
  return updatedTodos;
}

export function resetAllTodos() {
  clearTodos();
  return [];
}
