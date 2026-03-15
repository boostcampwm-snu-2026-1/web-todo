// html 파일에서 부품 가져오기
const todoInput = document.querySelector('#todo-input'); // todo 입력칸 
const addBtn = document.querySelector('#add-btn'); // 추가 버튼
const todoList = document.querySelector('#todo-list'); // todo 바구니

addBtn.addEventListener('click', function(){ // 버튼이 눌리면
    const text = todoInput.value.trim(); // 사용자가 입력칸에 적은 글자를 text 변수에 담음

/* 자바스크립트의 신기한 기능: addEventListener
어떻게 java 파이썬이랑 다르게 무한루프를 돌리는 것도 아닌데 입력에 반응할 수 있는건지 궁금했었음
자바스크립트는 '이벤트 기반(Event-Driven)'이라는 아주 독특하고 똑똑한 방식으로 일하기 때문에 가능함(식당 호출벨 느낌)
addEventLister을 달아두면 자바스크립트는 파일을 끝까지 다 읽은 다음 프로그램을 끝내는 게 아니라 진짜로 대기 상태(수면)에 들어감
나중에 마우스 클릭이 일어나면 파일의 저 위치로 돌아가서 전체를 다시 읽는 게 아니라, 아까 따로 보관해 두었던 알맹이(함수)만 쏙 빼서 실행
*/

    if (text === ''){ // 공백 예외처리
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

todoInput.addEventListener('keypress', function(event){ // 엔터 입력기능 추가
    if (event.key === 'Enter'){
        addBtn.click();
    }
});

todoList.addEventListener('click', function(event){
    const target = event.target;

    if (target.classList.contains('delete-btn')){ // 삭제 버튼 클릭시
        const li = target.parentElement;
        li.remove();
    }

    if (target.classList.contains('complete-checkbox')){ // 체크박스 클릭시
        const li = target.parentElement;
        li.classList.toggle('completed');
    }
});
