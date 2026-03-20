const API_URL = 'https://69bd7fb12bc2a25b22aebcff.mockapi.io/api/todos';

function transformTodo(todo) {
  return {
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
  };
}

export async function fetchTodos() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }

  const data = await response.json();
  return data.map(transformTodo);
}

export async function createTodo(title) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      completed: false,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create todo');
  }

  const data = await response.json();
  return transformTodo(data);
}

export async function deleteTodo(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
}

export async function updateTodo(id, updatedFields) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedFields),
  });

  if (!response.ok) {
    throw new Error('Failed to update todo');
  }

  const data = await response.json();
  return transformTodo(data);
}