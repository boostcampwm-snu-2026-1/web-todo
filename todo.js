const todoValue = document.getElementById("todo-input"),
    listItems = document.getElementById("todo-list"),
    addUpdateClick = document.getElementById("AddUpdateClick");
    

    todoValue.addEventListener("keypress", function(e){ // enter 누를 때도 list에 추가
        if(e.key === "Enter"){
            addUpdateClick.click();
        }
    });

function CreateToDoData() {
    if(todoValue.value===""){
        alert("Please Enter your todo text");
        todoValue.focus(); // 클릭하는 수고를 덜어주는 서비스
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


