import type {
  RepositoryResponseType,
  UseCaseResponseType,
} from './response-type';

export type Todo = {
  id: number;
  content: string;
  done: boolean;
};

export type TodoRepository = {
  readTodos: () => Promise<RepositoryResponseType<Todo[]>>;
  writeTodos: ({
    todos,
  }: {
    todos: Todo[];
  }) => Promise<RepositoryResponseType<void>>;
};

export type TodoUsecase = {
  addTodo: ({
    content,
  }: {
    content: string;
  }) => Promise<UseCaseResponseType<void>>;
  listTodos: () => Promise<UseCaseResponseType<Todo[]>>;
  toggleTodo: ({ id }: { id: number }) => Promise<UseCaseResponseType<void>>;
  deleteTodo: ({
    id,
  }: {
    id: number;
  }) => Promise<UseCaseResponseType<{ id: number; removedContent: string }>>;
  updateTodo: ({
    id,
    newContent,
  }: {
    id: number;
    newContent: string;
  }) => Promise<
    UseCaseResponseType<{
      id: number;
      newContent: string;
      oldContent: string;
    }>
  >;
};
