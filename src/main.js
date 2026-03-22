import './styles.css';


const API_URL = 'https://69bfbb3d72ca04f3bcb91456.mockapi.io/api/v1/todos';
let todos = [];
// API의 data를 저장할 배열

async function fetchTodos() {
    try {
        const response = await fetch(API_URL);
        todos = await response.json();
        renderTodos();
    } catch (error) {
        console.error('Failed to fetch todos', error);
    }  
}

fetchTodos();
// API에서 todos를 가져와서 렌더링하는 함수

const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

async function addTodo(){ //add-btn 동작 함수
    let text = todoInput.value.trim();
    if(text === ''){ // 빈 입력 예외처리
        alert('Tasks cannot be empty!');
        return;
    }

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
}

function renderTodos(){ // 화면에 todos를 렌더링하는 함수
    todoList.innerHTML = ''; // 기존 리스트 초기화
    todos.forEach(todo => {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.checked = todo.completed;

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
        });

        const timeSpan = document.createElement('span');
        timeSpan.className = 'todo-time';
        timeSpan.textContent = `(${now})`;

        const delBtn = document.createElement('button');
        delBtn.textContent = '🗑';
        delBtn.className = 'del-btn';

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(timeSpan);
        li.appendChild(delBtn);

        todoList.appendChild(li);
    });
}

addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', function(event){ //enter의 경우에도 click과 같이 동작함
    if(event.key === 'Enter'){
        addTodo();
    }
});

function deleteTodo(event){
    const li = event.target.parentElement;
    const text = li.querySelector('span').textContent;

    todos = todos.filter(todo => todo.content !== text); 
    // content가 일치하지 않는 todo만 남김
    localStorage.setItem('todos', JSON.stringify(todos)); 
    // 변경된 todos 배열을 localStorage에 저장
    renderTodos(); // 변경된 todos 배열을 화면에 다시 렌더링
}

function doneTodo(event){

    const li = event.target.parentElement;
    const text = li.querySelector('span').textContent;

    const todo = todos.find(todo => todo.content === text);
    if (todo) {
        todo.completed = event.target.checked; // 체크박스 상태에 따라 completed 속성 업데이트
    }
    localStorage.setItem('todos', JSON.stringify(todos)); // 변경된 todos 배열을 localStorage에 저장
    renderTodos(); // 변경된 todos 배열을 화면에 다시 렌더링
}

todoList.addEventListener('click', function (event){
    if (event.target.classList.contains('del-btn')){
        deleteTodo(event);
    }
    else if (event.target.classList.contains('checkbox')){
        doneTodo(event);
    }
});

renderTodos();