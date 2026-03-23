import { requestJson } from './apiClient.js';
import { API_BASE_URL } from './config.js';

// save API_BASE_URL in config.js
const TODO_ENDPOINT = `${API_BASE_URL}/todo`;

export const fetchTodos = () => requestJson(TODO_ENDPOINT);

export const fetchTodoById = (id) => requestJson(`${TODO_ENDPOINT}/${id}`);

export const createTodo = (content) =>
  requestJson(TODO_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({ content, completed: false }),
  });

export const updateTodo = (id, payload) =>
  requestJson(`${TODO_ENDPOINT}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const deleteTodo = (id) =>
  requestJson(`${TODO_ENDPOINT}/${id}`, {
    method: 'DELETE',
  });
