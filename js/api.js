const BASE_URL = '/api/todos';

export const todoAPI = {
    async fetchTodos() {
        const response = await fetch(BASE_URL);
        return await response.json();
    },
    async createTodo(newTodo) {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTodo)
        });
        return await response.json();
    },
    async updateTodo(id, updates) {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        return await response.json();
    },
    async deleteTodo(id) {
        await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    }
};