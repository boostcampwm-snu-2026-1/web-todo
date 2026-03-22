import type { IndexedDBRepository } from '../domain/db-interface';
import type { Todo, TodoRepository } from '../domain/todo-interface';

const todoTypeGuard = (value: unknown): value is Todo => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'content' in value &&
    'done' in value &&
    typeof (value as Todo).id === 'number' &&
    typeof (value as Todo).content === 'string' &&
    typeof (value as Todo).done === 'boolean'
  );
};

export const implTodoRepository = ({
  indexedDBRepository,
}: {
  indexedDBRepository: IndexedDBRepository;
}): TodoRepository => {
  return {
    readTodos: async () => {
      try {
        const todos = await indexedDBRepository.getAll<unknown>();

        if (!todos.every(todoTypeGuard)) {
          return { state: 'error', detailedError: 'INVALID_JSON_FORMAT' };
        }

        return { state: 'success', data: todos };
      } catch {
        return { state: 'error', detailedError: 'FILE_READ_FAILED' };
      }
    },

    writeTodos: async ({ todos }) => {
      try {
        await indexedDBRepository.replaceAll(todos);
        return { state: 'success' };
      } catch {
        return { state: 'error', detailedError: 'FILE_WRITE_FAILED' };
      }
    },
  };
};
