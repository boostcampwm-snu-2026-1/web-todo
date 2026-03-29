const BASE_URL = 'http://localhost:3000/todos';

export async function fetchTodos() {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch todos: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching todos:', error);
        return [];
    }
}

export async function createTodo(title) {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, done: false })
        });
        if (!response.ok) {
            throw new Error(`Failed to create todo: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating todo:', error);
        throw error;
    }
}

export async function toggleTodo(id, currentDone) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ done: !currentDone })
        });
        if (!response.ok) {
            throw new Error(`Failed to toggle todo: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error toggling todo:', error);
        throw error;
    }
}

export async function deleteTodo(id) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Failed to delete todo: ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
    }
}