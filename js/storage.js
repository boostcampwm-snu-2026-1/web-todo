const resourceURL = "https://69bfd08f72ca04f3bcb997b8.mockapi.io/api/v1/todo";

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`MockAPI request failed: ${res.status}`);
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export async function loadTodos() {
  const data = await request(resourceURL, { method: "GET" });
  return Array.isArray(data) ? data : [];
}

export async function createTodo(todo) {
  return request(resourceURL, {
    method: "POST",
    body: JSON.stringify({
      task: todo.task,
      done: todo.done,
    }),
  });
}

export async function updateTodo(todo) {
  return request(`${resourceURL}/${todo.id}`, {
    method: "PUT",
    body: JSON.stringify({
      task: todo.task,
      done: todo.done,
    }),
  });
}

export async function deleteTodo(id) {
  await request(`${resourceURL}/${id}`, {
    method: "DELETE",
  });
}
