import { ERROR_CODE } from '../domain/detailed-error.js';
import type { TodoRepository } from '../domain/todo/todo-repository.js';
import type { TodoService } from '../domain/todo/todo-service.js';
import { isError } from '../utils/error-type-guard.js';
import { error, success } from './response.js';

export const implTodoService = ({
  todoRepository,
}: {
  todoRepository: TodoRepository;
}): TodoService => ({
  readAllTodo: async () => {
    try {
      const todos = await todoRepository.findAll();
      return success(todos);
    } catch {
      return error(ERROR_CODE.SERVER_ERROR, '서버 에러');
    }
  },

  readTodoById: async (id: string) => {
    try {
      const todo = await todoRepository.findById(id);
      if (todo === null)
        return error(ERROR_CODE.NOT_FOUND, 'Todo를 찾을 수 없습니다.');
      return success(todo);
    } catch (err) {
      if (isError(err) && err.name === 'CastError')
        return error(ERROR_CODE.INVALID_ID, '유효하지 않은 ID입니다.');
      return error(ERROR_CODE.SERVER_ERROR, '서버 에러');
    }
  },

  createTodo: async (content: string) => {
    try {
      const todo = await todoRepository.create(content.trim());
      return success(todo);
    } catch {
      return error(ERROR_CODE.SERVER_ERROR, '서버 에러');
    }
  },

  updateTodo: async (id: string, content: string) => {
    try {
      const updated = await todoRepository.updateContent(id, content.trim());
      if (updated === null)
        return error(ERROR_CODE.NOT_FOUND, 'Todo를 찾을 수 없습니다.');
      return success(updated);
    } catch (err) {
      if (isError(err) && err.name === 'CastError')
        return error(ERROR_CODE.INVALID_ID, '유효하지 않은 ID입니다.');
      return error(ERROR_CODE.SERVER_ERROR, '서버 에러');
    }
  },

  updateTodoDone: async (id: string) => {
    try {
      const todo = await todoRepository.toggleDone(id);
      if (todo === null) {
        return error(ERROR_CODE.NOT_FOUND, 'Todo를 찾을 수 없습니다.');
      }
      return success(todo);
    } catch (err) {
      if (isError(err) && err.name === 'CastError') {
        return error(ERROR_CODE.INVALID_ID, '유효하지 않은 ID입니다.');
      }
      return error(ERROR_CODE.SERVER_ERROR, '서버 에러');
    }
  },

  deleteTodoById: async (id: string) => {
    try {
      const deleted = await todoRepository.deleteById(id);
      if (deleted === null) {
        return error(ERROR_CODE.NOT_FOUND, 'Todo를 찾을 수 없습니다.');
      }
      return success({ id });
    } catch (err) {
      if (isError(err) && err.name === 'CastError')
        return error(ERROR_CODE.INVALID_ID, '유효하지 않은 ID입니다.');
      return error(ERROR_CODE.SERVER_ERROR, '서버 에러');
    }
  },
});
