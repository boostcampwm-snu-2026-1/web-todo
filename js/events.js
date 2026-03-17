import {
  toggleTodo,
  deleteTodo,
  addTodo,
  addTodos,
  moveTodo,
  reorderTodo,
  getTodos,
} from './store.js';
import {
  renderBoard,
  updateCardCompletion,
  removeCard,
} from './render.js';
import { parseInboxDump } from './utils.js';

// ─── Drag State ─────────────────────────────────────────────
const dragState = {
  id: null,
  section: null,
  el: null,
};

// ─── Board Click Delegation ──────────────────────────────────

/**
 * Attaches a single delegated click listener to the board.
 * @param {HTMLElement} boardEl
 */
export function initBoardEvents(boardEl) {
  boardEl.addEventListener('click', handleBoardClick);
}

/**
 * Routes click events by data-action attribute.
 * @param {MouseEvent} e
 */
function handleBoardClick(e) {
  const actionEl = e.target.closest('[data-action]');
  if (!actionEl) return;

  const action = actionEl.dataset.action;
  const id = actionEl.dataset.id;

  if (action === 'toggle') {
    handleToggle(id, actionEl.closest('#board'));
  } else if (action === 'delete') {
    handleDelete(id, actionEl.closest('#board'));
  }
  // 'dump' action is handled separately in initInboxEvents
}

/**
 * Toggles a todo and does a minimal DOM update.
 * @param {string} id
 * @param {HTMLElement} boardEl
 */
function handleToggle(id, boardEl) {
  toggleTodo(id);
  const todos = getTodos();
  const todo = todos.find(t => t.id === id);
  if (todo) {
    updateCardCompletion(id, todo.completed);
    // Update count badge on the column
    const col = boardEl && boardEl.querySelector(`.column[data-section="${todo.section}"]`);
    if (col) {
      const countEl = col.querySelector('.column-count');
      if (countEl) {
        const active = todos.filter(t => t.section === todo.section && !t.completed).length;
        countEl.textContent = active > 0 ? active : '';
      }
    }
  }
}

/**
 * Deletes a todo and removes its card from the DOM.
 * @param {string} id
 * @param {HTMLElement} boardEl
 */
function handleDelete(id, boardEl) {
  deleteTodo(id);
  removeCard(id);
}

// ─── Inbox Dump ──────────────────────────────────────────────

/**
 * Wires Inbox textarea: Cmd/Ctrl+Enter and "Add All" button.
 * @param {HTMLElement} inboxEl  — the .column[data-section="inbox"] element
 */
export function initInboxEvents(inboxEl) {
  const textarea = inboxEl.querySelector('[data-inbox-textarea]');
  const btn = inboxEl.querySelector('[data-action="dump"]');
  const boardEl = inboxEl.closest('#board');

  if (!textarea || !btn) return;

  textarea.addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submitInboxDump(textarea, boardEl);
    }
  });

  btn.addEventListener('click', () => {
    submitInboxDump(textarea, boardEl);
  });
}

/**
 * Parses the textarea, adds todos to the inbox, re-renders.
 * @param {HTMLTextAreaElement} textarea
 * @param {HTMLElement} boardEl
 */
function submitInboxDump(textarea, boardEl) {
  const lines = parseInboxDump(textarea.value);
  if (lines.length === 0) return;

  addTodos(lines, 'inbox');
  textarea.value = '';
  textarea.focus();
  renderBoard(boardEl);
}

// ─── Column Single-Line Input ────────────────────────────────

/**
 * Wires Enter key on single-line column inputs (High/Medium/Low).
 * Called after the board columns are rendered.
 * @param {HTMLElement} boardEl
 */
export function initColumnInputEvents(boardEl) {
  boardEl.querySelectorAll('[data-col-input]').forEach(input => {
    const section = input.dataset.section;
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleColumnAdd(input, section, boardEl);
      }
    });
  });
}

/**
 * Adds a single todo from a column input and re-renders that column.
 * @param {HTMLInputElement} input
 * @param {string} section
 * @param {HTMLElement} boardEl
 */
function handleColumnAdd(input, section, boardEl) {
  const text = input.value.trim();
  if (!text) return;

  addTodo(text, section);
  input.value = '';
  input.focus();
  renderBoard(boardEl);
}

// ─── Drag & Drop ─────────────────────────────────────────────

/**
 * Wires HTML5 Drag & Drop via event delegation on the board.
 * @param {HTMLElement} boardEl
 */
export function initDragAndDrop(boardEl) {
  boardEl.addEventListener('dragstart', handleDragStart);
  boardEl.addEventListener('dragend', handleDragEnd);
  boardEl.addEventListener('dragover', handleDragOver);
  boardEl.addEventListener('dragleave', handleDragLeave);
  boardEl.addEventListener('drop', handleDrop);
}

/**
 * @param {DragEvent} e
 */
function handleDragStart(e) {
  const card = e.target.closest('.todo-card');
  if (!card) return;

  dragState.id = card.dataset.id;
  dragState.section = card.dataset.section;
  dragState.el = card;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragState.id);

  // Defer adding class so the drag image captures the original style
  requestAnimationFrame(() => card.classList.add('dragging'));
}

/**
 * @param {DragEvent} e
 */
function handleDragEnd(e) {
  if (dragState.el) {
    dragState.el.classList.remove('dragging');
  }

  // Clear all drag-over highlights
  document.querySelectorAll('.column.drag-over').forEach(col => {
    col.classList.remove('drag-over');
  });

  dragState.id = null;
  dragState.section = null;
  dragState.el = null;
}

/**
 * @param {DragEvent} e
 */
function handleDragOver(e) {
  const col = e.target.closest('.column');
  if (!col || !dragState.id) return;

  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';

  // Highlight column
  document.querySelectorAll('.column.drag-over').forEach(c => {
    if (c !== col) c.classList.remove('drag-over');
  });
  col.classList.add('drag-over');
}

/**
 * @param {DragEvent} e
 */
function handleDragLeave(e) {
  const col = e.target.closest('.column');
  if (!col) return;

  // Only remove if truly leaving the column (not just moving to a child)
  if (!col.contains(e.relatedTarget)) {
    col.classList.remove('drag-over');
  }
}

/**
 * @param {DragEvent} e
 */
function handleDrop(e) {
  const col = e.target.closest('.column');
  if (!col || !dragState.id) return;

  e.preventDefault();
  col.classList.remove('drag-over');

  const targetSection = col.dataset.section;
  const referenceId = getDropReferenceId(e.clientY, col);

  reorderTodo(dragState.id, referenceId, targetSection);
  renderBoard(col.closest('#board'));
}

/**
 * Determines which card the dragged item should be inserted before,
 * based on the cursor's Y position.
 * @param {number} clientY
 * @param {HTMLElement} columnEl
 * @returns {string|null}
 */
function getDropReferenceId(clientY, columnEl) {
  const cards = columnEl.querySelectorAll('.todo-card');
  for (const card of cards) {
    if (card === dragState.el) continue;
    const rect = card.getBoundingClientRect();
    if (clientY < rect.top + rect.height / 2) {
      return card.dataset.id;
    }
  }
  return null; // append to end
}
