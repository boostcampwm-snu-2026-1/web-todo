import type { ErrorResponse, SuccessResponse } from './api-domain';
import type {
  CreateOrPatchTodo,
  TodoIdParams,
  TodoResponse,
} from './api-scheme';

export type ApiRepository = {
  'GET /todos': () => Promise<SuccessResponse<TodoResponse[]> | ErrorResponse>;
  'GET /todos/:id': (p: {
    params: TodoIdParams;
  }) => Promise<SuccessResponse<TodoResponse> | ErrorResponse>;
  'POST /todos': (p: {
    body: CreateOrPatchTodo;
  }) => Promise<SuccessResponse<TodoResponse[]> | ErrorResponse>;
  'PATCH /todos/:id': (p: {
    params: TodoIdParams;
    body: CreateOrPatchTodo;
  }) => Promise<SuccessResponse<TodoResponse[]> | ErrorResponse>;
  'DELETE /todos/:id': (p: {
    params: TodoIdParams;
  }) => Promise<SuccessResponse<TodoResponse[]> | ErrorResponse>;
};
