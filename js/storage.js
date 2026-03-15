const KEY = "todos";

export function loadTodos() {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTodos(todos) {
  localStorage.setItem(KEY, JSON.stringify(todos));
}
