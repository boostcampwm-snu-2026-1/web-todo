// 상태 관리 및 LocalStorage 담당 모듈
let todos = [];
let nextId = 1;

export function loadTodos() {
  const saved = localStorage.getItem('todos');
  if (saved) {
    todos = JSON.parse(saved);
    nextId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
  }
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

export function getTodos() {
  return todos;
}

export function findTodoById(id) {
  return todos.find(t => t.id === id);
}

export function addTodo(text) {
  const todo = { id: nextId++, text: text.trim(), completed: false };
  todos.push(todo);
  saveTodos();
  return todo;
}

export function toggleTodo(id) {
  const todo = findTodoById(id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
  }
}

export function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
}

export function updateTodoText(id, newText) {
  const todo = findTodoById(id);
  if (todo) {
    todo.text = newText;
    saveTodos();
  }
}
