// html 파일에서 부품 가져오기
const todoInput = document.querySelector('#todo-input'); // todo 입력칸 
const addBtn = document.querySelector('#add-btn'); // 추가 버튼
const todoList = document.querySelector('#todo-list'); // todo 바구니

addBtn.addEventListener('click', function(){ // 버튼이 눌리면
    const text = todoInput.value.trim(); // 사용자가 입력칸에 적은 글자를 text 변수에 담음

    if (text === ''){
        alert('할 일을 먼저 입력해주세요!');
        todoInput.value = '';
        todoInput.focus();
        return;
    }

    // 일정 추가 기능 구현
    const li = document.createElement('li'); // 브라우저에게 html에 없는 태그를 새로 만들어주라고 지시하는 역할
    li.className = 'todo-item';

    li.innerHTML = ` 
        <input type="checkbox" class="complete-checkbox">
        <span class="todo-text">${text}</span>
        <button class="delete-btn">삭제</button>
        `; // 태그 안쪽의 내옹을 통째로 갈아끼우는 속성

    todoList.appendChild(li);

    todoInput.value = '';
    todoInput.focus();
});

todoInput.addEventListener('keypress', function(event){
    if (event.key === 'Enter'){
        addBtn.click();
    }
});

