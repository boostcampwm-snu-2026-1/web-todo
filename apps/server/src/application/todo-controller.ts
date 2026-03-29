import { ERROR_CODE } from '../domain/detailed-error.js';
import type { TodoController } from '../domain/todo/todo-controller.js';
import type { TodoService } from '../domain/todo/todo-service.js';
import { error, sendResponse } from './response.js';

export const implTodoController = ({
  todoService,
}: {
  todoService: TodoService;
}): TodoController => ({
  readAllTodo: async (_, res) => {
    const result = await todoService.readAllTodo();
    sendResponse(res, result);
  },

  readTodoById: async ({ params }, res) => {
    const result = await todoService.readTodoById(params.id);
    sendResponse(res, result);
  },

  createTodo: async ({ body }, res) => {
    const { content } = body;
    if (!content || content.trim() === '') {
      res
        .status(400)
        .json(error(ERROR_CODE.INVALID_INPUT, 'Content는 필수입니다.'));
      return;
    }
    const result = await todoService.createTodo(content);
    sendResponse(res, result, 201);
  },

  updateTodo: async ({ params, body }, res) => {
    const { content } = body;
    if (!content || content.trim() === '') {
      res
        .status(400)
        .json(error(ERROR_CODE.INVALID_INPUT, 'Content는 필수입니다.'));
      return;
    }
    const result = await todoService.updateTodo(params.id, content);
    sendResponse(res, result);
  },

  updateTodoDone: async ({ params }, res) => {
    const result = await todoService.updateTodoDone(params.id);
    sendResponse(res, result);
  },

  deleteTodoById: async ({ params }, res) => {
    const result = await todoService.deleteTodoById(params.id);
    sendResponse(res, result);
  },
});
