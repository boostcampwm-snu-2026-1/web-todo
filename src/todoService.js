import {
  createTodo,
  deleteTodo,
  fetchTodoById,
  fetchTodos,
  updateTodo,
} from './todoApi.js';

const toViewTodo = (serverTodo) => ({
  id: String(serverTodo.id),
  content: serverTodo.content ?? '',
  done: Boolean(serverTodo.completed),
});

export const createTodoService = () => {
  const list = async () => {
    const todos = await fetchTodos();
    return todos.map(toViewTodo);
  };

  const getById = async (id) => {
    const todo = await fetchTodoById(id);
    return toViewTodo(todo);
  };

  const add = async (content) => {
    const created = await createTodo(content);
    return toViewTodo(created);
  };

  const toggle = async (id, checked) => {
    const updated = await updateTodo(id, { completed: checked });
    return toViewTodo(updated);
  };

  const remove = async (id) => {
    await deleteTodo(id);
  };

  const edit = async (id, content) => {
    const updated = await updateTodo(id, { content });
    return toViewTodo(updated);
  };

  return {
    list,
    getById,
    add,
    toggle,
    remove,
    edit,
  };
};
