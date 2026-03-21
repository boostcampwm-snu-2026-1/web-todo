const TODO_API_ENDPOINT = "https://69be0fcd17c3d7d9779120b3.mockapi.io/api/v1/todos";

function normalizeTodoId(rawId) {
  const numericId = Number(rawId);
  return Number.isFinite(numericId) ? numericId : rawId;
}

function mapServerTodoToClientTodo(serverTodo) {
  return {
    id: normalizeTodoId(serverTodo.id),
    text: typeof serverTodo.content === "string" ? serverTodo.content : "",
    completed: Boolean(serverTodo.completed),
    createdAt: serverTodo.createdAt ?? null,
    updatedAt: serverTodo.updatedAt ?? null,
  };
}

export async function fetchTodosFromServer() {
  const response = await fetch(TODO_API_ENDPOINT);
  if (!response.ok) {
    throw new Error(`Failed to fetch todos: ${response.status}`);
  }

  const result = await response.json();
  if (!Array.isArray(result)) return [];

  return result.map(mapServerTodoToClientTodo);
}
