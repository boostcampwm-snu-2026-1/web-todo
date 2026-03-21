import { getTodo, createTodo, deleteTodo, toggleTodo } from "./api.js";
import {render, displayTodayDate} from "./render.js";

let todoList = [];
const listContainer = document.querySelector('#todo-list');

async function init(){
    displayTodayDate();
    console.log("data request...");


    todoList = await getTodo();
    render(todoList, listContainer);
}

listContainer.addEventListener('click', async (e) => {
    const target = e.target;
    const li = target.closest('li');
    if (!li) return;

    const id = li.dataset.id;
    const action = target.dataset.action;

    //delete
    if (action === 'delete') {
        if (!confirm("Do you want to delete this?")) return;
        
        const success = await deleteTodo(id);
        if (success) {
            // 메모리(배열)에서 제거 후 다시 그리기
            todoList = todoList.filter(todo => todo.id !== id);
            render(todoList, listContainer);
        }
    }

    //toggle
    if (action === 'toggle') {
        const targetTodo = todoList.find(todo => String(todo.id) === String(id));

        const updated = await toggleTodo(id, !targetTodo.completed);
        if (updated) {
            targetTodo.completed = !targetTodo.completed;
            render(todoList, listContainer);
        } // slow..
    }

    //update
    if (action === 'edit') {
        handleEdit(li, id);
    }
});

init();