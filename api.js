const BASE_URL = 'http://localhost:3000';

export async function fetchTodos() {
    const response = await fetch(`${BASE_URL}/todos`);
    return response.json();
}

export async function createTodo(title) {
    const response = await fetch(`${BASE_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, done: false })
    });
    return response.json();
}

export async function toggleTodo(id) {
    const response = await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: true })
    });
    return response.json();
}

export async function deleteTodo(id) {
    await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'DELETE'
    });
}