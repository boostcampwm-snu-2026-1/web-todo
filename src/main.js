import { getTodo, createTodo, deleteTodo, toggleTodo } from "./api.js";
import {render, displayTodayDate} from "./render.js";

let todoList = [];

async function init(){
    displayTodayDate();
    console.log("data request...");


    const data = await getTodo();
    const todoContainer = document.querySelector('#todo-list');
    render(data, todoContainer);
}

init();