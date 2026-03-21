// 에러 메시지 닫기
document.querySelector('.close-btn').addEventListener('click', function() {
    document.querySelector('.error-empty').classList.remove('show');
});

// 오늘 날짜 표시
const today = new Date()
const date = today.toLocaleDateString('ko-KR');

const days = ['일', '월', '화', '수', '목', '금', '토'];
const day = days[today.getDay()];

document.querySelector('#today-date').textContent = `${date} (${day})`;

// 할 일 추가
const API_URL = 'https://69bd31e32bc2a25b22add65b.mockapi.io/todos';
const addBtn = document.querySelector('.add-task');
const input = document.querySelector('.input-task');
const taskContainer = document.querySelector('.container-box');
let taskCounter = 1;

function renderTodoItem(todo) {
    let truncatedText = todo.content;
    let titleAttribute = '';

    if (todo.content.length > 15) {
        truncatedText = todo.content.slice(0, 15) + "...";
        titleAttribute = `title="${text}"`;
    }

    const taskHTML = `
        <div class="div-task">
            <form class="relative">
                <label class="finish-task">
                    <span class="checkmark"></span>
                </label>
                <p class="todo-task" ${titleAttribute}>${truncatedText}</p>
                <button type="button" class="delete-btn">삭제</button>
            </form>
        </div>
    `; 

    taskContainer.innerHTML += `${taskHTML}`;
}

addBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    const text = input.value;

    if (text === '') {
        document.querySelector('.error-empty').classList.add('show');
        return;
    }

    // 서버에 POST
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                content: text,
                completed: false
            })
        });

        if (response.ok) {
            const newTodo = await response.json();

            renderTodoItem(newTodo);

            input.value = '';
            document.querySelector('.error-empty').classList.remove('show');
        }
    } catch (error) {
        console.log("추가 실패:", error);
        alert("서버 저장에 실패했습니다.");
    }

    // else if (text.length > 15) {
    //     truncatedText = truncatedText.slice(0, 15) + "...";
    //     titleAttribute = `title="${text}"`
    // }

    // document.querySelector('.error-empty').classList.remove('show');

    // const taskHTML = `
    //     <div class="div-task">
    //         <form class="relative">
    //             <label class="finish-task">
    //                 <span class="checkmark"></span>
    //             </label>
    //             <p class="todo-task" ${titleAttribute}>${truncatedText}</p>
    //             <button type="button" class="delete-btn">삭제</button>
    //         </form>
    //     </div>
    // `;

    // taskContainer.innerHTML += `${taskHTML}`;

    // input.value = '';
    // taskCounter++;
});

taskContainer.addEventListener('click', function(e) {

    const target = e.target.classList

    // 할 일 삭제
    if (target.contains("delete-btn")) {

        e.stopPropagation();
        const taskDiv = e.target.closest('.div-task');
        taskDiv.remove();
        return ;
    }

    // 할 일 완료
    const task = e.target.closest('.div-task');

    if (task) {
        task.classList.toggle('completed');
    }
});