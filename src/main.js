import { createTodoService } from './todoService.js';
import { renderTodoList } from './todoView.js';

const inputEl = document.getElementById('new-task-input');
const addBtnEl = document.getElementById('add-task-button');
const listEl = document.getElementById('todo-list');

const todoService = createTodoService();
let todos = [];

const render = () => {
  renderTodoList(listEl, todos);
};

const refreshTodos = async () => {
  todos = await todoService.list();
  render();
};

const runWithErrorAlert = async (task) => {
  try {
    await task();
  } catch (error) {
    alert(`Request failed: ${error.message}`);
  }
};

const addTodo = async () => {
  const content = inputEl.value.trim();
  if (!content) return;

  await todoService.add(content);
  inputEl.value = '';
  await refreshTodos();
};

const toggleTodo = async (id, checked) => {
  await todoService.toggle(id, checked);
  await refreshTodos();
};

const deleteTodo = async (id) => {
  await todoService.remove(id);
  await refreshTodos();
};

const editTodo = async (id) => {
  const target = await todoService.getById(id);
  if (!target) return;

  const next = prompt('Edit task:', target.content);
  if (next === null) return;

  const content = next.trim();
  if (!content) return;

  await todoService.edit(id, content);
  await refreshTodos();
};

addBtnEl.addEventListener('click', () => {
  runWithErrorAlert(addTodo);
});

inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') runWithErrorAlert(addTodo);
});

listEl.addEventListener('change', (e) => {
  const li = e.target.closest('.todo-item');
  if (!li || e.target.type !== 'checkbox') return;
  runWithErrorAlert(() => toggleTodo(li.dataset.id, e.target.checked));
});

listEl.addEventListener('click', (e) => {
  const button = e.target.closest('button[data-action]');
  const li = e.target.closest('.todo-item');
  if (!button || !li) return;

  const id = li.dataset.id;
  const action = button.dataset.action;

  if (action === 'delete') runWithErrorAlert(() => deleteTodo(id));
  if (action === 'edit') runWithErrorAlert(() => editTodo(id));
});

runWithErrorAlert(refreshTodos);