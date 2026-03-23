// mockapi.io 통신 담당 모듈
const BASE_URL = 'https://69ba34d2b3dcf7e0b4bc2627.mockapi.io/api/v1/todos';

export async function fetchTodos() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
}

export async function createTodo(title) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, completed: false }),
  });
  if (!res.ok) throw new Error('Failed to create todo');
  return res.json();
}

export async function removeTodo(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete todo');
  return res.json();
}

export async function updateTodo(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update todo');
  return res.json();
}
