import express from 'express';
import type { TodoController } from '../domain/todo/todo-controller.js';

export const implTodoRouter = ({
  todoController,
}: {
  todoController: TodoController;
}) => {
  const router = express.Router();
  router.get('/', todoController.readAllTodo);
  router.get('/:id', todoController.readTodoById);
  router.post('/', todoController.createTodo);
  router.patch('/:id', todoController.updateTodo);
  router.patch('/:id/toggle', todoController.updateTodoDone);
  router.delete('/:id', todoController.deleteTodoById);
  return router;
};
