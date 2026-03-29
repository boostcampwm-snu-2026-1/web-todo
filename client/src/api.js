const BASE_URL = "http://localhost:3000";

export async function getTodo() {
  const response = await fetch(`${BASE_URL}/todos`);
  if (!response.ok) throw new Error("Todo 목록 조회 실패");
  return await response.json();
}

export async function addTodo(content) {
  const response = await fetch(`${BASE_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      done: false,
    }),
  });

  if (!response.ok) throw new Error("Todo 추가 실패");
  return await response.json();
}

export async function deleteTodo(id) {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Todo 삭제 실패");
  return await response.json();
}

export async function checkTodo(id, check) {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      done: check,
    }),
  });

  if (!response.ok) throw new Error("Todo 상태 변경 실패");
  return await response.json();
}