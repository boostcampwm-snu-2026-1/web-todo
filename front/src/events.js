// src/events.js
import { createTodo, toggleTodoAPI, deleteTodoAPI } from './api.js';

export function setupEventListeners(state) {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const listContainer = document.getElementById('todo-list');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = input.value.trim();
    if (!content) return;
    try {
      await createTodo(content);
      input.value = '';
      state.refresh();
    } catch (err) {
      console.error('할 일 추가 실패:', err);
    }
  });

  listContainer.addEventListener('click', async (e) => {
    const li = e.target.closest('.todo-item');
    if (!li) return;
    const id = li.dataset.id;

    try {
      if (e.target.classList.contains('delete-btn')) {
        await deleteTodoAPI(id);
        state.refresh();
      } else if (e.target.type === 'checkbox' || e.target.classList.contains('todo-text')) {
        const checkbox = li.querySelector('.toggle-checkbox');
        if (e.target.type !== 'checkbox') {
          checkbox.checked = !checkbox.checked;
        }
        await toggleTodoAPI(id, checkbox.checked);
        state.refresh();
      }
    } catch (err) {
      console.error('요청 실패:', err);
      state.refresh();
    }
  });
}
