const BASE_URL = "https://69bfc4c872ca04f3bcb92e5f.mockapi.io/todos";

export async function fetchTodos() {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error("할 일 목록을 불러오지 못했습니다.");
  }
  return response.json();
}

export async function createTodo(content) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      completed: false,
    }),
  });

  if (!response.ok) {
    throw new Error("할 일을 추가하지 못했습니다.");
  }

  return response.json();
}

export async function updateTodo(todo) {
  const response = await fetch(`${BASE_URL}/${todo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: todo.content,
      completed: todo.completed,
    }),
  });

  if (!response.ok) {
    throw new Error("할 일을 수정하지 못했습니다.");
  }

  return response.json();
}

export async function deleteTodo(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("할 일을 삭제하지 못했습니다.");
  }
}