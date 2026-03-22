/* 메인 실행 */

import { fetchTodosApi, addTodoApi, toggleTodoApi, deleteTodoApi } from './api.js';
import { isEmpty, getFormattedDate } from './utils.js';

let todos = []; // localStoarge 대신 서버에서 데이터를 받아옴

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const currentDateElement = document.getElementById('current-date');

async function handleFetchTodos() {
    try {
        todos = await fetchTodosApi();
        render();
    } catch (error) { 
        console.error("데이터 로드 실패:", error); 
    }
}

async function handleAddTodo(task) {
    if (isEmpty(task)) return;
    const data = { content: task, done: false, createdAt: new Date() };
    try {
        const createdTodo = await addTodoApi(data);
        todos.push(createdTodo); // 로컬 배열 업데이트
        render();
    } catch (error) { 
        console.error("추가 실패:", error); 
    }
}

async function handleToggleTodo(targetId) {
    const index = todos.findIndex(t => String(t.id) === String(targetId));
    if (index === -1) return;
    try {
        const updatedTodo = await toggleTodoApi(targetId, !todos[index].done);
        todos[index] = updatedTodo; // 로컬 배열 업데이트
        render();
    } catch (error) {
        console.error("수정 실패:", error);
    }
}

async function handleDeleteTodo(targetId) {
    try {
        await deleteTodoApi(targetId);
        todos = todos.filter(t => String(t.id) !== String(targetId)); // 서버에서 삭제 성공 시 로컬 배열에서 필터링
        render();
    } catch (error) {
        console.error("삭제 실패:", error);
    }
}

function render() {
    todoList.innerHTML = ''; // 리스트 초기화

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.done ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        li.innerHTML = `
            <button class="toggle-btn" title="${todo.done ? '취소' : '완료'}">
                ${todo.done ? '✓' : ''}
            </button>
            <span class="todo-text">${todo.content}</span>
            <button class="delete-btn" title="삭제">🗑</button>
        `;
        todoList.appendChild(li);
    });
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleAddTodo(todoInput.value);
    todoInput.value = '';
});

todoList.addEventListener('click', (e) => {
    const li = e.target.closest('.todo-item');
    if (!li) return;
    
    const id = li.dataset.id;

    // 삭제 버튼 클릭 시
    if (e.target.classList.contains('delete-btn')) {
        handleDeleteTodo(id);
    } 
    // 완료/취소 버튼 클릭 시
    else if (e.target.classList.contains('toggle-btn')) {
        handleToggleTodo(id);
    }
});

// 초기 실행
currentDateElement.textContent = getFormattedDate();
handleFetchTodos();