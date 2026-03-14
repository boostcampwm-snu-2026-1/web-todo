const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
let editingTodoId = null;
let draggedTodoId = null;
let dropPosition = "before";

function clearDropIndicator() {
  todoList.querySelectorAll(".drop-before, .drop-after").forEach((item) => {
    item.classList.remove("drop-before", "drop-after");
  });
}

function render() {
  window.renderTodos(todoList, window.todoState.todos, editingTodoId);

  if (editingTodoId !== null) {
    const activeInput = todoList.querySelector(".edit-input");

    if (activeInput) {
      activeInput.focus();
      activeInput.select();
    }
  }
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();

  if (!text) {
    return;
  }

  window.todoActions.addTodo(text);
  todoInput.value = "";
  render();
});

todoList.addEventListener("click", (event) => {
  if (event.target.tagName !== "BUTTON") {
    return;
  }

  const todoId = Number(event.target.dataset.id);
  const action = event.target.dataset.action;

  if (action === "edit") {
    editingTodoId = todoId;
  }

  if (action === "delete") {
    window.todoActions.deleteTodo(todoId);

    if (editingTodoId === todoId) {
      editingTodoId = null;
    }
  }

  if (action === "save") {
    const editInput = todoList.querySelector(`.edit-input[data-id="${todoId}"]`);

    if (!editInput) {
      return;
    }

    const trimmedText = editInput.value.trim();

    if (!trimmedText) {
      editInput.focus();
      return;
    }

    window.todoActions.updateTodo(todoId, trimmedText);
    editingTodoId = null;
  }

  if (action === "cancel") {
    editingTodoId = null;
  }

  render();
});

todoList.addEventListener("change", (event) => {
  if (event.target.type !== "checkbox") {
    return;
  }

  window.todoActions.toggleTodo(Number(event.target.dataset.id));
  render();
});

todoList.addEventListener("keydown", (event) => {
  if (!event.target.classList.contains("edit-input")) {
    return;
  }

  const todoId = Number(event.target.dataset.id);

  if (event.key === "Enter") {
    const trimmedText = event.target.value.trim();

    if (!trimmedText) {
      return;
    }

    window.todoActions.updateTodo(todoId, trimmedText);
    editingTodoId = null;
    render();
  }

  if (event.key === "Escape") {
    editingTodoId = null;
    render();
  }
});

todoList.addEventListener("dragstart", (event) => {
  const item = event.target.closest("li");

  if (!item || editingTodoId !== null) {
    event.preventDefault();
    return;
  }

  draggedTodoId = Number(item.dataset.id);
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

todoList.addEventListener("drop", (event) => {
  const item = event.target.closest("li");

  if (!item || draggedTodoId === null) {
    return;
  }

  event.preventDefault();

  const targetTodoId = Number(item.dataset.id);
  window.todoActions.reorderTodos(draggedTodoId, targetTodoId, dropPosition);
  draggedTodoId = null;
  clearDropIndicator();
  render();
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
