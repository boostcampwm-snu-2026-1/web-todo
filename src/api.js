const API_URL = "https://69b93709e69653ffe6a6ef8d.mockapi.io/todos";

function makeOptions(method, body) {
  if (!body) {
    return { method };
  }

  return {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

async function request(url = "", options) {
  const response = await fetch(`${API_URL}${url}`, options);

  if (!response.ok) {
    throw new Error("request failed");
  }

  return response.json();
}

function normalizeTodo(todo) {
  return {
    id: todo.id,
    text: todo.content,
    done: Boolean(todo.completed),
  };
}

export async function getTodos() {
  const todos = await request();
  return todos.map(normalizeTodo);
}

export async function createTodo(text) {
  const todo = await request("", makeOptions("POST", { content: text, completed: false }));
  return normalizeTodo(todo);
}

export async function updateTodo(todo) {
  const nextTodo = await request(
    `/${todo.id}`,
    makeOptions("PUT", { content: todo.text, completed: !todo.done })
  );

  return normalizeTodo(nextTodo);
}

export async function deleteTodo(id) {
  await request(`/${id}`, makeOptions("DELETE"));
}
