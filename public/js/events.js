import { createTodo, toggleTodoAPI, deleteTodoAPI } from './api.js';
import { renderTodoList } from './render.js';

/** Register all event listeners using event delegation */
export function setupEventListeners(state) {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const listContainer = document.getElementById('todo-list');

  // Handle new todo submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = input.value.trim();
    if (!content) return;

    await createTodo(content);
    input.value = '';
    state.refresh();
  });

  // Event delegation: single listener on <ul> handles all child interactions
  listContainer.addEventListener('click', async (e) => {
    const li = e.target.closest('.todo-item');
    if (!li) return;

    const id = li.dataset.id;

    if (e.target.classList.contains('delete-btn')) {
      await deleteTodoAPI(id);
      state.refresh();
    } else if (e.target.type === 'checkbox' || e.target.classList.contains('todo-text')) {
      // Sync checkbox UI when text is clicked directly
      if (e.target.type !== 'checkbox') {
        const checkbox = li.querySelector('.toggle-checkbox');
        checkbox.checked = !checkbox.checked;
      }
      await toggleTodoAPI(id);
      state.refresh();
    }
  });
}
