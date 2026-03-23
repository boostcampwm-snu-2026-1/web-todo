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
  getTodos: () => Promise<RepositoryResponseType<Todo[]>>;
  getTodoById: ({
    id,
  }: {
    id: number;
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
    id: number;
    content: string;
    done: boolean;
  }) => Promise<RepositoryResponseType<Todo[]>>;
  deleteTodo: ({
    id,
  }: {
    id: number;
  }) => Promise<RepositoryResponseType<Todo[]>>;
};

export type TodoUsecase = {
  addTodo: ({
    content,
  }: {
    content: string;
  }) => Promise<UseCaseResponseType<void>>;
  listTodos: () => Promise<UseCaseResponseType<Todo[]>>;
  toggleTodo: ({ id }: { id: number }) => Promise<UseCaseResponseType<void>>;
  deleteTodo: ({ id }: { id: number }) => Promise<UseCaseResponseType<void>>;
  updateTodo: ({
    id,
    newContent,
  }: {
    id: number;
    newContent: string;
  }) => Promise<UseCaseResponseType<void>>;
};
