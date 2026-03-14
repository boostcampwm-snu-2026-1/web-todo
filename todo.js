"use strict";

const TODO_STORAGE_KEY = "web-todo-items";
let editingTodoId = null;

function formatTodayDate() {
  const now = new Date();
  const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const dayName = weekdays[now.getDay()];

  return `${month}월 ${date}일 ${dayName}`;
}

function renderTodayDate() {
  const dateElement = document.getElementById("today-date");
  if (!dateElement) return;

  dateElement.textContent = formatTodayDate();
}

function loadTodos() {
  const raw = localStorage.getItem(TODO_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveTodos(todos) {
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

function createTodo(text) {
  return {
    id: Date.now(),
    text,
    completed: false,
  };
}

function getTrimmedInputValue(inputElement) {
  return inputElement.value.trim();
}

function clearInput(inputElement) {
  inputElement.value = "";
}

function showAddSuccessAlert() {
  alert("New task has been successfully added!");
}

function createActionButton(className, label, text) {
  const buttonElement = document.createElement("button");
  buttonElement.className = className;
  buttonElement.type = "button";
  buttonElement.setAttribute("aria-label", label);
  buttonElement.textContent = text;
  return buttonElement;
}

function createTodoTextElement(todo) {
  const textElement = document.createElement("span");
  textElement.className = "todo-text";
  textElement.textContent = todo.text;

  if (todo.completed) {
    textElement.classList.add("todo-text-done");
  }

  return textElement;
}

function createTodoEditInputElement(todo) {
  const inputElement = document.createElement("input");
  inputElement.className = "todo-edit-input";
  inputElement.type = "text";
  inputElement.value = todo.text;
  inputElement.maxLength = 100;
  inputElement.setAttribute("aria-label", "Edit task");
  return inputElement;
}

function createTodoActionsElement(todo) {
  const actionsElement = document.createElement("div");
  actionsElement.className = "todo-actions";

  if (editingTodoId === todo.id) {
    actionsElement.appendChild(createActionButton("save-button", "Save task", "✓"));
    actionsElement.appendChild(createActionButton("cancel-button", "Cancel edit", "✕"));
    return actionsElement;
  }

  actionsElement.appendChild(createActionButton("edit-button", "Edit task", "✎"));
  actionsElement.appendChild(createActionButton("delete-button", "Delete task", "🗑"));
  return actionsElement;
}

function createTodoItemElement(todo) {
  const itemElement = document.createElement("li");
  itemElement.className = "todo-item";
  itemElement.dataset.todoId = String(todo.id);

  const checkboxElement = document.createElement("input");
  checkboxElement.className = "todo-checkbox";
  checkboxElement.type = "checkbox";
  checkboxElement.checked = Boolean(todo.completed);
  checkboxElement.setAttribute("aria-label", "Mark task as done");
  checkboxElement.disabled = editingTodoId === todo.id;
  const contentElement =
    editingTodoId === todo.id ? createTodoEditInputElement(todo) : createTodoTextElement(todo);
  const actionsElement = createTodoActionsElement(todo);

  itemElement.appendChild(checkboxElement);
  itemElement.appendChild(contentElement);
  itemElement.appendChild(actionsElement);
  return itemElement;
}

function createEmptyMessageElement() {
  const emptyElement = document.createElement("li");
  emptyElement.className = "todo-item todo-empty";
  emptyElement.textContent = "No tasks yet. Add your first task!";
  return emptyElement;
}

function renderTodoList(todos) {
  const listElement = document.getElementById("todo-list");
  if (!listElement) return;

  if (editingTodoId !== null && !todos.some((todo) => todo.id === editingTodoId)) {
    editingTodoId = null;
  }

  listElement.textContent = "";

  if (todos.length === 0) {
    listElement.appendChild(createEmptyMessageElement());
    return;
  }

  const fragment = document.createDocumentFragment();
  todos.forEach((todo) => {
    fragment.appendChild(createTodoItemElement(todo));
  });

  listElement.appendChild(fragment);

  if (editingTodoId !== null) {
    const editInput = listElement.querySelector(".todo-edit-input");
    if (editInput instanceof HTMLInputElement) {
      editInput.focus();
      editInput.select();
    }
  }
}

function updateTodoCompletion(todoId, completed) {
  const todos = loadTodos();
  const updatedTodos = todos.map((todo) => {
    if (todo.id !== todoId) return todo;
    return { ...todo, completed };
  });

  saveTodos(updatedTodos);
  renderTodoList(updatedTodos);
}

function deleteTodo(todoId) {
  const todos = loadTodos();
  const updatedTodos = todos.filter((todo) => todo.id !== todoId);
  if (editingTodoId === todoId) {
    editingTodoId = null;
  }
  saveTodos(updatedTodos);
  renderTodoList(updatedTodos);
}

function updateTodoText(todoId, text) {
  const todos = loadTodos();
  const updatedTodos = todos.map((todo) => {
    if (todo.id !== todoId) return todo;
    return { ...todo, text };
  });

  saveTodos(updatedTodos);
  renderTodoList(updatedTodos);
}

function findTodoById(todoId) {
  const todos = loadTodos();
  return todos.find((todo) => todo.id === todoId);
}

function getTodoIdFromItemElement(itemElement) {
  return Number(itemElement.dataset.todoId);
}

function confirmDeleteTask(todoText) {
  return confirm(`Would you like to delete the task?\n${todoText}`);
}

function startEditing(todoId) {
  editingTodoId = todoId;
  renderTodoList(loadTodos());
}

function cancelEditing() {
  editingTodoId = null;
  renderTodoList(loadTodos());
}

function saveEditing(todoId, text) {
  const trimmedText = text.trim();
  if (!trimmedText) {
    alert("Task cannot be empty.");
    return;
  }

  editingTodoId = null;
  updateTodoText(todoId, trimmedText);
}

function handleTodoListChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (!target.classList.contains("todo-checkbox")) return;

  const todoItemElement = target.closest(".todo-item");
  if (!todoItemElement) return;

  const todoId = Number(todoItemElement.dataset.todoId);
  if (!Number.isFinite(todoId)) return;

  updateTodoCompletion(todoId, target.checked);
}

function handleTodoListClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const todoItemElement = target.closest(".todo-item");
  if (!todoItemElement) return;

  const todoId = getTodoIdFromItemElement(todoItemElement);
  if (!Number.isFinite(todoId)) return;

  if (target.closest(".edit-button")) {
    startEditing(todoId);
    return;
  }

  if (target.closest(".cancel-button")) {
    cancelEditing();
    return;
  }

  if (target.closest(".save-button")) {
    const editInput = todoItemElement.querySelector(".todo-edit-input");
    if (!(editInput instanceof HTMLInputElement)) return;

    saveEditing(todoId, editInput.value);
    return;
  }

  if (!target.closest(".delete-button")) return;

  const todo = findTodoById(todoId);
  if (!todo) return;

  const shouldDelete = confirmDeleteTask(todo.text);
  if (!shouldDelete) return;

  deleteTodo(todoId);
}

function handleTodoListKeydown(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (!target.classList.contains("todo-edit-input")) return;

  const todoItemElement = target.closest(".todo-item");
  if (!todoItemElement) return;

  const todoId = getTodoIdFromItemElement(todoItemElement);
  if (!Number.isFinite(todoId)) return;

  if (event.key === "Enter") {
    event.preventDefault();
    saveEditing(todoId, target.value);
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    cancelEditing();
  }
}

function handleTodoSubmit(event) {
  event.preventDefault();

  const inputElement = document.getElementById("todo-input");
  if (!inputElement) return;

  const text = getTrimmedInputValue(inputElement);
  if (!text) return;

  const todos = loadTodos();
  const newTodo = createTodo(text);
  todos.push(newTodo);
  saveTodos(todos);
  renderTodoList(todos);
  clearInput(inputElement);
  showAddSuccessAlert();
}

function registerEvents() {
  const formElement = document.getElementById("todo-form");
  if (!formElement) return;

  formElement.addEventListener("submit", handleTodoSubmit);

  const listElement = document.getElementById("todo-list");
  if (!listElement) return;

  listElement.addEventListener("change", handleTodoListChange);
  listElement.addEventListener("click", handleTodoListClick);
  listElement.addEventListener("keydown", handleTodoListKeydown);
}

renderTodayDate();
renderTodoList(loadTodos());
registerEvents();
