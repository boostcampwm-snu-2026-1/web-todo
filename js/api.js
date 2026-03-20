const BASE_URL = 'https://69bceaae2bc2a25b22acbf9c.mockapi.io/todos'; // MockAPI 주소로 교체하세요!

export const todoAPI = {
    async fetchTodos() {
        const response = await fetch(BASE_URL);
        return await response.json();
    },
    async createTodo(text) {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: text, completed: false })
        });
        return await response.json();
    },
    async updateTodo(id, updates) {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        return await response.json();
    },
    async deleteTodo(id) {
        await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    }
};