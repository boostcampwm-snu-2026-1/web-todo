const API_URL = 'https://69b93649e69653ffe6a6ebf9.mockapi.io/todoweb';

// 외부(todo.js)에서 이 함수들을 가져다 쓸 수 있도록 앞에 'export'를 붙여줌

// 1. 데이터 가져오기 (GET)
export async function getTodosAPI() {
    const response = await fetch(API_URL);
    return await response.json();
}

// 2. 데이터 추가하기 (POST)
export async function createTodoAPI(newTodo) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
    });
    return response.ok; // 성공하면 true 반환
}

// 3. 데이터 삭제하기 (DELETE)
export async function deleteTodoAPI(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    return response.ok;
}

// 4. 데이터 수정하기 (PUT)
export async function updateTodoAPI(id, isCompleted) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: isCompleted })
    });
    return response.ok;
}