/* 서버 통신 모듈 */

const BASE_URL = "https://69b93726e69653ffe6a6f05b.mockapi.io/api/v1/todos";

export async function fetchTodosApi() {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error("로드 실패");
    return await response.json();
}

export async function addTodoApi(data) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("추가 실패");
    return await response.json();
}

export async function toggleTodoApi(targetId, doneStatus) {
    const response = await fetch(`${BASE_URL}/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: doneStatus })
    });
    if (!response.ok) throw new Error("수정 실패");
    return await response.json();
}

export async function deleteTodoApi(targetId) {
    const response = await fetch(`${BASE_URL}/${targetId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error("삭제 실패");
    return true;
}