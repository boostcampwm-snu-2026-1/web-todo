import './style.css';
import { renderTodos } from './render.js';
import { fetchTodos } from './api.js';

const app = document.querySelector('#app');

app.innerHTML = `
  <div class="container">
    <header class="header">
      <h1>Todo App</h1>
      <p class="subtitle">Simple web todo</p>
    </header>

    <section class="todo-form-section">
      <form id="todo-form" class="todo-form">
        <input
          id="todo-input"
          class="todo-input"
          type="text"
          placeholder="할 일을 입력하세요"
        />
        <button type="submit" class="add-button">추가</button>
      </form>
    </section>

    <section class="todo-list-section">
      <ul id="todo-list" class="todo-list"></ul>
    </section>
  </div>
`;

let todos = [];

const todoListElement = document.querySelector('#todo-list');
const todoFormElement = document.querySelector('#todo-form');
const todoInputElement = document.querySelector('#todo-input');

async function init() {
  try {
    todos = await fetchTodos();
    renderTodos(todoListElement, todos);
  } catch (error) {
    console.error(error);
    todoListElement.innerHTML = `
      <li class="empty-message">할 일 목록을 불러오지 못했습니다.</li>
    `;
  }
}

todoFormElement.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = todoInputElement.value.trim();
  if (!title) return;

  const newTodo = {
    id: String(Date.now()),
    title,
    completed: false,
  };

  todos.push(newTodo);
  renderTodos(todoListElement, todos);
  todoInputElement.value = '';
});

init();