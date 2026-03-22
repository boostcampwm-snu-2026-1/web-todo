import { createJsonStorage } from './storage.js';
import { createTodoService } from './todoService.js';
import { renderTodoList } from './todoView.js';

const inputEl = document.getElementById('new-task-input');
const addBtnEl = document.getElementById('add-task-button');
const listEl = document.getElementById('todo-list');

const todoService = createTodoService(createJsonStorage('todos'));

const render = () => {
  renderTodoList(listEl, todoService.list());
};

const addTodo = () => {
  const content = inputEl.value.trim();
  if (!content) return;

  todoService.add(content);
  inputEl.value = '';
  render();
};

const toggleTodo = (id, checked) => {
  todoService.toggle(id, checked);
  render();
};

const deleteTodo = (id) => {
  todoService.remove(id);
  render();
};

const editTodo = (id) => {
  const target = todoService.getById(id);
  if (!target) return;

  const next = prompt('Edit task:', target.content);
  if (next === null) return;

  const content = next.trim();
  if (!content) return;

  todoService.edit(id, content);
  render();
};

addBtnEl.addEventListener('click', addTodo);

inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

listEl.addEventListener('change', (e) => {
  const li = e.target.closest('.todo-item');
  if (!li || e.target.type !== 'checkbox') return;
  toggleTodo(Number(li.dataset.id), e.target.checked);
});

listEl.addEventListener('click', (e) => {
  const button = e.target.closest('button[data-action]');
  const li = e.target.closest('.todo-item');
  if (!button || !li) return;

  const id = Number(li.dataset.id);
  const action = button.dataset.action;

  if (action === 'delete') deleteTodo(id);
  if (action === 'edit') editTodo(id);
});

render();