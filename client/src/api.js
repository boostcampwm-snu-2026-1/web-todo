const BASE_URL = 'http://localhost:3000/todos';

export async function getTodos() {
    const response = await fetch(BASE_URL);
    return await response.json();
}

export async function createTodo(content) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, isDone: false })
    });
    return await response.json();
}

export async function deleteTodoApi(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'
    });
    return await response.json();
}

export async function toggleTodoApi(id, currentDone) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDone: !currentDone })
    });
    return await response.json();
}