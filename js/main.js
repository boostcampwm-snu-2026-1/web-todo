import { todoState } from "./state.js";
import { renderTodos } from "./render.js";

const todoList = document.querySelector("#todo-list");

renderTodos(todoList, todoState.todos);
