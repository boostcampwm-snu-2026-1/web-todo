// main.js
import { getTodos, addTodo, toggleTodo, deleteTodo } from './src/api.js';

const addButton = document.getElementById('add-btn');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoCount = document.getElementById('todo-count');

let todos = [];

function updateCount() {
  const remaining = todos.filter(t => !t.completed).length;
  todoCount.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} remaining`;
}

function createTodoItem(todo) {
  const li = document.createElement('li');
  li.dataset.id = todo._id;

  const checkbox = document.createElement('div');
  checkbox.className = 'checkbox' + (todo.completed ? ' checked' : '');

  const span = document.createElement('span');
  span.textContent = todo.text;
  if (todo.completed) span.className = 'completed';

  const toggle = async () => {
    const updated = await toggleTodo(todo._id);
    todo.completed = updated.completed;
    checkbox.className = 'checkbox' + (todo.completed ? ' checked' : '');
    span.className = todo.completed ? 'completed' : '';
    updateCount();
  };

  checkbox.addEventListener('click', toggle);
  span.addEventListener('click', toggle);

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-btn';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', async () => {
    await deleteTodo(todo._id);
    todos = todos.filter(t => t._id !== todo._id);
    todoList.removeChild(li);
    updateCount();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteButton);
  return li;
}

async function loadTodos() {
  todos = await getTodos();
  todoList.innerHTML = '';
  todos.forEach((todo) => {
    todoList.appendChild(createTodoItem(todo));
  });
  updateCount();
}

addButton.addEventListener('click', async () => {
  const todoText = todoInput.value.trim();
  if (todoText) {
    const newTodo = await addTodo(todoText);
    todos.push(newTodo);
    todoList.appendChild(createTodoItem(newTodo));
    todoInput.value = '';
    updateCount();
  }
});

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addButton.click();
  }
});

loadTodos();