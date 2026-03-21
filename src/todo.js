// html 파일에서 부품 가져오기
const todoInput = document.querySelector('#todo-input'); // todo 입력칸 
const addBtn = document.querySelector('#add-btn'); // 추가 버튼
const todoList = document.querySelector('#todo-list'); // todo 바구니
const API_URL = 'https://69b93649e69653ffe6a6ebf9.mockapi.io/todoweb'; // 백엔드 API

addBtn.addEventListener('click', async function(){ // 서버 통신을 위해 async 함수로 교체
    const text = todoInput.value.trim(); // 버튼이 눌리면 사용자가 입력칸에 적은 글자를 text 변수에 담음

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

    const newTodo = { // 서버에 보낼 데이터 구조. MockAPI는 기본적으로 할 일 내용을 'name'이라는 이름으로 받음
        name: text,
        completed: false
    };

    try {
        const response = await fetch(API_URL, { // 서버 API에 데이터 저장해달라고 POST 요청을 보냄
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTodo)
        });

        if (response.ok) {
            todoInput.value = '';
            todoInput.focus();

            loadTodos(); // 화면에 방금 추가한 할일 목록을 보여주기 위해 최신 목록을 다시 가져옴
        } else {
            console.error("서버에 저장하는데 실패했습니다.");
        }

    } catch (error) {
        console.error("통신 에러가 발생했습니다!", error);
    }
});

todoInput.addEventListener('keypress', function(event){ // 엔터 입력기능 추가
    if (event.key === 'Enter'){
        addBtn.click();
    }
});

todoList.addEventListener('click', async function(event){
    const target = event.target;

    if (target.classList.contains('delete-btn')){ // 삭제 버튼 클릭시
        const id = target.getAttribute('data-id');
        
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                loadTodos();
            }
        } catch (error) {
            console.error("삭제 중 에러가 발생했습니다!", error);
        }
    }

    if (target.classList.contains('complete-checkbox')){ // 체크박스 클릭시
        const id = target.getAttribute('data-id');
        const isCompleted = target.checked;
        
        const li = target.parentElement;
        li.classList.toggle('completed');

        try {
            /* PUT 수정을 할 때는 POST와는 다르게 URL 뒤에 id를 붙여서 누구를 수정할지 정확히 타겟팅하고
            바꾸고 싶은 속성(completed)만 골라서 보내주면 서버가 알아서 덮어쓰기 해줌 */
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: isCompleted }) 
            });

            if (!response.ok) {
                console.error("서버 업데이트 실패!");
            }
        } catch (error) {
            console.error("수정 중 에러가 발생했습니다!", error);
        }
    }
});

function renderTodos(todoArray){ // 렌더링 함수 -> 서버에서 데이터를 받아 데이터 각각의 태그 생성
    todoList.innerHTML = ''; // 바구니 비우기

    todoArray.forEach(function(todo) {
        const li = document.createElement('li');
        li.className = 'todo-item';

        if (todo.completed) { // 서버에서 가져온 데이터가 완료 상태인 경우
            li.classList.add('completed');
        }

        li.innerHTML = `
            <input type="checkbox" class="complete-checkbox" data-id="${todo.id}" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${todo.name}</span>
            <button class="delete-btn" data-id="${todo.id}">삭제</button>
        `; // todo.id로 각 데이터의 고유번호 숨겨놓음
        todoList.appendChild(li);
    });
}

async function loadTodos() { // 비동기함수 : 이 함수 안에는 await 필요하다고 선언
    /*
    async가 붙은 함수는 무조건 결과값을 Promise라는 객체에 써서 반환
    await을 만나면 함수를 잠시 멈춰두고 브라우저의 메인 쓰레드를 비워줌.
    그래서 그동안 화면 스크롤을 내리거나 다른 버튼을 클릭하는 등 다른 동작 가능 --> 비동기의 핵심
    동작 완료됐다면 await 다음 줄부터 다시 재생
    */
    try {
        const response = await fetch(API_URL); // 서버에 데이터 달라고 요청
        const data = await response.json();
        
        renderTodos(data); // 렌더링 함수 호출

    } catch (error) {
        console.error("데이터를 가져오는 중 에러가 발생했습니다!", error);
    }
}

loadTodos();