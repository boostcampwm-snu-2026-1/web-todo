const todos = [
  { id: 1, text: "Build the HTML structure", completed: false },
  { id: 2, text: "Apply the CSS styling", completed: true },
  { id: 3, text: "Implement interactions with JavaScript", completed: false },
];

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const summary = document.getElementById("todo-summary");

/**
 * Create a unique ID for a new todo
 */
function createTodoId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

/**
 * Create a todo object
 */
function createTodo(text) {
  return {
    id: createTodoId(),
    text: text.trim(),
    completed: false,
  };
}

/**
 * Build summary text
 */
function getSummaryText(items) {
  const total = items.length;
  const completed = items.filter((item) => item.completed).length;
  const remaining = total - completed;

  return `Total ${total} / Completed ${completed} / Remaining ${remaining}`;
}

/**
 * Create empty-state element
 */
function createEmptyMessageElement() {
  const li = document.createElement("li");
  li.className = "empty-message";
  li.textContent = "No todos have been added yet.";
  return li;
}

/**
 * Create one todo item element
 */
function createTodoItemElement(todo) {
  const li = document.createElement("li");
  li.className = todo.completed ? "todo-item completed" : "todo-item";
  li.dataset.id = String(todo.id);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-checkbox";
  checkbox.checked = todo.completed;

  const text = document.createElement("span");
  text.className = "todo-text";
  text.textContent = todo.text;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete";

  li.appendChild(checkbox);
  li.appendChild(text);
  li.appendChild(deleteButton);

  return li;
}

/**
 * Render todo list
 */
function renderTodoList(items) {
  list.innerHTML = "";

  if (items.length === 0) {
    list.appendChild(createEmptyMessageElement());
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach((todo) => {
    const todoElement = createTodoItemElement(todo);
    fragment.appendChild(todoElement);
  });

  list.appendChild(fragment);
}

/**
 * Render summary
 */
function renderSummary(items) {
  summary.textContent = getSummaryText(items);
}

/**
 * Render the whole app
 */
function renderApp() {
  renderTodoList(todos);
  renderSummary(todos);
}

/**
 * Add a new todo
 */
function addTodo(text) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    alert("Please enter a task.");
    return;
  }

  const newTodo = createTodo(trimmedText);
  todos.unshift(newTodo);
  renderApp();
}

/**
 * Toggle todo completion status
 */
function toggleTodo(todoId) {
  const target = todos.find((todo) => todo.id === todoId);

  if (!target) return;

  target.completed = !target.completed;
  renderApp();
}

/**
 * Delete a todo
 */
function deleteTodo(todoId) {
  const targetIndex = todos.findIndex((todo) => todo.id === todoId);

  if (targetIndex === -1) return;

  todos.splice(targetIndex, 1);
  renderApp();
}

/**
 * Handle form submission
 */
function handleFormSubmit(event) {
  event.preventDefault();
  addTodo(input.value);
  input.value = "";
  input.focus();
}

/**
 * Handle list events
 * Event delegation is used because it works well
 * for dynamically created todo items.
 */
function handleTodoListEvent(event) {
  const item = event.target.closest(".todo-item");
  if (!item) return;

  const todoId = Number(item.dataset.id);

  if (event.target.classList.contains("delete-button")) {
    deleteTodo(todoId);
    return;
  }

  if (event.target.classList.contains("todo-checkbox")) {
    toggleTodo(todoId);
  }
}

/**
 * Bind events
 */
function bindEvents() {
  form.addEventListener("submit", handleFormSubmit);
  list.addEventListener("click", handleTodoListEvent);
  list.addEventListener("change", handleTodoListEvent);
}

/**
 * Initialize app
 */
function init() {
  bindEvents();
  renderApp();
}

init();