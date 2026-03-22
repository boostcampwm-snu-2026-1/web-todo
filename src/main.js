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

    const tempId = `temp-${Date.now()}`; // 낙관적 업데이트를 위한 임시 ID
    const newTodo = { 
        id: tempId, 
        content: task, 
        done: false
    };

    todos.push(newTodo); // 낙관적 업데이트
    render();

    try {
        const createdTodo = await addTodoApi({ content: task, done: false });
        const index = todos.findIndex(t => t.id === tempId);
        todos[index] = createdTodo; //임시 ID를 서버로부터 받은 실제 ID로 교체
        render();
    } catch (error) { 
        // 롤백 필요
        console.error("추가 실패:", error); 
        todos = todos.filter(t => t.id !== tempId);
        render();
    }
}

async function handleToggleTodo(targetId) {
    const index = todos.findIndex(t => String(t.id) === String(targetId));
    if (index === -1) return;

    const oldStatus = todos[index].done; // 업데이트 이전 상태 저장
    todos[index].done = !oldStatus; // 낙관적 업데이트
    render();

    try {
        await toggleTodoApi(targetId, todos[index].done);
        // 성공할 경우 아무것도 할 필요 없음
    } catch (error) {
        // 롤백 필요
        console.error("수정 실패:", error);
        todos[index].done = oldStatus;
        render();
    }
}

async function handleDeleteTodo(targetId) {
    const previousTodos = [...todos]; // 업데이트 이전 상태 저장
    todos = todos.filter(t => String(t.id) !== String(targetId)); // 낙관적 업데이트
    render();

    try {
        await deleteTodoApi(targetId);
        // 성공할 경우 아무것도 할 필요 없음
    } catch (error) {
        // 롤백 필요
        console.error("삭제 실패:", error);
        todos = previousTodos;
        render();
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