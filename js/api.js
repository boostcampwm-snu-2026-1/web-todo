const BASE_URL = "https://69ca91c3ba5984c44bf37106.mockapi.io/todos";

function normalizeTodo(todo) {
  return {
    id: Number(todo.id),
    content: todo.content,
    done: Boolean(todo.done),
  };
}

export async function fetchTodos() {
  const response = await fetch(BASE_URL);
  const data = await response.json();

  return data.map(normalizeTodo);
}

export async function createTodo(content) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      done: false,
    }),
  });

  const data = await response.json();
  return normalizeTodo(data);
}

export async function updateTodo(todo) {
  const response = await fetch(`${BASE_URL}/${todo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: todo.content,
      done: !todo.done,
    }),
  });

  const data = await response.json();
  return normalizeTodo(data);
}

export async function deleteTodoRequest(id) {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
}