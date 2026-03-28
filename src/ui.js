export const ui = {
    // 자주 쓰는 변수 정의
    elements: {
        addBtn: document.querySelector('.add-task'),
        input: document.querySelector('.input-task'),
        taskContainer: document.querySelector('.container-box'),
        errorDiv: document.querySelector('.error-empty'),
        dateDisplay: document.querySelector('#today-date')
    },

    // 오늘 날짜 렌더링
    displayDate() {
        const today = new Date()
        const date = today.toLocaleDateString('ko-KR');
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const day = days[today.getDay()];
        this.elements.dateDisplay.textContent = `${date} (${day})`;
    },

    // 할 일 추가 렌더링
    renderTodoItem(todo) {
        let truncatedText = todo.content;
        let titleAttribute = '';

        if (todo.content.length > 15) {
            truncatedText = todo.content.slice(0, 15) + "...";
            titleAttribute = `title="${todo.content}"`;
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

        this.elements.taskContainer.innerHTML += `${taskHTML}`;
    },

    // 에러 메시지 토글 렌더링
    toggleError(show) {
        if (show) this.elements.errorDiv.classList.add('show');
        else this.elements.errorDiv.classList.remove('show');
    },

    // 입력 값 초기화
    clearInput() {
        this.elements.input.value = '';
    }
}