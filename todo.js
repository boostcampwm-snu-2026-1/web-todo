const STORAGE_KEY = 'my-todos';
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

function saveAndRender() {
    // 로컬 스토리지에 저장
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    render(); // 화면 갱신
}

// 문자열이 유효한지 체크하는 함수
function isEmpty(str){	
    if(typeof str == "undefined" || str == null || str == "")
        return true;
    else
        return false;
}

function addTodo(task){
    const nextId = todos.length > 0 ? Math.max(...todos.map((x) => x.id)) + 1 : 1;
        if(!isEmpty(task)) {
            const data = {
                id: nextId,
                content: task,
                done: false
            };
            todos.push(data); // 배열에 새로운 데이터 추가
            saveAndRender();
        }
}

function toggleTodo(targetId){
    const todoIndex = todos.findIndex(t => t.id === targetId); // 저장된 json 파일에서 인덱스 찾기 (존재하지 않으면 -1)
    if(isNaN(targetId) || todoIndex === -1) {
        return;
    } else {
        todos[todoIndex].done = !todos[todoIndex].done; // 토글 처리
    }
    saveAndRender();
}

function deleteTodo(targetId){
    const todoIndex = todos.findIndex(t => t.id === targetId); // 저장된 json 파일에서 인덱스 찾기 (존재하지 않으면 -1)
    if(isNaN(targetId) || todoIndex === -1) {
        return;
    } else {
        todos.splice(todoIndex, 1); // 삭제 처리
    }
    saveAndRender();
}

function render() {
    todoList.innerHTML = ''; // 리스트 초기화

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.done ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        li.innerHTML = `
            <span class="todo-text">${todo.done ? '✅' : '⬜'} ${todo.content}</span>
            <button class="delete-btn">삭제</button>
        `;
        todoList.appendChild(li);
    });
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo(todoInput.value);
    todoInput.value = '';
});

todoList.addEventListener('click', (e) => {
    const li = e.target.closest('.todo-item');
    if (!li) return;
    
    const id = Number(li.dataset.id);

    if (e.target.classList.contains('delete-btn')) {
        deleteTodo(id);
    } else {
        toggleTodo(id);
    }
});

// 초기 실행
render();