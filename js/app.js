import { bindTodoEvents } from "./events.js";
import { loadTodos } from "./storage.js";
import { getTodos, setTodos } from "./todo.js";
import { renderTodos } from "./ui.js";

function init() {
  const savedTodos = loadTodos();
  setTodos(savedTodos);

  renderTodos(getTodos());
  bindTodoEvents();
}

init();
