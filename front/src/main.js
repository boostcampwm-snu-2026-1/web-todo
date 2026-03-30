import { fetchTodos } from './api.js';
import { renderTodoList } from './render.js';
import { setupEventListeners } from './events.js';

const listContainer = document.getElementById('todo-list');

// Central app state with a refresh method to re-fetch and re-render
const appState = {
  async refresh() {
    const todos = await fetchTodos();
    renderTodoList(todos, listContainer);
  }
};

/** Initialize the application */
async function init() {
  setupEventListeners(appState);
  await appState.refresh();
}

document.addEventListener('DOMContentLoaded', init);
