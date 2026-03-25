const TODO_STORAGE_KEY = "web-todo-items";

export function loadTodos() {
  const raw = localStorage.getItem(TODO_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

export function saveTodos(todos) {
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

export function clearTodos() {
  localStorage.removeItem(TODO_STORAGE_KEY);
}
