import {
  addTodo,
  deleteTodo,
  findTodoById,
  getTodos,
  resetAllTodos,
  toggleTodoCompletion,
  updateTodoText,
} from "../model/todos.js";
import { renderTodoList } from "../ui/todoView.js";
import { showToastMessage } from "../ui/toast.js";
import { renderTodayDate } from "../ui/date.js";

let editingTodoId = null;

function getTrimmedInputValue(inputElement) {
  return inputElement.value.trim();
}

function clearInput(inputElement) {
  inputElement.value = "";
}

function getTodoIdFromItemElement(itemElement) {
  return Number(itemElement.dataset.todoId);
}

function renderCurrentTodos() {
  const todos = getTodos();

  if (editingTodoId !== null && !todos.some((todo) => todo.id === editingTodoId)) {
    editingTodoId = null;
  }

  renderTodoList(todos, editingTodoId);
}

function confirmDeleteTask(todoText) {
  return confirm(`Would you like to delete the task?\n${todoText}`);
}

function confirmResetAllTasks() {
  return confirm("Would you like to reset all tasks?");
}

function startEditing(todoId) {
  editingTodoId = todoId;
  renderCurrentTodos();
}

function cancelEditing() {
  editingTodoId = null;
  renderCurrentTodos();
}

function saveEditing(todoId, text) {
  const trimmedText = text.trim();
  if (!trimmedText) {
    alert("Task cannot be empty.");
    return;
  }

  editingTodoId = null;
  updateTodoText(todoId, trimmedText);
  renderCurrentTodos();
}

function handleTodoListChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (!target.classList.contains("todo-checkbox")) return;

  const todoItemElement = target.closest(".todo-item");
  if (!todoItemElement) return;

  const todoId = getTodoIdFromItemElement(todoItemElement);
  if (!Number.isFinite(todoId)) return;

  toggleTodoCompletion(todoId, target.checked);
  renderCurrentTodos();
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
  renderCurrentTodos();
  showToastMessage("Task has been deleted.");
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

  addTodo(text);
  renderCurrentTodos();
  clearInput(inputElement);
  showToastMessage("New task has been successfully added!");
}

function handleResetAllClick() {
  if (!confirmResetAllTasks()) return;

  resetAllTodos();
  editingTodoId = null;
  renderCurrentTodos();
  showToastMessage("All tasks have been reset.");
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

  const resetAllButton = document.getElementById("reset-all-button");
  if (!resetAllButton) return;

  resetAllButton.addEventListener("click", handleResetAllClick);
}

export function initializeTodoApp() {
  renderTodayDate();
  renderCurrentTodos();
  registerEvents();
}
