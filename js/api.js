const API_ENDPOINT = "https://69bbf34c0915748735bac056.mockapi.io/api/v1/todos";

function sortTodos(todos) {
  return todos
    .map((todo) => ({
      ...todo,
      order: Number(todo.order),
    }))
    .sort((left, right) => left.order - right.order);
}

async function request(path = "", init = {}) {
  const response = await fetch(`${API_ENDPOINT}${path}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function getTodo(id) {
  return request(`/${id}`);
}

async function putTodo(todo) {
  return request(`/${todo.id}`, {
    method: "PUT",
    body: JSON.stringify(todo),
  });
}

export async function getTodos() {
  const todos = await request();
  return sortTodos(todos);
}

export async function addTodo(title) {
  return request("", {
    method: "POST",
    body: JSON.stringify({
      createdAt: new Date().toISOString(),
      title,
      completed: false,
      order: Date.now(),
    }),
  });
}

export async function toggleTodo(id) {
  const todo = await getTodo(id);

  return putTodo({
    ...todo,
    completed: !todo.completed,
    order: Number(todo.order),
  });
}

export async function updateTodo(id, title) {
  const todo = await getTodo(id);

  return putTodo({
    ...todo,
    title,
    order: Number(todo.order),
  });
}

export async function deleteTodo(id) {
  await request(`/${id}`, { method: "DELETE" });
}

export async function reorderTodos(draggedId, targetId, position) {
  if (draggedId === targetId) {
    return null;
  }

  const todos = await getTodos();
  const draggedIndex = todos.findIndex((todo) => todo.id === draggedId);
  const targetIndex = todos.findIndex((todo) => todo.id === targetId);

  if (draggedIndex === -1 || targetIndex === -1) {
    throw new Error(`Unable to reorder todos from ${API_ENDPOINT}.`);
  }

  const nextTodos = [...todos];
  const [draggedTodo] = nextTodos.splice(draggedIndex, 1);
  const adjustedTargetIndex = nextTodos.findIndex((todo) => todo.id === targetId);
  const insertIndex =
    position === "after" ? adjustedTargetIndex + 1 : adjustedTargetIndex;

  nextTodos.splice(insertIndex, 0, draggedTodo);

  return Promise.all(
    nextTodos.map((todo, index) =>
      putTodo({
        ...todo,
        order: index + 1,
      })
    )
  );
}
