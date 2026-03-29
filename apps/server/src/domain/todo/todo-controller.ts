import type { Handler } from '../../application/handler.js';

type IdParam = { id: string };
type ContentBody = { content: string };

export type TodoController = {
  readAllTodo: Handler;
  readTodoById: Handler<IdParam>;
  createTodo: Handler<unknown, ContentBody>;
  updateTodo: Handler<IdParam, ContentBody>;
  updateTodoDone: Handler<IdParam>;
  deleteTodoById: Handler<IdParam>;
};
