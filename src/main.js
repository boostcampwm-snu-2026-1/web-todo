import './styles.css';

// =========================
// 상태 및 DOM 요소
// =========================

const API_URL = 'https://69bfbb3d72ca04f3bcb91456.mockapi.io/api/v1/todos';
let todos = [];
// API의 data를 저장할 배열

const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

// =========================
// 화면 렌더링
// =========================

function renderTodos(){ 
    todoList.innerHTML = ''; // 기존 리스트 초기화
    todos.forEach(todo => {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.dataset.id = todo.id; //doneTodo에서 사용할 id 저장

        const span = document.createElement('span');
        span.textContent = todo.content;
        if (todo.completed) {
            span.classList.add('done');
        }
        
        const createdAt = new Date(todo.createdAt);
        const now = createdAt.toLocaleString('ko-KR', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }); //createdAt을 통한 시간 표시

        const timeSpan = document.createElement('span');
        timeSpan.className = 'todo-time';
        timeSpan.textContent = `(${now})`;

        const delBtn = document.createElement('button');
        delBtn.textContent = '🗑';
        delBtn.className = 'del-btn';
        delBtn.dataset.id = todo.id; //deleteTodo에서 사용할 id 저장

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(timeSpan);
        li.appendChild(delBtn);

        todoList.appendChild(li);
    });
}

// =========================
// API
// =========================

async function fetchTodos() {
    try {
        const response = await fetch(API_URL);
        todos = await response.json();
        renderTodos();
    } catch (error) {
        console.error('Failed to fetch todos', error);
    }  
}

async function addTodo(){ //add-btn 동작 함수
    let text = todoInput.value.trim();
    if(text === ''){ // 빈 입력 예외처리
        alert('Tasks cannot be empty!');
        return;
    }
    try{
        await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                createdAt: new Date().toISOString(),
                content: text,
                completed: false
                //id는 서버에서 정리함
            })
        });
        todoInput.value = ''; // 입력창 초기화
        fetchTodos();
    } catch (error) {
        console.error('Failed to add todo', error);
    }
}

async function deleteTodo(id){
    try { 
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        fetchTodos();
        }
    catch (error) {
        console.error('Failed to delete todo', error);
    }
}

async function doneTodo(id){

    const target = todos.find(t => t.id === id);
    if(!target) return;

    const newStatus = !target.completed;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                completed: newStatus
            })
        });
        fetchTodos();
    }
    catch (error) {
        console.error('Failed to update todo', error);
    }
}

// =========================
// 이벤트 리스너
// =========================

addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', function(event){ //enter의 경우에도 click과 같이 동작함
    if(event.key === 'Enter'){
        addTodo();
    }
});

todoList.addEventListener('click', function (event){
    const id = event.target.dataset.id;

    if (event.target.classList.contains('del-btn')){
        deleteTodo(id);
    }
    else if (event.target.classList.contains('checkbox')){
        doneTodo(id);
    }
}); 

// 초기 데이터 로드
fetchTodos();