import {
  todos,
  addTodoFromServer,
  setTodos,
  toggleTodo,
  deleteTodo,
} from "./state.js";
import { renderTodos } from "./render.js";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodoRequest,
} from "./api.js";

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

async function init() {
  const serverTodos = await fetchTodos();
  setTodos(serverTodos);
  renderTodos(todoList);
}

todoForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const content = todoInput.value.trim();
  if (content === "") return;

  const newTodo = await createTodo(content);
  addTodoFromServer(newTodo);
  renderTodos(todoList);
  todoInput.value = "";
});

todoList.addEventListener("click", async (event) => {
  const li = event.target.closest("li");
  if (!li) return;

  const id = Number(li.dataset.id);
  const targetTodo = todos.find((item) => item.id === id);

  if (!targetTodo) return;

  if (event.target.classList.contains("toggle")) {
    const updatedTodo = await updateTodo(targetTodo);
    targetTodo.done = updatedTodo.done;
    renderTodos(todoList);
  }

  if (event.target.classList.contains("delete")) {
    await deleteTodoRequest(id);
    deleteTodo(id);
    renderTodos(todoList);
  }
});

init();