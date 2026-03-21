import { getTodo, createTodo, deleteTodo, toggleTodo } from "./api.js";
import {render, displayTodayDate} from "./render.js";

let todoList = [];

const listContainer = document.querySelector('#todo-list');
const todoInput = document.getElementById("todo-input");
const addUpdateClick = document.getElementById("AddUpdateClick");

async function init(){
    displayTodayDate();
    console.log("data request...");


    todoList = await getTodo();
    render(todoList, listContainer);
}

//create

async function createLi() {
    const inputText = todoInput.value;
    console.log("hi");
    
    if(inputText == ""){
        alert("Please Enter your todo text");
        return;
    }

    const newTodo = await createTodo(inputText);

    if(newTodo){
        todoList.push(newTodo);
        render(todoList, listContainer);
        todoInput.value = ""; // why?
    }
}

//Event Listener for todo Input
addUpdateClick.addEventListener("click", createLi);

todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        createLi();
    }
});

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