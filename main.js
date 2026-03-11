// State Management
let todos = [];

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const currentDateEl = document.getElementById("current-date");

// Display current date
const updateDate = () => {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  currentDateEl.textContent = new Date().toLocaleDateString('en-US', options);
};

// Render logic
export const renderTodo = () => {
  todoList.innerHTML = todos
    .map(
      (todo) => `
    <li data-id="${todo.id}" class="todo-item ${todo.completed ? "completed" : ""}">
      <div class="todo-content">
        <input type="checkbox" ${todo.completed ? "checked" : ""} class="toggle-checkbox">
        <span>${todo.text}</span>
      </div>
      <button class="delete-btn" aria-label="Delete task">🗑️</button>
    </li>
  `,
    )
    .join("");
};

// Logic functions
const addTodo = (text) => {
  if (!text.trim()) return;
  const newTodo = {
    id: Date.now(),
    text: text.trim(),
    completed: false,
  };
  todos.push(newTodo);
  renderTodo();
};

const toggleTodo = (id) => {
  todos = todos.map((todo) =>
    todo.id === Number(id) ? { ...todo, completed: !todo.completed } : todo
  );
  renderTodo();
};

const deleteTodo = (id) => {
  todos = todos.filter((todo) => todo.id !== Number(id));
  renderTodo();
};

// Event Listeners
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo(todoInput.value);
  todoInput.value = "";
});

todoList.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  
  const id = li.dataset.id;

  if (e.target.classList.contains("delete-btn")) {
    deleteTodo(id);
  } else if (e.target.classList.contains("toggle-checkbox")) {
    toggleTodo(id);
  }
});

// Initial call
updateDate();
renderTodo();
