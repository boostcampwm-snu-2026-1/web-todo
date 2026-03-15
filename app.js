import { todos, addTodo, deleteTodo, toggleTodo } from './todoService.js';
import { render, displayDate } from './ui.js';

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoCount = document.getElementById('todo-count');
const dateElement = document.getElementById('current-date');

// 초기 화면 렌더링
const updateUI = () => render(todos, todoList, todoCount);

displayDate(dateElement);
updateUI();

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        addTodo(text);
        todoInput.value = '';
        updateUI();
    }
});

todoList.addEventListener('click', (e) => {
    const id = Number(e.target.dataset.id);
    if (e.target.classList.contains('delete-btn')) {
        deleteTodo(id);
        updateUI();
    }
});

todoList.addEventListener('change', (e) => {
    const id = Number(e.target.dataset.id);
    if (e.target.classList.contains('toggle-check')) {
        toggleTodo(id);
        updateUI();
    }
});