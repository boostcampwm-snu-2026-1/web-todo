// 1. 데이터: todo 목록을 배열로 관리
const todos = [];

// 2. DOM 요소 가져오기
const todoList = document.getElementById('todo-list');

// 3. 개별 todo 항목의 DOM 요소를 만드는 함수
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.dataset.id = todo.id;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;

    const span = document.createElement('span');
    span.textContent = todo.text;
    if (todo.completed) span.classList.add('completed');

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    return li;
}

// 4. 전체 리스트를 다시 그리는 함수
function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = createTodoElement(todo);
        todoList.appendChild(li);
    });
}

// 5. DOM 요소 가져오기 (입력창, 폼)
const todoInput = document.getElementById('todo-input');
const form = document.querySelector('form');

// 6. todo 추가 함수
function addTodo(text) {
    const newTodo = {
        id: Date.now(),   // 고유 ID (현재 시각 숫자)
        text: text,
        completed: false
    };
    todos.push(newTodo);
    renderTodos();
}

// 7. 폼 submit 이벤트 등록
form.addEventListener('submit', function(e) {
    e.preventDefault();   // 페이지 새로고침 방지
    const text = todoInput.value.trim();
    if (text === '') return;   // 빈 입력 무시
    addTodo(text);
    todoInput.value = '';   // 입력창 비우기
});

// 8. 완료 토글 함수
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id );
    todo.completed = !todo.completed;
    renderTodos();
}

// 9. 삭제 함수
function deleteTodo(id) {
    const index = todos.findIndex(t => t.id === id);
    todos.splice(index, 1);
    renderTodos();
}

// 10. 이벤트 위임 — ul에 한 번만 등록
todoList.addEventListener('click', function(e) {
    const li = e.target.closest('li');
    if (!li) return;
    const id = Number(li.dataset.id);

    if (e.target.type === 'checkbox') {
        toggleTodo(id);
    }
    if (e.target.tagName === 'BUTTON') {
        deleteTodo(id);
    }
});