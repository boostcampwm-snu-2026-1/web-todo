let todos = [];

export function setTodos(newTodos) {
  todos = Array.isArray(newTodos) ? newTodos : [];
}

export function getTodos() {
  return todos;
}

export function addTodo(todo) {
  setTodos([...todos, todo]);
  return todo;
}

export function removeTodo(id) {
  setTodos(todos.filter((t) => t.id !== id));
}

export function patchTodo(id, updates) {
  setTodos(todos.map((t) => (t.id === id ? { ...t, ...updates } : t)));
}
