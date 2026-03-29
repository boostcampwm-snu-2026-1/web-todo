const API_URL = 'http://localhost:3000/todos';

// 서버에서 모든 할 일 목록 가져오기
export async function getTodos() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        return data.map(todo => ({
            id: todo._id,
            text: todo.content || "내용 없음", 
            completed: todo.completed
        }));
    } catch (error) {
        console.error('Fetch Error:', error);
        return [];
    }
}

// 새로운 할 일 추가하기
export async function createTodo(text) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            content: text, 
            completed: false 
        })
    });
    const todo = await response.json();

    return {
        id: todo._id,
        text: todo.content,
        completed: todo.completed
    };
}

// 할 일 삭제하기
export async function removeTodo(id) {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
}

// 완료 상태 토글하기
export async function updateTodoStatus(id, currentCompleted) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            completed: !currentCompleted 
        })
    });
    return await response.json();
}