const BASE_URL = 'https://69be33ee17c3d7d977916f8b.mockapi.io/todos'; 

export async function getTodos() {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error('데이터를 불러오는데 실패했습니다.');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function createTodo(content) {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: content,
                done: false
            })
        });
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

export async function deleteTodoApi(id) {
    try {
        await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error(error);
    }
}

export async function toggleTodoApi(id, currentDone) {
    try {
        await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                done: !currentDone
            })
        });
    } catch (error) {
        console.error(error);
    }
}