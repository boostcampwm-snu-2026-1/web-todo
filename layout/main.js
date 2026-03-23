import { todoApi } from './api.js';
import {ui} from './ui.js';

// 이벤트 초기 로드
window.addEventListener('DOMContentLoaded', async function() {
    const todos = await todoApi.getAll();
    todos.forEach(function(todo) {
        ui.renderTodoItem(todo);
    })
});

// 에러 메시지 닫기
document.querySelector('.close-btn').addEventListener('click', function () {
    ui.toggleError(false);
});

// 오늘 날짜 표시
ui.displayDate();

// 할 일 렌더링
ui.elements.addBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    const text = ui.elements.input.value;

    if (text === '') {
        ui.toggleError(true);
        return;
    }

    // 서버에 POST
    try {
        const newTodo = await todoApi.create(text);
        ui.renderTodoItem(newTodo);
        ui.clearInput();
        ui.toggleError(false);
    } catch (error) {
        console.log("추가 실패:", error);
        alert("서버 저장에 실패했습니다.");
    }
});

ui.elements.taskContainer.addEventListener('click', async function (e) {

    const target = e.target;
    const taskDiv = target.closest('.div-task');
    if (!taskDiv) return;

    const id = taskDiv.dataset.id;

    // 할 일 삭제
    if (target.classList.contains("delete-btn")) {

        e.stopPropagation();
        try {
            if (await todoApi.delete(id)) {
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
            if (await todoApi.ToggleEvent(id, !isCurrentlyCompleted)) {
                taskDiv.classList.toggle('completed');
            }
        } catch (error) {
            console.log("완료 처리 실패:", error);
            alert("서버 통신 중 오류가 발생했습니다.");
        }
    }
});