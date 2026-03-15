// ESM 진입점 - 각 모듈을 import하여 앱을 초기화
import { loadTodos, getTodos } from './js/store.js';
import { renderDate, renderTodoList } from './js/render.js';
import { bindEvents } from './js/events.js';

const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('.todo-input');
const todoList = document.querySelector('.todo-list');
const todoDate = document.querySelector('.todo-date');

function init() {
  renderDate(todoDate);
  loadTodos();
  renderTodoList(todoList, getTodos());
  bindEvents(todoForm, todoInput, todoList);
}

init();
