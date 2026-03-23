// src/api.js
const BASE_URL = 'https://69bd26262bc2a25b22ad7ca8.mockapi.io/todos';

async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.json();
}

export function fetchTodos() {
  return request(BASE_URL);
}

export function createTodo(content) {
  return request(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, done: false })
  });
}

export function toggleTodoAPI(id, done) {
  return request(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done })
  });
}

export function deleteTodoAPI(id) {
  return request(`${BASE_URL}/${id}`, { method: 'DELETE' });
}
