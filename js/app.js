import { loadFromStorage } from './store.js';
import { createColumnEl, renderBoard } from './render.js';
import {
  initBoardEvents,
  initInboxEvents,
  initColumnInputEvents,
  initDragAndDrop,
} from './events.js';

const SECTIONS = ['inbox', 'high', 'medium', 'low'];

/**
 * Bootstrap sequence:
 * 1. Load persisted todos from localStorage
 * 2. Build 4 column shells and append to #board
 * 3. Render todos into each column
 * 4. Wire all event handlers
 */
function init() {
  const boardEl = document.getElementById('board');
  if (!boardEl) return;

  // 1. Hydrate state
  loadFromStorage();

  // 2. Build column shells
  SECTIONS.forEach(section => {
    boardEl.appendChild(createColumnEl(section));
  });

  // 3. Render todos
  renderBoard(boardEl);

  // 4. Wire events
  initBoardEvents(boardEl);
  initInboxEvents(boardEl.querySelector('[data-section="inbox"]'));
  initColumnInputEvents(boardEl);
  initDragAndDrop(boardEl);
}

document.addEventListener('DOMContentLoaded', init);
