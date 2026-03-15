const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

function addTodo(){ //add-btn 동작 함수
    let text = todoInput.value.trim();
    if(text === ''){ // 빈 입력 예외처리
        alert('Tasks cannot be empty!');
        return;
    }

    let li = document.createElement('li');

    let checkbox = document.createElement('input');
    checkbox.type ='checkbox';
    checkbox.classList.add('checkbox');

    let span = document.createElement('span');
    span.textContent = text;

    let deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('del-btn');
    
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn); //li에 span(text), button 추가
    
    todoList.appendChild(li);

    todoInput.value = '';
    todoInput.focus();
}

addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', function(event){ //enter의 경우에도 click과 같이 동작함
    if(event.key === 'Enter'){
        addTodo();
    }
});

function deleteTodo(event){
    if(event.target.classList.contains('del-btn')){
        let li = event.target.parentElement;
        li.remove();
    }
}

function doneTodo(event){
    let li = event.target.parentElement;
    let span = li.querySelector('span');

    if (event.target.checked){
        span.classList.add('done');
    } else {
        span.classList.remove('done');
    }
}

todoList.addEventListener('click', function (event){
    if (event.target.classList.contains('del-btn')){
        deleteTodo(event);
    }
    else if (event.target.classList.contains('checkbox')){
        doneTodo(event);
    }
});