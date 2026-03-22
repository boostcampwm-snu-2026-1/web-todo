export type TodoResponse = {
  id: number;
  content: string;
  done: boolean;
};

export type TodoIdParams = {
  id: number;
};

export type CreateOrPatchTodo = {
  content: string;
  done: boolean;
};
