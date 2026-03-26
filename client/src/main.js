import './style.css';
import { getTodos, createTodo, deleteTodoApi, toggleTodoApi } from './api.js';
import { renderTodos, displayDate } from './render.js';

const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

let todos = []; 

async function fetchAndRender() {
    todos = await getTodos(); 
    renderTodos(todos);     
}

async function handleAddTodo() {
    const content = todoInput.value.trim();
    if (!content) {
        alert('내용을 입력해주세요!');
        return;
    }

    await createTodo(content); 
    todoInput.value = '';
    todoInput.focus();
    
    await fetchAndRender(); 
}

async function init() {
    displayDate();     
    await fetchAndRender(); 
}

addBtn.addEventListener('click', handleAddTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddTodo();
});

todoList.addEventListener('click', async (e) => {
    const target = e.target;
    const li = target.closest('.todo-item');
    if (!li) return;

    const id = li.dataset.id; 

    if (target.classList.contains('delete-btn')) {
        if (confirm('정말 삭제하시겠습니까?')) {
            await deleteTodoApi(id); 
            await fetchAndRender();
        }
    } 
    else if (target.classList.contains('toggle-checkbox')) {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            await toggleTodoApi(id, todo.done); 
            await fetchAndRender();
        }
    }
});

init();