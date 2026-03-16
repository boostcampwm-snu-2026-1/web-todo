import type { TodoRepository, TodoUsecase } from '../domain/todo-interface';

export const implTodoUsecase = ({
  todoRepository,
}: {
  todoRepository: TodoRepository;
}): TodoUsecase => ({
  addTodo: async ({ content }) => {
    const result = await todoRepository.readTodos();
    if (result.state === 'error') return result;

    const { data: todos } = result;
    const newId =
      todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;

    return todoRepository.writeTodos({
      todos: [...todos, { id: newId, content, done: false }],
    });
  },

  listTodos: async () => {
    return await todoRepository.readTodos();
  },

  toggleTodo: async ({ id }) => {
    const result = await todoRepository.readTodos();
    if (result.state === 'error') return result;

    const { data: todos } = result;
    const todo = todos.find((t) => t.id === id);
    if (todo === undefined) {
      return {
        state: 'error',
        detailedError: 'NOT_FOUND_ID_IN_TOGGLE',
      } as const;
    }

    return todoRepository.writeTodos({
      todos: todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    });
  },

  deleteTodo: async ({ id }) => {
    const result = await todoRepository.readTodos();
    if (result.state === 'error') return result;

    const { data: todos } = result;
    const todo = todos.find((t) => t.id === id);
    if (todo === undefined) {
      return {
        state: 'error',
        detailedError: 'NOT_FOUND_ID_IN_DELETE',
      } as const;
    }

    const response = await todoRepository.writeTodos({
      todos: todos.filter((t) => t.id !== id),
    });
    if (response.state === 'error') return response;

    return {
      state: 'success',
      data: { id, removedContent: todo.content },
    } as const;
  },

  updateTodo: async ({ id, newContent }) => {
    const result = await todoRepository.readTodos();
    if (result.state === 'error') return result;

    const { data: todos } = result;
    const todo = todos.find((t) => t.id === id);
    if (todo === undefined) {
      return {
        state: 'error',
        detailedError: 'NOT_FOUND_ID_IN_UPDATE',
      } as const;
    }

    const response = await todoRepository.writeTodos({
      todos: todos.map((t) =>
        t.id === id ? { ...t, content: newContent } : t
      ),
    });
    if (response.state === 'error') return response;

    return {
      state: 'success',
      data: { id, oldContent: todo.content, newContent },
    } as const;
  },
});
