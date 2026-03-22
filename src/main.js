const BASE_URL = "https://69b93726e69653ffe6a6f05b.mockapi.io/api/v1/todos";

let todos = []; // localStoarge 대신 서버에서 데이터를 받아옴

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const currentDateElement = document.getElementById('current-date');

async function fetchTodos() {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error(`HTTP 에러. 상태: ${response.status}`);

        todos = await response.json();
        render();
    } catch (error) {
        console.error("데이터 로드 실패:", error);
    }
}

async function addTodo(task){
    if(isEmpty(task)) return;

    const data = {
            content: task,
            done: false,
            createdAt: new Date()
        };

    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("서버 저장 실패");

        const createdTodo = await response.json();
        todos.push(createdTodo); // 로컬 배열 업데이트
        render();
    } catch (error) {
        console.error("추가 실패:", error);
    }
    
}

async function toggleTodo(targetId) {
    const index = todos.findIndex(t => String(t.id) === String(targetId));
    if (index === -1) return;

    try {
        const response = await fetch(`${BASE_URL}/${targetId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ done: !todos[index].done })
        });

        if (!response.ok) throw new Error("수정 실패");

        const updatedTodo = await response.json();
        
        // 로컬 배열 업데이트
        todos[index] = updatedTodo;
        render();
    } catch (error) {
        console.error("수정 실패:", error);
    }
}

async function deleteTodo(targetId) {
    try {
        const response = await fetch(`${BASE_URL}/${targetId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error("삭제 실패");

        // 서버에서 삭제 성공 시 로컬 배열에서 필터링
        todos = todos.filter(t => String(t.id) !== String(targetId));
        render();
    } catch (error) {
        console.error("삭제 실패:", error);
    }
}

// 문자열이 유효한지 체크하는 함수
function isEmpty(str){	
    if(typeof str == "undefined" || str == null || str == "")
        return true;
    else
        return false;
}

function displayDate() {
    const now = new Date();
    const WEEKDAY = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dateString = `${now.getFullYear()}.${now.getMonth()+1}.${now.getDate()} ${WEEKDAY[now.getDay()]}`;
    currentDateElement.textContent = dateString;
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
    addTodo(todoInput.value);
    todoInput.value = '';
});

todoList.addEventListener('click', (e) => {
    const li = e.target.closest('.todo-item');
    if (!li) return;
    
    const id = li.dataset.id;

    // 삭제 버튼 클릭 시
    if (e.target.classList.contains('delete-btn')) {
        deleteTodo(id);
    } 
    // 완료/취소 버튼 클릭 시
    else if (e.target.classList.contains('toggle-btn')) {
        toggleTodo(id);
    }
});

// 초기 실행
displayDate();
fetchTodos();