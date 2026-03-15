const todoValue = document.getElementById("todo-input"),
    listItems = document.getElementById("todo-list"),
    addUpdateClick = document.getElementById("AddUpdateClick");
    

    todoValue.addEventListener("keypress", function(e){ // append to list when push Enter
        if(e.key === "Enter"){
            addUpdateClick.click();
        }
    });

let todo = JSON.parse(localStorage.getItem("todo-list"));
if(!todo){
    todo = [];
}

function CreateToDoData() {
    if(todoValue.value===""){
        alert("Please Enter your todo text");
        todoValue.focus(); // back to input box
        return;
    }

    let li = document.createElement("li");
        const todoItems = `
            <div class="todo-left-side">
                <img src="image/check.png" class="check-icon" onclick="CompletedToDoItems(this)" />
                <div title="Click to Complete" class="todo-text">${todoValue.value}</div>
            </div>
            <div class="todo-controls">
                <img class="edit" onclick="UpdateToDoItems(this)" src="image/pencil.png" />
                <img class="delete" onclick="DeleteToDoItems(this)" src="image/delete.png" />
            </div>`;
    li.innerHTML = todoItems;
    listItems.appendChild(li);
    todoValue.value = "";

}

function CompletedToDoItems(e) {
    const todoText = e.nextElementSibling;

    if (todoText.style.textDecoration === "line-through") {
        todoText.style.textDecoration = "";
        e.src = "image/check.png";
    } 
    else {
        todoText.style.textDecoration = "line-through";
        e.src = "image/cancel.png";
    }
}

function UpdateToDoItems(e) { //change text to input box, then return to text
    const li = e.closest('li');
    const todoTextDiv = li.querySelector(".todo-text");
    const currentText = todoTextDiv.innerText; // original text

    if (li.querySelector(".edit-input")) return; //if it has already another input box, cancel the job

    // create new input box on memory
    const input = document.createElement("input");
    input.type = "text";
    input.className = "edit-input";
    input.value = currentText;

    todoTextDiv.style.display = "none"; // hide existing box 
    todoTextDiv.parentElement.insertBefore(input, todoTextDiv);
    input.focus();

    input.addEventListener("keypress", function (event) { // monitor keyboard press
        if (event.key === "Enter") {
            const newText = input.value.trim(); // new text eliminated with each side blank
            

            //update currentText to newText
            if (newText) {
                todo = todo.filter(el => {
                    if (el.item === currentText) {
                        el.item = newText;
                    }
                    return true;
                });

                todoTextDiv.innerText = newText;
                finalizeUpdate();
            }
        }
    });

    //another event listner, finish update when click the out of input box
    input.addEventListener("blur", function () {
        const newText = input.value.trim();
        if (newText) {
            todo = todo.filter(el => {
                if (el.item === currentText) {
                    el.item = newText;
                }
                return true;
            });
            todoTextDiv.innerText = newText;
            finalizeUpdate();
        }
    });


    //eliminate input box
    function finalizeUpdate() {
        input.remove();
        todoTextDiv.style.display = "block";
    }
}

function DeleteToDoItems(e) {
    const li = e.closest('li');
    const deleteValue = li.querySelector(".todo-text").innerText;

    if (confirm(`Do you want to delete this?`)) {
        li.classList.add("deleted-item");
        todoValue.focus();

        todo = todo.filter(el => el.item !== deleteValue);

        setTimeout(() => {
            li.remove();
        }, 100);
    }
}