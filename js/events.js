import {
  createTodo as createRemoteTodo,
  deleteTodo as deleteRemoteTodo,
  updateTodo as updateRemoteTodo,
} from "./storage.js";
import {
  addTodo,
  getTodos,
  patchTodo,
  removeTodo,
} from "./todo.js";
import { renderTodos, startEditingTodo, stopEditingTodo } from "./ui.js";

function focusEditInput(list, id) {
  const editInput = list.querySelector(`.todo-edit-input[data-id="${id}"]`);
  if (!editInput) return;

  editInput.focus();
  editInput.select();
}

async function saveEditedTodo(list, id) {
  const currentTodo = getTodos().find((todo) => todo.id === id);
  if (!currentTodo) return false;

  const editInput = list.querySelector(`.todo-edit-input[data-id="${id}"]`);
  if (!editInput) return false;

  const trimmedTask = editInput.value.trim();
  if (!trimmedTask) {
    editInput.focus();
    return false;
  }

  if (trimmedTask === currentTodo.task) {
    stopEditingTodo();
    return true;
  }

  const savedTodo = await updateRemoteTodo({
    ...currentTodo,
    task: trimmedTask,
  });

  patchTodo(id, savedTodo);
  stopEditingTodo();
  return true;
}

export function bindTodoEvents() {
  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const task = input.value.trim();
    if (!task) return;

    try {
      const createdTodo = await createRemoteTodo({
        task,
        done: false,
      });

      addTodo(createdTodo);
      input.value = "";
      renderTodos(getTodos());
    } catch (error) {
      console.error("Failed to create todo.", error);
      alert("할 일을 저장하지 못했습니다.");
    }
  });

  list.addEventListener("click", async (e) => {
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
      try {
        const isSaved = await saveEditedTodo(list, id);
        if (!isSaved) return;

        renderTodos(getTodos());
      } catch (error) {
        console.error("Failed to update todo.", error);
        alert("할 일을 수정하지 못했습니다.");
      }
      return;
    }

    try {
      if (action === "toggle") {
        const currentTodo = getTodos().find((todo) => todo.id === id);
        if (!currentTodo) return;

        const savedTodo = await updateRemoteTodo({
          ...currentTodo,
          done: !currentTodo.done,
        });

        patchTodo(id, savedTodo);
        hasChanged = true;
      }

      if (action === "delete") {
        await deleteRemoteTodo(id);
        removeTodo(id);
        hasChanged = true;
      }

      if (!hasChanged) return;

      renderTodos(getTodos());
    } catch (error) {
      console.error(`Failed to ${action} todo.`, error);
      alert("할 일 저장 중 문제가 생겼습니다.");
    }
  });

  list.addEventListener("keydown", async (e) => {
    const editInput = e.target.closest(".todo-edit-input");
    if (!editInput) return;

    const id = editInput.dataset.id;
    if (!id) return;

    if (e.key === "Enter") {
      e.preventDefault();

      try {
        const isSaved = await saveEditedTodo(list, id);
        if (!isSaved) return;

        renderTodos(getTodos());
      } catch (error) {
        console.error("Failed to update todo.", error);
        alert("할 일을 수정하지 못했습니다.");
      }
    }

    if (e.key === "Escape") {
      stopEditingTodo();
      renderTodos(getTodos());
    }
  });
}
