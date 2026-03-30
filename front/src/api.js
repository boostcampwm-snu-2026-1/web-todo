// All API calls to the local Express backend
const BASE_URL = "http://localhost:3000/todos";

async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.json();
}

/** Fetch all todos */
export function fetchTodos() {
  return request(BASE_URL);
}

/** Create a new todo with the given content */
export function createTodo(content) {
  return request(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, done: false }),
  });
}

/** Update the done status of a specific todo */
export function toggleTodoAPI(id, done) {
  return request(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done }),
  });
}

/** Delete a todo by id */
export function deleteTodoAPI(id) {
  return request(`${BASE_URL}/${id}`, { method: "DELETE" });
}
