const API_URL = 'https://69bd09772bc2a25b22ad23e1.mockapi.io/api/todos';

const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const taskCount = document.querySelector('#task-count');
const reloadButton = document.querySelector('#reload-button');
const todoItemTemplate = document.querySelector('#todo-item-template');

let todos = [];

bindEvents();
loadTodos();

function bindEvents() {
  todoForm.addEventListener('submit', handleSubmit);
  reloadButton.addEventListener('click', loadTodos);
}

async function handleSubmit(e) {
  e.preventDefault();

  const text = todoInput.value.trim();
  if (!text) return;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: text,
      completed: false
    })
  });

  const data = await res.json();
  todos = [normalizeTodo(data), ...todos];

  renderTodos();
  todoForm.reset();
}

async function loadTodos() {
  const res = await fetch(API_URL);
  const data = await res.json();

  todos = data.map(normalizeTodo);
  renderTodos();
}

async function deleteTodo(id) {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  todos = todos.filter(todo => todo.id !== id);
  renderTodos();
}

async function toggleTodo(id, completed) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ completed })
  });

  const updated = await res.json();

  todos = todos.map(todo =>
    todo.id === id ? normalizeTodo(updated) : todo
  );

  renderTodos();
}

function normalizeTodo(item) {
  return {
    id: item.id,
    text: item.name || '',
    completed: item.completed || false
  };
}

function renderTodos() {
  todoList.innerHTML = '';

  todos.forEach(todo => {
    const el = createTodoElement(todo);
    todoList.appendChild(el);
  });

  taskCount.textContent = `전체 ${todos.length}개`;
}

function createTodoElement(todo) {
  const el = todoItemTemplate.content.firstElementChild.cloneNode(true);
  const checkbox = el.querySelector('.todo-checkbox');
  const text = el.querySelector('.todo-text');
  const deleteButton = el.querySelector('.delete-button');

  text.textContent = todo.text;
  checkbox.checked = todo.completed;

  if (todo.completed) {
    el.classList.add('completed');
  }

  checkbox.addEventListener('change', (e) => {
    toggleTodo(todo.id, e.target.checked);
  });

  deleteButton.addEventListener('click', () => {
    deleteTodo(todo.id);
  });

  return el;
}