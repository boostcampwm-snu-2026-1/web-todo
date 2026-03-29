const TODO_API_ENDPOINT = "http://localhost:3000/todos";

function normalizeTodoId(rawId) {
  if (rawId === null || rawId === undefined || rawId === "") {
    return null;
  }

  return String(rawId);
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

function createTodoRequestBody(content) {
  return {
    content,
    completed: false,
  };
}

function createTodoCompletionPutBody(completed) {
  return {
    completed,
  };
}

function createTodoContentPutBody(content) {
  return {
    content,
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

export async function createTodoOnServer(content) {
  const response = await fetch(TODO_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createTodoRequestBody(content)),
  });

  if (!response.ok) {
    throw new Error(`Failed to create todo: ${response.status}`);
  }

  const result = await response.json();
  return mapServerTodoToClientTodo(result);
}

export async function putTodoCompletionOnServer(todoId, completed) {
  if (!todoId) {
    throw new Error("Cannot update todo completion without a valid id.");
  }

  const response = await fetch(`${TODO_API_ENDPOINT}/${todoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createTodoCompletionPutBody(completed)),
  });

  if (!response.ok) {
    throw new Error(`Failed to put todo completion: ${response.status}`);
  }

  const result = await response.json();
  return mapServerTodoToClientTodo(result);
}

export async function putTodoContentOnServer(todoId, content) {
  if (!todoId) {
    throw new Error("Cannot update todo content without a valid id.");
  }

  const response = await fetch(`${TODO_API_ENDPOINT}/${todoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createTodoContentPutBody(content)),
  });

  if (!response.ok) {
    throw new Error(`Failed to put todo content: ${response.status}`);
  }

  const result = await response.json();
  return mapServerTodoToClientTodo(result);
}

export async function deleteTodoOnServer(todoId) {
  if (!todoId) {
    throw new Error("Cannot delete todo without a valid id.");
  }

  const response = await fetch(`${TODO_API_ENDPOINT}/${todoId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete todo: ${response.status}`);
  }
}

export async function resetAllTodosOnServer() {
  const response = await fetch(TODO_API_ENDPOINT, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to reset todos: ${response.status}`);
  }
}
