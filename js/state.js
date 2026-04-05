export let todos = JSON.parse(localStorage.getItem("todos")) || [];
export let nextId =
  todos.length === 0 ? 1 : Math.max(...todos.map((todo) => todo.id)) + 1;

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

export function setTodos(newTodos) {
  todos = newTodos;
  nextId =
    todos.length === 0 ? 1 : Math.max(...todos.map((todo) => todo.id)) + 1;
  saveTodos();
}

export function addTodoFromServer(todo) {
  todos.push(todo);
  nextId =
    todos.length === 0 ? 1 : Math.max(...todos.map((todo) => todo.id)) + 1;
  saveTodos();
}

export function addTodo(content) {
  todos.push({
    id: nextId,
    content,
    done: false,
  });

  nextId += 1;
  saveTodos();
}

export function toggleTodo(id) {
  const todo = todos.find((item) => item.id === id);
  if (todo) {
    todo.done = !todo.done;
    saveTodos();
  }
}

export function deleteTodo(id) {
  todos = todos.filter((item) => item.id !== id);
  saveTodos();
}