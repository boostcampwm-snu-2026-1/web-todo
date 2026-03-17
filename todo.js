const STORAGE_KEY = 'vanilla-todo-items';

const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const taskCount = document.querySelector('#task-count');
const clearCompletedButton = document.querySelector('#clear-completed-button');
const todoItemTemplate = document.querySelector('#todo-item-template');

let todos = loadTodos();

renderTodos();
bindEvents();

function bindEvents() {
  todoForm.addEventListener('submit', handleSubmit);
  todoList.addEventListener('click', handleTodoListClick);
  todoList.addEventListener('change', handleTodoListChange);
  clearCompletedButton.addEventListener('click', handleClearCompleted);
}

function handleSubmit(event) {
  event.preventDefault();

  const text = todoInput.value.trim();

  if (!text) {
    todoInput.focus();
    return;
  }

  const newTodo = createTodo(text);
  todos = [newTodo, ...todos];
  saveTodos();
  renderTodos();
  todoForm.reset();
  todoInput.focus();
}

function handleTodoListClick(event) {
  const deleteButton = event.target.closest('.delete-button');

  if (!deleteButton) {
    return;
  }

  const todoItem = event.target.closest('.todo-item');
  const todoId = Number(todoItem.dataset.id);

  removeTodo(todoId);
}

function handleTodoListChange(event) {
  const checkbox = event.target.closest('.todo-checkbox');

  if (!checkbox) {
    return;
  }

  const todoItem = event.target.closest('.todo-item');
  const todoId = Number(todoItem.dataset.id);

  toggleTodo(todoId);
}

function handleClearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
}

function createTodo(text) {
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    text,
    completed: false,
  };
}

function toggleTodo(todoId) {
  todos = todos.map((todo) => {
    if (todo.id === todoId) {
      return {
        ...todo,
        completed: !todo.completed,
      };
    }

    return todo;
  });

  saveTodos();
  renderTodos();
}

function removeTodo(todoId) {
  todos = todos.filter((todo) => todo.id !== todoId);
  saveTodos();
  renderTodos();
}

function renderTodos() {
  todoList.innerHTML = '';

  if (todos.length === 0) {
    todoList.appendChild(createEmptyMessage());
    updateTaskCount();
    return;
  }

  const fragment = document.createDocumentFragment();

  todos.forEach((todo) => {
    fragment.appendChild(createTodoElement(todo));
  });

  todoList.appendChild(fragment);
  updateTaskCount();
}

function createTodoElement(todo) {
  const todoElement = todoItemTemplate.content.firstElementChild.cloneNode(true);
  const checkbox = todoElement.querySelector('.todo-checkbox');
  const text = todoElement.querySelector('.todo-text');

  todoElement.dataset.id = String(todo.id);
  text.textContent = todo.text;
  checkbox.checked = todo.completed;

  if (todo.completed) {
    todoElement.classList.add('completed');
  }

  return todoElement;
}

function createEmptyMessage() {
  const emptyItem = document.createElement('li');
  emptyItem.className = 'empty-message';
  emptyItem.textContent = '아직 등록된 할 일이 없습니다.';
  return emptyItem;
}

function updateTaskCount() {
  const totalCount = todos.length;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const remainingCount = totalCount - completedCount;

  taskCount.textContent = `전체 ${totalCount}개 · 남은 작업 ${remainingCount}개`;
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  const storedTodos = localStorage.getItem(STORAGE_KEY);

  if (!storedTodos) {
    return [];
  }

  try {
    const parsedTodos = JSON.parse(storedTodos);

    if (!Array.isArray(parsedTodos)) {
      return [];
    }

    return parsedTodos;
  } catch {
    return [];
  }
}