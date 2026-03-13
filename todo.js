"use strict";

const TODO_STORAGE_KEY = "web-todo-items";

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

function createTodoItemElement(todo) {
  const itemElement = document.createElement("li");
  itemElement.className = "todo-item";
  itemElement.dataset.todoId = String(todo.id);

  const checkboxElement = document.createElement("input");
  checkboxElement.className = "todo-checkbox";
  checkboxElement.type = "checkbox";
  checkboxElement.checked = Boolean(todo.completed);
  checkboxElement.setAttribute("aria-label", "Mark task as done");

  const textElement = document.createElement("span");
  textElement.className = "todo-text";
  textElement.textContent = todo.text;
  if (todo.completed) {
    textElement.classList.add("todo-text-done");
  }

  itemElement.appendChild(checkboxElement);
  itemElement.appendChild(textElement);
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
}

renderTodayDate();
renderTodoList(loadTodos());
registerEvents();
