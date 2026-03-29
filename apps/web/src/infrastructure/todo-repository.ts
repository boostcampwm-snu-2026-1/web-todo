import type { ApiRepository } from '../domain/api/api-repository';
import type { TodoRepository } from '../domain/todo-interface';

export const implTodoRepository = ({
  apiRepository,
}: {
  apiRepository: ApiRepository;
}): TodoRepository => {
  return {
    getTodos: async () => {
      const response = await apiRepository['GET /todos']();
      if (response.status !== 200) {
        return { state: 'error', detailedError: 'TODO_FETCH_FAILED' };
      }

      return {
        state: 'success',
        data: response.data,
      };
    },
    getTodoById: async ({ id }) => {
      const params = { id };
      const response = await apiRepository['GET /todos/:id']({ params });
      if (response.status !== 200) {
        return { state: 'error', detailedError: 'TODO_FETCH_BY_ID_FAILED' };
      }
      return {
        state: 'success',
        data: response.data,
      };
    },
    createTodo: async ({ content }) => {
      const body = {
        content,
        done: false,
      };
      const response = await apiRepository['POST /todos']({ body });
      if (response.status !== 201) {
        return { state: 'error', detailedError: 'TODO_CREATE_FAILED' };
      }
      return {
        state: 'success',
        data: response.data,
      };
    },
    updateTodo: async ({ id, content, done }) => {
      const params = { id };
      const body = { content, done };
      const response = await apiRepository['PATCH /todos/:id']({
        params,
        body,
      });
      if (response.status !== 200) {
        return { state: 'error', detailedError: 'TODO_UPDATE_FAILED' };
      }
      return {
        state: 'success',
        data: response.data,
      };
    },
    deleteTodo: async ({ id }) => {
      const params = { id };
      const response = await apiRepository['DELETE /todos/:id']({ params });
      if (response.status !== 200) {
        return { state: 'error', detailedError: 'TODO_DELETE_FAILED' };
      }
      return {
        state: 'success',
        data: response.data,
      };
    },
  };
};
