const API_URL = 'https://69bd31e32bc2a25b22add65b.mockapi.io/todos';

export const todoApi = {
    async getAll() {
        const res = await fetch(API_URL);
        return await res.json();
    },

    // 할 일 추가
    async create(content) {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({content, completed: false})
        });
        return await res.json();
    },

    // 할 일 삭제
    async delete(id) {
        const res = await fetch(`${API_URL}/${id}`, {method: 'DELETE'});
        return res.ok;
    },

    // 할 일 완료
    async ToggleEvent(id, completed) {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({completed})
        });
        return res.ok;
    }
};