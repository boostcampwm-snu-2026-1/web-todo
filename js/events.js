// 이벤트 핸들링 담당 모듈
import { addTodo, toggleTodo, deleteTodo, findTodoById, updateTodoText } from './store.js';
import { createTodoElement } from './render.js';

export function bindEvents(form, input, list) {
  form.addEventListener('submit', (e) => handleFormSubmit(e, input, list));
  list.addEventListener('click', (e) => handleListClick(e));
}

function handleFormSubmit(e, input, list) {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const todo = addTodo(text);
  list.appendChild(createTodoElement(todo));
  input.value = '';
  input.focus();
}

function handleListClick(e) {
  const item = e.target.closest('.todo-item');
  if (!item) return;

  const id = Number(item.dataset.id);

  if (e.target.closest('.todo-toggle')) {
    handleToggle(item, id);
  } else if (e.target.closest('.todo-delete-btn')) {
    handleDelete(item, id);
  } else if (e.target.closest('.todo-edit-btn')) {
    handleEdit(item, id);
  }
}

function handleToggle(item, id) {
  toggleTodo(id);
  item.classList.toggle('completed');

  const toggleBtn = item.querySelector('.todo-toggle');
  const isCompleted = item.classList.contains('completed');
  toggleBtn.setAttribute('aria-label', isCompleted ? '완료 해제' : '완료 처리');
}

function handleDelete(item, id) {
  deleteTodo(id);
  item.remove();
}

function handleEdit(item, id) {
  const todo = findTodoById(id);
  if (!todo) return;

  const textSpan = item.querySelector('.todo-text');
  const currentText = todo.text;

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'todo-input';
  input.value = currentText;
  input.style.flex = '1';

  textSpan.replaceWith(input);
  input.focus();
  input.select();

  function finishEdit() {
    const newText = input.value.trim();
    if (newText && newText !== currentText) {
      updateTodoText(id, newText);
    }

    const newSpan = document.createElement('span');
    newSpan.className = 'todo-text';
    newSpan.textContent = newText || currentText;
    input.replaceWith(newSpan);
  }

  input.addEventListener('blur', finishEdit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      input.blur();
    } else if (e.key === 'Escape') {
      input.value = currentText;
      input.blur();
    }
  });
}
