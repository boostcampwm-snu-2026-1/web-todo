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
  clearInput(inputElement);
  showAddSuccessAlert();
}

function registerEvents() {
  const formElement = document.getElementById("todo-form");
  if (!formElement) return;

  formElement.addEventListener("submit", handleTodoSubmit);
}

renderTodayDate();
registerEvents();
