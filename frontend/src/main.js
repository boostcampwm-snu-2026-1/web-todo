import { getTodo, createTodo, deleteTodo, toggleTodo, updateTodo } from "./api.js";
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
    const li = target.closest('li'); // DOM tree grammer
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


async function handleEdit(li, id) {
    const textSpan = li.querySelector('.todo-text'); //get text span pointer  from li
    const currentText = textSpan.innerText; // get text before edit
    
    if (li.querySelector('.edit-input')) return; // block race conditon, 

    const input = document.createElement('input'); // new input memory allocation
    input.type = 'text'; // type text
    input.value = currentText; // copy preivous value
    input.className = 'edit-input'; // new class for new input
    
    textSpan.style.display = 'none'; // hide existing text
    textSpan.parentElement.insertBefore(input, textSpan); //insert our input right in front of hidden text
    input.focus(); //force typing without mouse click

    let saving = false;
    //inside routine, action when press key enter
    const finalize = async () => {
        if(saving) return;
        saving = true;

        const newText = input.value.trim();
        

        if (newText && newText !== currentText) {
            const targetTodo = todoList.find(t => String(t.id) === String(id));

            const updated = await updateTodo(id, newText, targetTodo.completed);
            if (updated) targetTodo.item = newText;
        }
        input.remove(); // remove new input
        render(todoList, listContainer);
    };

    input.addEventListener('keydown', (e) => { // detect ESC key when keydown
        if (e.key === 'Enter') {
            e.preventDefault();
            finalize();
        }
         if (e.key === 'Escape') { 
            saving = true;         // set saving = true so that  so that the finalize does not run on blur
            render(todoList, listContainer); //Forced blur event
        }
    });
    
    input.addEventListener('blur', finalize);
}


init();