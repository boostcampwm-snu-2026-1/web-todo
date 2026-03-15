let todos = [];

export function setTodos(newTodos) {
  todos = newTodos;
}

export function getTodos() {
  return todos;
}

export function addTodo(task) {
  const todo = {
    id: crypto.randomUUID(),
    task: task,
    done: false,
  };

  setTodos([...todos, todo]);
}

export function removeTodo(id) {
  setTodos(todos.filter((t) => t.id !== id));
}

export function updateTodo(id, task) {
  setTodos(todos.map((t) => (t.id === id ? { ...t, task } : t)));
}

export function toggleTodo(id) {
  setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
}
