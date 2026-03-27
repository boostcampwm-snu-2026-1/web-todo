const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function makeOptions(method, body) {
  if (body === undefined) {
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
  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "request failed");
  }

  return data;
}

function normalizeTodo(todo) {
  return {
    id: todo.id,
    text: todo.text,
    done: Boolean(todo.done),
  };
}

export async function getTodos() {
  const todos = await request("/todos");
  return todos.map(normalizeTodo);
}

export async function createTodo(text) {
  const todo = await request("/todos", makeOptions("POST", { text }));
  return normalizeTodo(todo);
}

export async function updateTodo(todo) {
  const nextTodo = await request(`/todos/${todo.id}`, makeOptions("PATCH", { done: !todo.done }));

  return normalizeTodo(nextTodo);
}

export async function deleteTodo(id) {
  await request(`/todos/${id}`, makeOptions("DELETE"));
}
