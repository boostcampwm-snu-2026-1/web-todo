import { addTodo, toggleTodo, deleteTodo } from "./state.js";
import { renderTodos } from "./render.js";

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const content = todoInput.value.trim();
  if (content === "") return;

  addTodo(content);
  renderTodos(todoList);
  todoInput.value = "";
});

todoList.addEventListener("click", (event) => {
  const li = event.target.closest("li");
  if (!li) return;

  const id = Number(li.dataset.id);

  if (event.target.classList.contains("toggle")) {
    toggleTodo(id);
    renderTodos(todoList);
  }

  if (event.target.classList.contains("delete")) {
    deleteTodo(id);
    renderTodos(todoList);
  }
});

renderTodos(todoList);