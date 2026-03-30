const BASE_URL = 'http://localhost:3000/api';

export async function fetchTodos() {
  const res = await fetch(`${BASE_URL}/todos`);
  return res.json();
}

export async function createTodo(title) {
  const res = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, completed: false }),
  });
  return res.json();
}

export async function deleteTodo(id) {
  await fetch(`${BASE_URL}/todos/${id}`, { method: 'DELETE' });
}

export async function toggleTodo(id, completed) {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
  return res.json();
}
