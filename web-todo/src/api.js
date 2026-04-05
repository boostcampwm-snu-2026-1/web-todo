export const apiUrl = 'http://localhost:5001/todos';  

export const getTodos = async () => {
  const response = await fetch(apiUrl);
  return response.json();
};

export const addTodo = async (text) => {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, completed: false }),
  });
  return response.json();
};

export const toggleTodo = async (id) => {
  const response = await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
  });
  return response.json();
};

export const deleteTodo = async (id) => {
  const response = await fetch(`${apiUrl}/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};