import { fetchTodos, createTodo, toggleTodo, deleteTodo } from './api.js';

// DOM 요소 선택
const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const countAll = document.querySelector('#count-all');
const countActive = document.querySelector('#count-active');

// Toast 컨테이너 생성
const toastContainer = document.createElement('div');
toastContainer.id = 'toast-container';
document.body.appendChild(toastContainer);

function showToast(message, type = 'error') {
    const toast = document.createElement('div');
    toast.classList.add('toast', `toast-${type}`);
    toast.textContent = message;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}

// 전역 상태
let todos = [];

/**
 * todo 아이템 DOM 요소 생성
 */
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    if (todo.done) li.classList.add('done');
    li.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;

    const span = document.createElement('span');
    span.classList.add('todo-text');
    span.textContent = todo.title;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn-delete');
    deleteBtn.textContent = '✕';

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    return li;
}

/**
 * 카운트 정보 업데이트
 */
function updateCounts() {
    countAll.textContent = todos.length;
    countActive.textContent = todos.filter(t => !t.done).length;
}

/**
 * todo 리스트 화면 렌더링
 */
function render() {
    list.innerHTML = '';

    const fragment = document.createDocumentFragment();
    todos.forEach(todo => {
        fragment.appendChild(createTodoElement(todo));
    });
    list.appendChild(fragment);

    updateCounts();
}

/**
 * 새로운 todo 추가 처리
 */
async function handleAddTodo(e) {
    e.preventDefault();

    const title = input.value.trim();
    if (!title) return;

    try {
        const newTodo = await createTodo(title);
        todos.push(newTodo);
        input.value = '';
        render();
    } catch (error) {
        showToast('Todo 추가에 실패했습니다. 다시 시도해주세요.');
    }
}

/**
 * todo 삭제 처리
 */
async function handleDeleteTodo(id) {
    try {
        await deleteTodo(id);
        todos = todos.filter(t => t.id !== id);
        render();
    } catch (error) {
        showToast('Todo 삭제에 실패했습니다. 다시 시도해주세요.');
    }
}

/**
 * todo 완료 상태 토글 처리
 */
async function handleToggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
        const updated = await toggleTodo(id, todo.done);
        todos = todos.map(t => t.id === id ? updated : t);
        render();
    } catch (error) {
        showToast('Todo 상태 변경에 실패했습니다. 다시 시도해주세요.');
    }
}

/**
 * todo 리스트 클릭 이벤트 처리
 */
async function handleListClick(e) {
    const li = e.target.closest('li');
    if (!li) return;

    const id = li.dataset.id;

    if (e.target.matches('.btn-delete')) {
        await handleDeleteTodo(id);
        return;
    }

    if (e.target.matches('input[type="checkbox"]')) {
        await handleToggleTodo(id);
    }
}

/**
 * 앱 초기화: 서버에서 todo 목록 가져오기
 */
async function init() {
    todos = await fetchTodos();
    render();
}

// 이벤트 리스너 등록
form.addEventListener('submit', handleAddTodo);
list.addEventListener('click', handleListClick);

// 앱 시작
init();


