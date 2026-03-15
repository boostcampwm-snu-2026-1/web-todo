import { saveTodos } from "./storage.js";
import {
  addTodo,
  getTodos,
  removeTodo,
  toggleTodo,
  updateTodo,
} from "./todo.js";
import { renderTodos, startEditingTodo, stopEditingTodo } from "./ui.js";

function focusEditInput(list, id) {
  const editInput = list.querySelector(`.todo-edit-input[data-id="${id}"]`);
  if (!editInput) return;

  editInput.focus();
  editInput.select();
}

function saveEditedTodo(list, id) {
  const currentTodo = getTodos().find((todo) => todo.id === id);
  if (!currentTodo) return false;

  const editInput = list.querySelector(`.todo-edit-input[data-id="${id}"]`);
  if (!editInput) return false;

  const trimmedTask = editInput.value.trim();
  if (!trimmedTask) {
    editInput.focus();
    return false;
  }

  stopEditingTodo();

  if (trimmedTask === currentTodo.task) {
    return true;
  }

  updateTodo(id, trimmedTask);
  saveTodos(getTodos());
  return true;
}

export function bindTodoEvents() {
  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const task = input.value.trim();
    if (!task) return;

    addTodo(task);
    input.value = "";

    saveTodos(getTodos());
    renderTodos(getTodos());
  });

  list.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;
    if (!id || !action) return;

    let hasChanged = false;

    if (action === "edit") {
      startEditingTodo(id);
      renderTodos(getTodos());
      focusEditInput(list, id);
      return;
    }

    if (action === "cancel-edit") {
      stopEditingTodo();
      renderTodos(getTodos());
      return;
    }

    if (action === "save-edit") {
      const isSaved = saveEditedTodo(list, id);
      if (!isSaved) return;

      renderTodos(getTodos());
      return;
    }

    if (action === "toggle") {
      toggleTodo(id);
      hasChanged = true;
    }

    if (action === "delete") {
      removeTodo(id);
      hasChanged = true;
    }

    if (!hasChanged) return;

    saveTodos(getTodos());
    renderTodos(getTodos());
  });

  list.addEventListener("keydown", (e) => {
    const editInput = e.target.closest(".todo-edit-input");
    if (!editInput) return;

    const id = editInput.dataset.id;
    if (!id) return;

    if (e.key === "Enter") {
      e.preventDefault();

      const isSaved = saveEditedTodo(list, id);
      if (!isSaved) return;

      renderTodos(getTodos());
    }

    if (e.key === "Escape") {
      stopEditingTodo();
      renderTodos(getTodos());
    }
  });
}
