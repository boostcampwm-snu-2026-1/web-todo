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