import { todoApi } from './api.js';

const addBtn = document.querySelector('.add-task');
const input = document.querySelector('.input-task');
const taskContainer = document.querySelector('.container-box');
const errorDiv = document.querySelector('.error-empty');
const dateDisplay = document.querySelector('#today-date')

// 에러 메시지 닫기
document.querySelector('.close-btn').addEventListener('click', function () {
    document.querySelector('.error-empty').classList.remove('show');
});

// 오늘 날짜 표시
const today = new Date()
const date = today.toLocaleDateString('ko-KR');
const days = ['일', '월', '화', '수', '목', '금', '토'];
const day = days[today.getDay()];
dateDisplay.textContent = `${date} (${day})`;

// 할 일 렌더링
function renderTodoItem(todo) {
    let truncatedText = todo.content;
    let titleAttribute = '';

    if (todo.content.length > 15) {
        truncatedText = todo.content.slice(0, 15) + "...";
        titleAttribute = `title="${text}"`;
    }

    const taskHTML = `
        <div class="div-task ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
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

addBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    const text = input.value;

    if (text === '') {
        document.querySelector('.error-empty').classList.add('show');
        return;
    }

    // 서버에 POST
    try {
        const newTodo = await todoApi.create(text);
        renderTodoItem(newTodo);
        input.value = '';
        errorDiv.classList.remove('show');
    } catch (error) {
        console.log("추가 실패:", error);
        alert("서버 저장에 실패했습니다.");
    }
});

taskContainer.addEventListener('click', async function (e) {

    const target = e.target;
    const taskDiv = target.closest('.div-task');
    if (!taskDiv) return;

    const id = taskDiv.dataset.id;

    // 할 일 삭제
    if (target.classList.contains("delete-btn")) {

        e.stopPropagation();
        try {
            const success = await todoApi.delete(id);
            if (success) {
            taskDiv.remove();
            }
        } catch (error) {
            console.log("삭제 실패:", error);
            alert('할 일 삭제에 실패했습니다.');
        }
        return;
    }

    // 할 일 완료
    else {
        const isCurrentlyCompleted = taskDiv.classList.contains('completed');

        try {
            const success = await todoApi.ToggleEvent(id, !isCurrentlyCompleted);
            if (success) {
            taskDiv.classList.toggle('completed');
            }
        } catch (error) {
            console.log("완료 처리 실패:", error);
            alert("서버 통신 중 오류가 발생했습니다.");
        }
    }
});