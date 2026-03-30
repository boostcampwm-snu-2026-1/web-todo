const defaultAPIOrigin =
  typeof window === "undefined"
    ? "http://127.0.0.1:3000"
    : `${window.location.protocol}//${window.location.hostname}:3000`;

const apiOrigin = import.meta.env?.VITE_API_ORIGIN ?? defaultAPIOrigin;
const resourceURL = new URL("/api/todos", apiOrigin).toString();

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    let message = `API request failed: ${res.status}`;

    try {
      const errorBody = await res.json();
      if (typeof errorBody?.message === "string" && errorBody.message) {
        message = errorBody.message;
      }
    } catch {}

    throw new Error(message);
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
