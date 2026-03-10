/** Fetch all todos from the server */
export async function fetchTodos() {
  const response = await fetch('/api/todos');
  return response.json();
}

/** Create a new todo with the given content */
export async function createTodo(content) {
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  return response.json();
}

/** Toggle the done status of a todo by id */
export async function toggleTodoAPI(id) {
  const response = await fetch(`/api/todos/${id}/toggle`, {
    method: 'PATCH'
  });
  return response.json();
}

/** Delete a todo by id */
export async function deleteTodoAPI(id) {
  const response = await fetch(`/api/todos/${id}`, {
    method: 'DELETE'
  });
  return response.json();
}
