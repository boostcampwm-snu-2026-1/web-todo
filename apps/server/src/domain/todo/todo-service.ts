import type { ApiResponse } from '../response.js';
import type { Todo } from './todo.js';

export type TodoService = {
  readAllTodo: () => Promise<ApiResponse<Todo[]>>;
  readTodoById: (id: string) => Promise<ApiResponse<Todo>>;
  createTodo: (content: string) => Promise<ApiResponse<Todo>>;
  updateTodo: (id: string, content: string) => Promise<ApiResponse<Todo>>;
  updateTodoDone: (id: string) => Promise<ApiResponse<Todo>>;
  deleteTodoById: (id: string) => Promise<ApiResponse<{ id: string }>>;
};
