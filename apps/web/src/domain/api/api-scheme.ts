export type TodoResponse = {
  id: string;
  content: string;
  done: boolean;
};

export type TodoIdParams = {
  id: string;
};

export type CreateOrPatchTodo = {
  content: string;
  done: boolean;
};
