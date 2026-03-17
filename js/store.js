import { generateId, nowISO } from './utils.js';

const STORAGE_KEY = 'kanban-todos';

/** @type {Todo[]} */
let todos = [];

/**
 * @typedef {Object} Todo
 * @property {string} id
 * @property {string} text
 * @property {'inbox'|'high'|'medium'|'low'} section
 * @property {boolean} completed
 * @property {string} createdAt
 */

/**
 * Loads todos from localStorage into memory.
 */
export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    todos = raw ? JSON.parse(raw) : [];
  } catch {
    todos = [];
  }
}

/**
 * Persists the current todos to localStorage.
 */
export function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (e) {
    console.warn('localStorage save failed:', e);
  }
}

/**
 * Returns a shallow copy of all todos.
 * @returns {Todo[]}
 */
export function getTodos() {
  return [...todos];
}

/**
 * Returns todos for a given section.
 * @param {'inbox'|'high'|'medium'|'low'} section
 * @returns {Todo[]}
 */
export function getTodosBySection(section) {
  return todos.filter(t => t.section === section);
}

/**
 * Adds a single todo to a section.
 * @param {string} text
 * @param {'inbox'|'high'|'medium'|'low'} section
 * @returns {Todo}
 */
export function addTodo(text, section) {
  const todo = { id: generateId(), text, section, completed: false, createdAt: nowISO() };
  todos.push(todo);
  saveToStorage();
  return todo;
}

/**
 * Adds multiple todos (from an inbox dump) to a section.
 * @param {string[]} texts
 * @param {'inbox'|'high'|'medium'|'low'} section
 * @returns {Todo[]}
 */
export function addTodos(texts, section) {
  const created = texts.map(text => ({
    id: generateId(),
    text,
    section,
    completed: false,
    createdAt: nowISO(),
  }));
  todos.push(...created);
  saveToStorage();
  return created;
}

/**
 * Toggles the completed state of a todo by id.
 * @param {string} id
 */
export function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveToStorage();
  }
}

/**
 * Removes a todo by id.
 * @param {string} id
 */
export function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveToStorage();
}

/**
 * Moves a todo to a different section.
 * @param {string} id
 * @param {'inbox'|'high'|'medium'|'low'} targetSection
 */
export function moveTodo(id, targetSection) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.section = targetSection;
    saveToStorage();
  }
}

/**
 * Reorders a todo within (or into) a section.
 * Inserts draggedId before referenceId, or appends to end if referenceId is null.
 * @param {string} draggedId
 * @param {string|null} referenceId
 * @param {'inbox'|'high'|'medium'|'low'} section
 */
export function reorderTodo(draggedId, referenceId, section) {
  if (draggedId === referenceId) return;

  const dragged = todos.find(t => t.id === draggedId);
  if (!dragged) return;

  dragged.section = section;
  todos = todos.filter(t => t.id !== draggedId);

  if (referenceId === null) {
    todos.push(dragged);
  } else {
    const refIndex = todos.findIndex(t => t.id === referenceId);
    if (refIndex === -1) {
      todos.push(dragged);
    } else {
      todos.splice(refIndex, 0, dragged);
    }
  }

  saveToStorage();
}
