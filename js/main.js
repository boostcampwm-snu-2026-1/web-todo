import {
  addTodo,
  deleteTodo,
  getTodos,
  reorderTodos,
  toggleTodo,
  updateTodo,
} from "./api.js";
import { renderTodos } from "./render.js";

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
let todos = [];
let editingTodoId = null;
let draggedTodoId = null;
let dropPosition = "before";

function clearDropIndicator() {
  todoList.querySelectorAll(".drop-before, .drop-after").forEach((item) => {
    item.classList.remove("drop-before", "drop-after");
  });
}

function reorderLocally(currentTodos, draggedId, targetId, position) {
  if (draggedId === targetId) {
    return currentTodos;
  }

  const nextTodos = [...currentTodos];
  const draggedIndex = nextTodos.findIndex((todo) => todo.id === draggedId);
  const targetIndex = nextTodos.findIndex((todo) => todo.id === targetId);

  if (draggedIndex === -1 || targetIndex === -1) {
    return currentTodos;
  }

  const [draggedTodo] = nextTodos.splice(draggedIndex, 1);
  const adjustedTargetIndex = nextTodos.findIndex((todo) => todo.id === targetId);
  const insertIndex =
    position === "after" ? adjustedTargetIndex + 1 : adjustedTargetIndex;

  nextTodos.splice(insertIndex, 0, draggedTodo);

  return nextTodos.map((todo, index) => ({
    ...todo,
    order: index + 1,
  }));
}

async function render(nextTodos) {
  todos = nextTodos ?? (await getTodos());
  renderTodos(todoList, todos, editingTodoId);

  if (editingTodoId !== null) {
    const activeInput = todoList.querySelector(".edit-input");

    if (activeInput) {
      activeInput.focus();
      activeInput.select();
    }
  }
}

todoForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = todoInput.value.trim();

  if (!title) {
    return;
  }

  await addTodo(title);
  todoInput.value = "";
  await render();
});

todoList.addEventListener("click", async (event) => {
  if (event.target.tagName !== "BUTTON") {
    return;
  }

  const todoId = event.target.dataset.id;
  const action = event.target.dataset.action;

  if (action === "edit") {
    editingTodoId = todoId;
  }

  if (action === "delete") {
    await deleteTodo(todoId);

    if (editingTodoId === todoId) {
      editingTodoId = null;
    }
  }

  if (action === "save") {
    const editInput = todoList.querySelector(`.edit-input[data-id="${todoId}"]`);

    if (!editInput) {
      return;
    }

    const trimmedTitle = editInput.value.trim();

    if (!trimmedTitle) {
      editInput.focus();
      return;
    }

    await updateTodo(todoId, trimmedTitle);
    editingTodoId = null;
  }

  if (action === "cancel") {
    editingTodoId = null;
  }

  await render();
});

todoList.addEventListener("change", async (event) => {
  if (event.target.type !== "checkbox") {
    return;
  }

  await toggleTodo(event.target.dataset.id);
  await render();
});

todoList.addEventListener("keydown", async (event) => {
  if (!event.target.classList.contains("edit-input")) {
    return;
  }

  const todoId = event.target.dataset.id;

  if (event.key === "Enter") {
    const trimmedTitle = event.target.value.trim();

    if (!trimmedTitle) {
      return;
    }

    await updateTodo(todoId, trimmedTitle);
    editingTodoId = null;
    await render();
  }

  if (event.key === "Escape") {
    editingTodoId = null;
    await render();
  }
});

todoList.addEventListener("dragstart", (event) => {
  const item = event.target.closest("li");

  if (!item || editingTodoId !== null) {
    event.preventDefault();
    return;
  }

  draggedTodoId = item.dataset.id;
  item.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", String(draggedTodoId));
});

todoList.addEventListener("dragover", (event) => {
  const item = event.target.closest("li");

  if (!item || draggedTodoId === null) {
    return;
  }

  event.preventDefault();
  event.dataTransfer.dropEffect = "move";

  const itemRect = item.getBoundingClientRect();
  const isAfter = event.clientY > itemRect.top + itemRect.height / 2;
  dropPosition = isAfter ? "after" : "before";

  clearDropIndicator();
  item.classList.add(isAfter ? "drop-after" : "drop-before");
});

todoList.addEventListener("drop", async (event) => {
  const item = event.target.closest("li");

  if (!item || draggedTodoId === null) {
    return;
  }

  event.preventDefault();

  const nextDraggedTodoId = draggedTodoId;
  const targetTodoId = item.dataset.id;
  const previousTodos = [...todos];
  const optimisticTodos = reorderLocally(
    todos,
    nextDraggedTodoId,
    targetTodoId,
    dropPosition
  );

  draggedTodoId = null;
  clearDropIndicator();
  await render(optimisticTodos);

  try {
    await reorderTodos(optimisticTodos);
    await render();
  } catch (error) {
    await render(previousTodos);
    throw error;
  }
});

todoList.addEventListener("dragend", () => {
  draggedTodoId = null;
  clearDropIndicator();

  const draggingItem = todoList.querySelector(".dragging");

  if (draggingItem) {
    draggingItem.classList.remove("dragging");
  }
});

todoList.addEventListener("dragleave", (event) => {
  const item = event.target.closest("li");

  if (!item || item.contains(event.relatedTarget)) {
    return;
  }

  item.classList.remove("drop-before", "drop-after");
});

render();
