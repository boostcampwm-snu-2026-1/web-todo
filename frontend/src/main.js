import './styles.css';
import { getTodos, createTodo, removeTodo, updateTodoStatus } from './todoService.js';
import { render, displayDate } from './ui.js';

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoCount = document.getElementById('todo-count');
const dateElement = document.getElementById('current-date');

// 로컬 상태 관리
let currentTodos = [];

// 초기 화면 렌더링
const updateUI = () => render(todos, todoList, todoCount);

// 화면 갱신 통합 함수
async function refreshUI() {
    currentTodos = await getTodos(); 
    render(currentTodos, todoList, todoCount);
}

// 초기 로드
async function init() {
    displayDate(dateElement);
    await refreshUI();
}

// 1. 추가 이벤트
todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        await createTodo(text);
        todoInput.value = '';
        await refreshUI();
    }
});

// 2. 삭제 및 토글 
todoList.addEventListener('click', async (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains('delete-btn')) {
        await removeTodo(id);
        await refreshUI();
    }
});

todoList.addEventListener('change', async (e) => {
    const id = e.target.dataset.id;
    if (e.target.classList.contains('toggle-check')) {
        const todo = currentTodos.find(t => String(t.id) === String(id));
        await updateTodoStatus(id, todo.completed);
        await refreshUI();
    }
});

init();