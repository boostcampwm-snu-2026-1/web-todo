import { bindTodoEvents } from "./events.js";
import { loadTodos } from "./storage.js";
import { getTodos, setTodos } from "./todo.js";
import { renderTodos } from "./ui.js";

async function init() {
  try {
    const savedTodos = await loadTodos();
    setTodos(savedTodos);
  } catch (error) {
    console.error("Failed to load todos from MockAPI.", error);
    setTodos([]);
  }

  renderTodos(getTodos());
  bindTodoEvents();
}

init();
