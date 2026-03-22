import { fetchTodos, createTodo, deleteTodo, toggleTodo } from './api.js';

// DOM 요소
const todoList = document.getElementById('todo-list');
const todoInput = document.getElementById('todo-input');
const form = document.querySelector('form');

// 개별 todo 항목의 DOM 요소를 만드는 함수
function createTodoElement(todo) {
  const li = document.createElement('li');
  li.dataset.id = todo.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;

  const span = document.createElement('span');
  span.textContent = todo.title;
  if (todo.completed) span.classList.add('completed');

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '✕';

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}

// 전체 리스트를 다시 그리는 함수
function renderTodos(todos) {
  todoList.innerHTML = '';
  todos.forEach(todo => {
    const li = createTodoElement(todo);
    todoList.appendChild(li);
  });
}

// 폼 submit — POST 요청으로 todo 추가
form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (text === '') return;

  const newTodo = await createTodo(text);
  todoList.appendChild(createTodoElement(newTodo));
  todoInput.value = '';
});

// 이벤트 위임 — ul에 한 번만 등록 (완료 토글 / 삭제)
todoList.addEventListener('click', async function (e) {
  const li = e.target.closest('li');
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.type === 'checkbox') {
    const updated = await toggleTodo(id, e.target.checked);
    const span = li.querySelector('span');
    span.classList.toggle('completed', updated.completed);
  }

  if (e.target.tagName === 'BUTTON') {
    await deleteTodo(id);
    li.remove();
  }
});

// 앱 시작 시 GET 요청으로 초기 데이터 불러오기
async function init() {
  const todos = await fetchTodos();
  renderTodos(todos);
}

init();
