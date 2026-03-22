export const createTodoService = (storage) => {
  const list = () => storage.get();

  const getById = (id) => list().find((todo) => todo.id === id) ?? null;

  const add = (content) => {
    const todos = list();
    const newId = (todos.length ? Math.max(...todos.map((todo) => todo.id)) : 0) + 1;

    todos.push({ id: newId, content, done: false });
    storage.set(todos);
  };

  const toggle = (id, checked) => {
    const todos = list();
    const target = todos.find((todo) => todo.id === id);
    if (!target) return;

    target.done = checked;
    storage.set(todos);
  };

  const remove = (id) => {
    const todos = list().filter((todo) => todo.id !== id);
    storage.set(todos);
  };

  const edit = (id, content) => {
    const todos = list();
    const target = todos.find((todo) => todo.id === id);
    if (!target) return;

    target.content = content;
    storage.set(todos);
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
