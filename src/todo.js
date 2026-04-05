const API_URL = '/api/todos';

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

async function handleSubmit(event) {
  event.preventDefault();

  const text = todoInput.value.trim();
  if (!text) return;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: text,
      completed: false
    })
  });

  const createdTodo = await response.json();
  todos = [normalizeTodo(createdTodo), ...todos];

  renderTodos();
  todoForm.reset();
}

async function loadTodos() {
  const response = await fetch(API_URL);
  const savedTodos = await response.json();

  todos = savedTodos.map(normalizeTodo);
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
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ completed })
  });

  const updatedTodo = await response.json();

  todos = todos.map(todo =>
    todo.id === id ? normalizeTodo(updatedTodo) : todo
  );

  renderTodos();
}

function normalizeTodo(rawTodo) {
  return {
    id: rawTodo._id,
    text: rawTodo.name || '',
    completed: rawTodo.completed || false
  };
}

function renderTodos() {
  todoList.innerHTML = '';

  todos.forEach(todo => {
    const todoItem = createTodoElement(todo);
    todoList.appendChild(todoItem);
  });

  taskCount.textContent = `전체 ${todos.length}개`;
}

function createTodoElement(todo) {
  const todoElement = todoItemTemplate.content.firstElementChild.cloneNode(true);
  const checkbox = todoElement.querySelector('.todo-checkbox');
  const todoText = todoElement.querySelector('.todo-text');
  const deleteButton = todoElement.querySelector('.delete-button');

  todoText.textContent = todo.text;
  checkbox.checked = todo.completed;

  if (todo.completed) {
    todoElement.classList.add('completed');
  }

  checkbox.addEventListener('change', (event) => {
    toggleTodo(todo.id, event.target.checked);
  });

  deleteButton.addEventListener('click', () => {
    deleteTodo(todo.id);
  });

  return todoElement;
}
