import type { TodoRepository, TodoUsecase } from '../domain/todo-interface';

export const implTodoUsecase = ({
  todoRepository,
}: {
  todoRepository: TodoRepository;
}): TodoUsecase => ({
  addTodo: ({ content }) => {
    return todoRepository.createTodo({ content });
  },

  listTodos: async () => {
    return await todoRepository.getTodos();
  },

  toggleTodo: async ({ id }) => {
    const originalTodoResponse = await todoRepository.getTodoById({ id });

    if (originalTodoResponse.state === 'error') {
      return {
        state: 'error',
        detailedError: 'NOT_FOUND_ID_IN_TOGGLE',
      };
    }
    const originalTodo = originalTodoResponse.data;

    return todoRepository.updateTodo({
      id,
      content: originalTodo.content,
      done: !originalTodo.done,
    });
  },

  deleteTodo: ({ id }) => {
    return todoRepository.deleteTodo({ id });
  },

  updateTodo: async ({ id, newContent }) => {
    const originalTodoResponse = await todoRepository.getTodoById({ id });

    if (originalTodoResponse.state === 'error') {
      return {
        state: 'error',
        detailedError: 'NOT_FOUND_ID_IN_TOGGLE',
      };
    }
    const originalTodo = originalTodoResponse.data;

    return todoRepository.updateTodo({
      id,
      content: newContent,
      done: originalTodo.done,
    });
  },
});
