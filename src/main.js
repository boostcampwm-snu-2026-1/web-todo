import { getTodo, createTodo, deleteTodo, toggleTodo } from "./api.js";
import {render, displayTodayDate} from "./render.js";

let todoList = [];

async function init(){
    todoList = await getTodo();
    render();
}



init();