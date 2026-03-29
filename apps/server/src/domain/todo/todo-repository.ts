import type { Todo } from './todo.js';

export type TodoRepository = {
  findAll: () => Promise<Todo[]>;
  findById: (id: string) => Promise<Todo | null>;
  create: (content: string) => Promise<Todo>;
  updateContent: (id: string, content: string) => Promise<Todo | null>;
  toggleDone: (id: string) => Promise<Todo | null>;
  deleteById: (id: string) => Promise<Todo | null>;
};
