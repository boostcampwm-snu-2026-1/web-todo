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
const addBtn = document.querySelector('.add-task');
const input = document.querySelector('.input-task');
const taskContainer = document.querySelector('.container-box');
let taskCounter = 1;

addBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const text = input.value;
    let truncatedText = text;
    let titleAttribute = '';

    if (text === '') {
        document.querySelector('.error-empty').classList.add('show');
        return;
    }

    else if (text.length > 15) {
        truncatedText = truncatedText.slice(0, 15) + "...";
        titleAttribute = `title="${text}"`
    }

    document.querySelector('.error-empty').classList.remove('show');

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

    input.value = '';
    taskCounter++;
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