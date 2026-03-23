import './style.css';
import { renderTodos } from './render.js';
import { fetchTodos, createTodo, deleteTodo, updateTodo } from './api.js';

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

function updateTodoState(updatedTodo) {
  todos = todos.map((todo) => {
    if (todo.id === updatedTodo.id) {
      return updatedTodo;
    }
    return todo;
  });
}

function removeTodoState(id) {
  todos = todos.filter((todo) => todo.id !== id);
}

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

todoFormElement.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = todoInputElement.value.trim();
  if (!title) return;

  try {
    const createdTodo = await createTodo(title);
    todos.push(createdTodo);
    renderTodos(todoListElement, todos);
    todoInputElement.value = '';
  } catch (error) {
    console.error(error);
    alert('할 일 추가에 실패했습니다.');
  }
});

todoListElement.addEventListener('click', async (event) => {
  const deleteButton = event.target.closest('.delete-button');
  if (!deleteButton) return;

  const todoItem = event.target.closest('.todo-item');
  const id = todoItem.dataset.id;

  try {
    await deleteTodo(id);
    removeTodoState(id);
    renderTodos(todoListElement, todos);
  } catch (error) {
    console.error(error);
    alert('할 일 삭제에 실패했습니다.');
  }
});

todoListElement.addEventListener('change', async (event) => {
  const checkbox = event.target.closest('.todo-checkbox');
  if (!checkbox) return;

  const todoItem = event.target.closest('.todo-item');
  const id = todoItem.dataset.id;

  const targetTodo = todos.find((todo) => todo.id === id);
  if (!targetTodo) return;

  try {
    const updatedTodo = await updateTodo(id, {
      completed: !targetTodo.completed,
    });

    updateTodoState(updatedTodo);
    renderTodos(todoListElement, todos);
  } catch (error) {
    console.error(error);
    alert('할 일 상태 변경에 실패했습니다.');
  }
});

init();