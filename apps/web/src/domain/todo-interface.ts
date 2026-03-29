import type {
  RepositoryResponseType,
  UseCaseResponseType,
} from './response-type';

export type Todo = {
  id: string;
  content: string;
  done: boolean;
};

export type TodoRepository = {
  getTodos: () => Promise<RepositoryResponseType<Todo[]>>;
  getTodoById: ({
    id,
  }: {
    id: string;
  }) => Promise<RepositoryResponseType<Todo>>;
  createTodo: ({
    content,
  }: {
    content: string;
  }) => Promise<RepositoryResponseType<Todo[]>>;
  updateTodo: ({
    id,
    content,
    done,
  }: {
    id: string;
    content: string;
    done: boolean;
  }) => Promise<RepositoryResponseType<Todo[]>>;
  deleteTodo: ({
    id,
  }: {
    id: string;
  }) => Promise<RepositoryResponseType<Todo[]>>;
};

export type TodoUsecase = {
  addTodo: ({
    content,
  }: {
    content: string;
  }) => Promise<UseCaseResponseType<void>>;
  listTodos: () => Promise<UseCaseResponseType<Todo[]>>;
  toggleTodo: ({ id }: { id: string }) => Promise<UseCaseResponseType<void>>;
  deleteTodo: ({ id }: { id: string }) => Promise<UseCaseResponseType<void>>;
  updateTodo: ({
    id,
    newContent,
  }: {
    id: string;
    newContent: string;
  }) => Promise<UseCaseResponseType<void>>;
};
